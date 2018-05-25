import saveOrUpate from './util/saveUpdate';
import price from './price';
import events from './events/events';
import series from './util/series';
import _m from './util/bigMath';
import checker from './util/checker';

const MIN_CONFIRMED = 6;


const Sequelize = require('sequelize');
const models = require('../models');
const Op = Sequelize.Op;

const ethereum_address = require('ethereum-address');
const bitcoin_address = require('bitcoin-address');


export default {
    getTokens,
    getByAccount,
    saveAllTransactionsETH,
    saveAllTransactionsBTC,
    calcTransactionDataAndSave,


};

function getByAccount(accountId) {
    if (!accountId) throw 'Transaction: accountId not defined';

    return models.Transactions.findAll({ where: { accountId: accountId } })
        .then((transactions) => {
            if (!transactions) transactions = [];
            return transactions;
        });
}

function getTokens(accountId) {
    if (!accountId) throw 'Transaction: accountId not defined';
    let req = {
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
            let tok = {};
            tok.tokens = tokens.dataValues.totalTokens;
            tok.confirmed = tokens.dataValues.confirmed > MIN_CONFIRMED;
            postContract(tok);
            return tok;
        });

    function postContract(data) {
        if (!data.tokens) throw 'Transaction getTokens: tokens not defined';
        if (isNaN(parseFloat(data.tokens)) || !isFinite(data.tokens)) throw 'Transaction getTokens: tokens is not a Number';
        if (parseFloat(data.tokens) < 0) throw 'Transaction getTokens: negative tokens';
        if (!('confirmed' in data)) throw 'Transaction getTokens: confirmation is not defined';
    }
}



function saveAllTransactionsETH(transactions) {
    return series.forEach(transactions, 0, tx => {
        return price.getByTime(tx.time)
            .then(prices => {
                return calcTransactionDataAndSave('ETH', prices.ethDollarPrice, tx.accountId, prices, tx);
            });
    })
}

function saveAllTransactionsBTC(transactions) {
    return series.forEach(transactions, 0, tx => {
        return price.getByTime(tx.time)
            .then(prices => {
                return calcTransactionDataAndSave('BTC', prices.btcDollarPrice, tx.accountId, prices, tx);
            });
    });
}

function calcTransactionDataAndSave(currency, currencyPrice, accountId, prices, tx) {
    if (!currency) throw 'Transaction: currency not defined';
    if (!currencyPrice) throw 'Transaction: currencyPrice not defined';
    if (!accountId) throw 'Transaction: accountId not defined';
    checker.checkPricesProperties(prices);
    checker.checkInternalTransacitonProperties(tx);

    let row = {};
    row.blockchainTxId = tx.hash;
    row.currency = currency;
    row.accountId = accountId;
    row.dollarRate = currencyPrice;
    row.dollarTokenRate = prices.dollarPrice;
    row.discount = prices.discount;
    row.confirmations = tx.confirmations;
    row.amount = _m.norm(tx.value);
    row.time = tx.time;


    let discount = _m.newD(prices.discount).add(_m.ONE);
    let value = tx.value;
    let dollarRate = _m.newD(currencyPrice);
    let dollarPrice = _m.newD(prices.dollarPrice);
    row.tokens = _m.norm(value.multiply(dollarRate).multiply(dollarPrice).multiply(discount));

    let options = {
        where: {
            blockchainTxId: row.blockchainTxId
        }
    };
    return saveOrUpate.saveOrUpdate(row, options, models.Transactions)
        .then((x) => {
            if (x.action === 'insert') {
                events.eventEmitter.emit('investment', accountId, tx.hash);
            }
        });
}