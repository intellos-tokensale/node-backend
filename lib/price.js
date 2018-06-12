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
    fetchPairToDB('poloniex');
    fetchPairToDB('gdax');
}

function fetchPairToDB(exchange) {
    if (!exchange) throw new Error('exchange not set');

    let row = {
        btcDollarPrice: -1,
        ethDollarPrice: -1,
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