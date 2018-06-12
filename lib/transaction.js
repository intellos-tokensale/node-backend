module.exports = {
    getTokens,
    getByAccount,
    saveAllTransactionsETH,
    saveAllTransactionsBTC,
    calcTransactionDataAndSave,
};

const saveOrUpate = require('./util/saveUpdate');
const price = require('./price');
const series = require('./util/series');
const _m = require('./util/bigMath');
const checker = require('./util/checker');
const events = require('./events/events');

const MIN_CONFIRMED = 6;


const Sequelize = require('sequelize');
const models = require('../models');
const Op = Sequelize.Op;

const ethereum_address = require('ethereum-address');
const bitcoin_address = require('bitcoin-address');



function getByAccount(accountId) {
    if (!accountId) throw new Error('Transaction: accountId not defined');

    return models.Transactions.findAll({ where: { accountId: accountId }, limit: 10 })
        .then((transactions) => {
            if (!transactions) transactions = [];
            return transactions;
        });
}

function getTokens(accountId) {
    if (!accountId) throw new Error('Transaction: accountId not defined');
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
        if (!data.tokens) throw new Error('Transaction getTokens: tokens not defined');
        if (isNaN(parseFloat(data.tokens)) || !isFinite(data.tokens)) throw new Error('Transaction getTokens: tokens is not a Number');
        if (parseFloat(data.tokens) < 0) throw new Error('Transaction getTokens: negative tokens');
        if (!('confirmed' in data)) throw new Error('Transaction getTokens: confirmation is not defined');
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
    if (!currency) throw new Error('Transaction: currency not defined');
    if (!currencyPrice) throw new Error('Transaction: currencyPrice not defined');
    if (!accountId) throw new Error('Transaction: accountId not defined');
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
                events.eventEmitter.emit(events.EVENT_INVESTMENT, accountId, tx.hash);
            }
        });
}