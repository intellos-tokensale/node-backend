import discount from './discount';
import config from '../config.json';
var bigdecimal = require("bigdecimal");
const ONE = new bigdecimal.BigDecimal(1);
var DOWN = bigdecimal.RoundingMode.DOWN();
var models = require('../models');
var Sequelize = require('sequelize');
const coinTicker = require('coin-ticker');
const Op = Sequelize.Op;

const diff = config.maxPriceDiffFraction;

export default {
    getLast,
    getByTime,
    priceNowByExchange
};

function getLast(time) {
    return getByTime(Date.now());
}

function getByTime(time) {
    time = Date.now();
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

    return models.Prices.findAll(req)
        .then((prices) => {
            return discount.get(time)
                .then(discount => {
                    prices = prices[0].dataValues;
                    prices.discount = discount.discount;
                    prices.discountUntil = discount.to;
                    return prices;
                });
        });

}


function plausabilityCheck(row) {
    return getByTime()
        .then(lastaverage => {
            if (!lastaverage.btcDollarPrice) return row;
            if (!lastaverage.ethDollarPrice) return now;
            if (!(row.btcDollarPrice < lastaverage.btcDollarPrice * (1 + diff))) throw 'btcprice has a too hig value';
            if (!(row.btcDollarPrice > lastaverage.btcDollarPrice * (1 - diff))) throw 'btcprice has a too low value';
            if (!(row.ethDollarPrice < lastaverage.ethDollarPrice * (1 + diff))) throw 'ethprice has a too hig value';
            if (!(row.ethDollarPrice > lastaverage.ethDollarPrice * (1 - diff))) throw 'ethprice has a too low value';
            return row;
        })
}



function priceNowByExchange(pair) {
    fetchPairToDB('coinbase');
    fetchPairToDB('bitstamp');
    fetchPairToDB('poloniex');
    fetchPairToDB('gdax');
}

function fetchPairToDB(exchange) {
    var row = {
        btcDollarPrice: -1,
        ethDollarPrice: -1,
        dollarPrice: 10,
        exchange: exchange
    }
    return coinTicker(exchange, 'btc_usd')
        .then((data) => {
            var tmp = new bigdecimal.BigDecimal(data.last);
            row.btcDollarPrice = tmp.divide(ONE, 20, DOWN) + "";
            return coinTicker(exchange, 'eth_usd');
        })
        .then((data) => {
            var tmp = new bigdecimal.BigDecimal(data.last);
            row.ethDollarPrice = tmp.divide(ONE, 20, DOWN) + "";
        })
        .then(() => {
            return plausabilityCheck(row);
        })
        .then(() => {
            row.time = Date.now();
            return models.Prices.create(row);
        })
        .catch((err) => {
            console.log("we had an error fetchin data from " + exchange, row, err);
            resolve({});
        });
}


/*
function fetchPricesAndSave() {
    var row = {
        btcDollarPrice: -1,
        ethDollarPrice: -1,
        dollarPrice: 10,
        time: 0.1
    }
    priceAverageNow('btc_usd')
        .then(btcaverage => {
            row.btcDollarPrice = btcaverage;
            return priceAverageNow('eth_usd');
        })
        .then(ethaverage => {
            row.ethDollarPrice = ethaverage;
            row.time = Date.now();
            console.log("plausablity");
            return plausabilityCheck(row);
        })
        .then(row => {
            return models.Prices.create(row);
        })
        .catch(err => {
            console.log('fetchPricesAndSave error', err);
        })

}


function priceAverageNow(pair) {
    var calc = {
        total: new bigdecimal.BigDecimal(0),
        count: 0,
    }

    return fetchSingleForAverage('coinbase', pair, calc)
        .then(() => {
            return fetchSingleForAverage('bitstamp', pair, calc);
        })
        .then(() => {
            return fetchSingleForAverage('poloniex', pair, calc);
        })
        .then(() => {
            return fetchSingleForAverage('gdax', pair, calc);
        })
        .then(() => {
            const count = new bigdecimal.BigDecimal(calc.count);
            var avg = calc.total.divide(count).divide(ONE, 20, DOWN) + "";
            return avg;
        })

}

function fetchSingleForAverage(exchange, pair, calc) {
    return new Promise(function(resolve, reject) {
        // console.log(coinTicker);
        coinTicker(exchange, pair)
            .then((data) => {
                const last = new bigdecimal.BigDecimal(data.last);
                calc.total = calc.total.add(last);
                calc.count++;
                resolve({});
            }).catch((err) => {
                console.log("we had an error here", err);
                resolve({});
            });

    });
}
*/