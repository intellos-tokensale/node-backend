module.exports = {
    getLast,
    getByTime,
    priceNowByExchange,
    fetchPairToDB
};

const discount = require('./discount');
const config = require('../config');
const _m = require('./util/bigMath');
const checker = require('./util/checker');
const price = require('../api/price');
const logger = require('./logger');

const models = require('../models');
const Sequelize = require('sequelize');
const coinTicker = require('coin-ticker');
const Op = Sequelize.Op;

const CoinMarketCap = require('node-coinmarketcap');
const coinmarketcap = new CoinMarketCap();


function getLast() {
    return getByTime(Date.now());
}

function getByTime(time) {
    checker.checkTime(time, 'Fetch Price:');
    time = time * 1;

    let req = {
        where: {
            time: {
                [Op.lt]: time,
                [Op.gt]: time - 2 * 60 * 1000
            }
        },
        attributes: [
            [Sequelize.fn('avg', Sequelize.col('btcDollarPrice')), 'btcDollarPrice'],
            [Sequelize.fn('avg', Sequelize.col('ethDollarPrice')), 'ethDollarPrice'],
            [Sequelize.fn('avg', Sequelize.col('wanDollarPrice')), 'wanDollarPrice'],
            [Sequelize.fn('avg', Sequelize.col('dollarPrice')), 'dollarPrice']
        ]
    };
    let prices;
    return models.Prices.findOne(req)
        .then((data) => {
            prices = data.dataValues;
            prices.btcDollarPrice = prices.btcDollarPrice || -1;
            prices.ethDollarPrice = prices.ethDollarPrice || -1;
            prices.dollarPrice = prices.dollarPrice || -1;
            prices.wanDollarPrice = prices.wanDollarPrice || -1;
            return discount.get(time);
        })
        .then(discount => {
            prices.discount = discount.discount;
            prices.discountUntil = discount.to;
            checker.checkPricesProperties(prices);
            return prices;
        });

}


function priceNowByExchange() {
    fetchPairToDB('coinbase');
    fetchPairToDB('bitstamp');
    //fetchPairToDB('poloniex');
    fetchPairToDB('gdax');
    //fetchPairToDB('kraken');
    fetchPairToDB('bitfinex');
    //   fetchPairToDB('okcoin');
    //   fetchPairToDB('exmo');
    //   fetchPairToDB('bittrex');
    //   fetchPairToDB('bitcoinaverage');
}

function fetchPairToDB(exchange) {
    if (!exchange) throw new Error('exchange not set');

    let row = {
        btcDollarPrice: -1,
        ethDollarPrice: -1,
        wanDollarPrice: -1,
        dollarPrice: config.general.dollarPrice,
        exchange: exchange
    };

    return coinTicker(exchange, 'btc_usd')
        .then((data) => {
            logger.info('btc last', data.last);
            row.btcDollarPrice = _m.norm(_m.newD(data.last));
            return coinTicker(exchange, 'eth_usd');
        })
        .then((data) => {
            logger.info('eth last', data.last);
            row.ethDollarPrice = _m.norm(_m.newD(data.last));
            return fetchWan();
        })
        .then((data) => {
            logger.info('wan last', data.last);
            row.wanDollarPrice = _m.norm(_m.newD(data.last));
            return getLast();
        })
        .then((lastaverage) => {
            return checker.priceRowPlausabilityCheck(row, lastaverage);
        })
        .then(() => {
            row.time = Date.now();
            return models.Prices.create(row);
        })
        .catch((err) => {
            logger.info('we had an error fetchin data=require(' + exchange, row, err);
        });
}

let lastWanPrice = -1;

function fetchWan() {
    return new Promise(function(resolve, reject) {
        let done = false;
        let data = {};
        coinmarketcap.get("wanchain", coin => {
            if (done) return;

            if (coin && coin.price_usd) lastWanPrice = data.last = coin.price_usd;
            else data.last = lastWanPrice;
            done = true;
            resolve(data);
        });
        setTimeout(() => {
            if (done) return;
            data.last = lastWanPrice;
            resolve(data);
        }, 2000);
    });
}