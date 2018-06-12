const bigdecimal = require('bigdecimal');
const DOWN = bigdecimal.RoundingMode.DOWN();
const ONE = new bigdecimal.BigDecimal('1');

module.exports = {
    newD,
    ONE,
    norm,
    isBigDecimal
};

const logger = require('../logger');


function newD(i) {
    try {
        return new bigdecimal.BigDecimal(i);
    } catch (err) {
        logger.error('could not instanciate ' + i + ' as a Big Decimal');
        throw err;
    }
}

function norm(i) {
    try {
        return i.divide(ONE, 20, DOWN) + '';
    } catch (err) {
        logger.error('could not norm ' + i + ' might not be a BigDecimal');
        throw err;
    }
}

function isBigDecimal(i) {
    return i instanceof bigdecimal.BigDecimal;
}