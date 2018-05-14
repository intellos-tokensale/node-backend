import discount from './discount';
import config from '../config.json';
import _m from './util/bigMath';
import checker from './util/checker';
import price from '../api/price';

var models = require('../models');
var Sequelize = require('sequelize');
const coinTicker = require('coin-ticker');
const Op = Sequelize.Op;


export default {
    getLast,
    getByTime,
    priceNowByExchange,
    fetchPairToDB
};

function getLast() {
    return getByTime(Date.now());
}

function getByTime(time) {
    checker.checkTime(time, 'Fetch Price:');
    time = time * 1;

    var req = {
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
    var prices;
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
    if (!exchange) throw 'exchange not set';

    var row = {
        btcDollarPrice: -1,
        ethDollarPrice: -1,
        dollarPrice: config.dollarPrice,
        exchange: exchange
    };
    return coinTicker(exchange, 'btc_usd')
        .then((data) => {
            console.log('btc last', data.last);
            row.btcDollarPrice = _m.norm(_m.newD(data.last));
            return coinTicker(exchange, 'eth_usd');
        })
        .then((data) => {
            console.log('eth last', data.last);
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
            console.log("we had an error fetchin data from " + exchange, row, err);
            return;
        });
}