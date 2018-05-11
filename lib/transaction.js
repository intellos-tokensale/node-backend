import btcService from './services/bitcoinService';
import ethService from './services/ethereumService';
import saveOrUpate from './util/saveUpdate';
import price from './price';
import eventEmitter from './eventHandler';

const MIN_CONFIRMED = 6;


var bigdecimal = require("bigdecimal");
var DOWN = bigdecimal.RoundingMode.DOWN();
var ONE = new bigdecimal.BigDecimal('1');
var Sequelize = require('sequelize');
var models = require('../models');
const Op = Sequelize.Op;

export default {
    updateForBTCAddress,
    updateForETHAddress,
    getTokens,
    getByAccount

};

function getByAccount(accountId) {
    return models.Transactions.findAll({ where: { accountId: accountId } })
        .then((transactions) => {
            if (!transactions) transactions = [];
            return transactions;
        });
}

function getTokens(accountId) {

    var req = {
        where: {
            accountId: accountId
        },
        attributes: [
            [Sequelize.fn('sum', Sequelize.col('tokens')), 'totalTokens'],
            [Sequelize.fn('min', Sequelize.col('confirmations')), 'confirmed']
        ]
    };

    return models.Transactions.findOne(req)
        .then((tokens) => {
            var tok = {};
            tok.tokens = tokens.dataValues.totalTokens;
            tok.confirmed = tokens.dataValues.confirmed > MIN_CONFIRMED;
            return tok;
        });
}

function updateForBTCAddress(address, accountId) {

    return btcService.getTransactionsByAddress(address)
        .then(transactions => {
            return for_each(transactions, 0, tx => {
                return price.getByTime(tx.time)
                    .then(prices => {
                        return calcTransactionDataAndSave('BTC', prices.btcDollarPrice, accountId, prices, tx);

                    });
            });
        });
}

function updateForETHAddress(address, accountId) {
    return ethService.getTransactionsByAddress(address)
        .then(transactions => {
            return for_each(transactions, 0, tx => {
                return price.getByTime(tx.time)
                    .then(prices => {

                        return calcTransactionDataAndSave('ETH', prices.ethDollarPrice, accountId, prices, tx);

                    });
            });
        });
}

function calcTransactionDataAndSave(currency, currencyPrice, accountId, prices, tx) {
    var row = {};
    row.blockchainTxId = tx.hash;
    row.currency = currency;
    row.accountId = accountId;
    row.dollarRate = currencyPrice;
    row.dollarTokenRate = prices.dollarPrice;
    row.discount = prices.discount;

    row.amount = tx.value;

    var discount = new bigdecimal.BigDecimal(prices.discount);
    discount = discount.add(ONE);

    var value = new bigdecimal.BigDecimal(tx.value);
    var dollarRate = new bigdecimal.BigDecimal(currencyPrice);
    var dollarPrice = new bigdecimal.BigDecimal(prices.dollarPrice);

    row.tokens = value.multiply(dollarRate).multiply(dollarPrice).multiply(discount).divide(ONE, 20, DOWN) + "";
    row.confirmations = tx.confirmations | 0;
    row.time = tx.time;
    var options = {
        where: {
            blockchainTxId: row.blockchainTxId
        }
    };
    return saveOrUpate.saveOrUpdate(row, options, models.Transactions)
        .then((x) => {
            if (x.action === 'insert') {
                eventEmitter.emit('investment', accountId, tx.hash);
            }
        })
}


function for_each(array, i, func) {
    if (i >= array.length) {
        return Promise.resolve({});
    }
    return func(array[i]).then(() => {
        return for_each(array, i + 1, func);
    });
}