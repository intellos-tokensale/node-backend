var bigdecimal = require("bigdecimal");
var DOWN = bigdecimal.RoundingMode.DOWN();
var ONE = new bigdecimal.BigDecimal('1');


export default {
    newD,
    ONE,
    norm,
    isBigDecimal
}

function newD(i) {
    try {
        return new bigdecimal.BigDecimal(i);
    } catch (err) {
        console.error('could not instanciate ' + i + ' as a Big Decimal');
        throw err;
    }
}

function norm(i) {
    try {
        return i.divide(ONE, 20, DOWN) + '';
    } catch (err) {
        console.error('could not norm ' + i + ' might not be a BigDecimal');
        throw err;
    }
}

function isBigDecimal(i) {
    return i instanceof bigdecimal.BigDecimal;
}