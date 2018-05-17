import _m from '../util/bigMath';
import _dt from '../util/checker';
import config from '../../config.json';
const diff = config.maxPriceDiffFraction;

var ethereum_address = require('ethereum-address');
var bitcoin_address = require('bitcoin-address');


export default {
    checkInternalTransacitonProperties,
    checkPricesProperties,
    checkTime,
    checkFuture,
    checkAccountProperties,
    checkBlockchainETHTransactionProperties,
    checkBlockchainBTCTransactionProperties,
    priceRowPlausabilityCheck
};




function checkInternalTransacitonProperties(tx) {
    if (!tx) throw 'Transaction: Transaction undefined';
    if (!_m.isBigDecimal(tx.value)) throw 'Transaction: value undefined';
    if (!tx.hash) throw 'Transaction:  hash undefined';
    if (!('confirmations' in tx)) throw 'Transaction: confirmations undefined';
    if (isNaN(parseInt(tx.confirmations)) || !isFinite(tx.confirmations)) throw 'Transaction: confirmations not a number';
    if (parseInt(tx.confirmations) < 0) throw 'Transaction: confirmations negative';;
    checkTime(tx.time, 'Transaction');
}


function checkBlockchainETHTransactionProperties(tx) {
    if (!tx.value) throw 'Eth: Transaction value undefined';
    if (isNaN(parseInt(tx.value)) || !isFinite(tx.value)) throw 'Eth: value not a number';
    if (!tx.hash) throw 'Eth: Transaction hash undefined';
    if (!('confirmations' in tx)) throw 'Eth: Transaction confirmations undefined';
    if (isNaN(parseInt(tx.confirmations)) || !isFinite(tx.confirmations)) throw 'Eth: Transaction confirmations not a number';
    if (parseInt(tx.confirmations) < 0) throw 'Eth: Transaction confirmations negative';
    checkTime(tx.timeStamp * 1000, 'Eth');
}


function checkBlockchainBTCTransactionProperties(tx, LBlock) {
    if (!tx.out) throw 'BTC: Transaction out undefined';
    if (!Array.isArray(tx.out)) throw 'BTC: Transaction out not an array';

    if (!tx.hash) throw 'BTC: Transaction hash undefined';

    if (!('height' in LBlock)) throw 'BTC: Last Block height undefined';
    if (isNaN(parseInt(LBlock.height)) || !isFinite(LBlock.height)) throw 'BTC: Last Block height not a number';
    if (parseInt(LBlock.height) < 0) throw 'BTC:  Last Block height negative';

    if (!('block_height' in tx)) throw 'BTC: Transaction block_height undefined';
    if (isNaN(parseInt(tx.block_height)) || !isFinite(tx.block_height)) throw 'BTC: Transaction block_height not a number';
    if (parseInt(tx.block_height) < 0) throw 'BTC: Transaction block_height negative';

    checkTime(tx.time * 1000, 'BTC');
}


function checkPricesProperties(prices) {
    if (!prices) throw 'Price: Prices undefined';
    if (!prices.btcDollarPrice) throw 'Price: for BTC not set';
    if (!prices.ethDollarPrice) throw 'Price: for ETH not set';
    if (!prices.dollarPrice) throw 'Price: for dollar not set';
    if (!prices.discount) throw 'Price: no discount defined';
    if (!prices.discountUntil) throw 'Price: discount end undefined';
    checkTime(prices.discountUntil, 'Price: discount:');
}

function checkAccountProperties(account) {
    if (!account) throw 'Account:account undefined';
    if (!account.id) throw 'Account: id missing';
    if (!account.userId) throw 'Account: external userId missing';
    if (!account.email) throw 'Account: email missing';
    if (!account.ethAddress) throw 'Account: ethAddress missing ';
    if (!ethereum_address.isAddress(account.ethAddress)) throw 'Account: Not a valid ETH address';
    if (!account.btcAddress) throw 'Account: btcAddress missing';
    if (!bitcoin_address.validate(account.btcAddress)) throw 'Account: Not a valid BTC address';
}

function priceRowPlausabilityCheck(row, lastaverage) {
    if (!row) throw 'Plausabilty: row not set';
    if (!lastaverage) throw 'Plausabilty: lastaverage not set';
    if (!row.btcDollarPrice) throw 'Plausabilty: BTC price not set in row';
    if (!row.ethDollarPrice) throw 'Plausabilty: ETH price not set in row';
    if (!lastaverage.btcDollarPrice) throw 'Plausabilty: BTC price not set in lastaverage';
    if (!lastaverage.ethDollarPrice) throw 'Plausabilty: ETH price not set in lastaverage';
    if (lastaverage.btcDollarPrice <= 0) return row;
    if (lastaverage.ethDollarPrice <= 0) return row;
    if (!(row.btcDollarPrice < lastaverage.btcDollarPrice * (1 + diff))) throw 'Plausabilty: btcprice has a too high value';
    if (!(row.btcDollarPrice > lastaverage.btcDollarPrice * (1 - diff))) throw 'Plausabilty: btcprice has a too low value';
    if (!(row.ethDollarPrice < lastaverage.ethDollarPrice * (1 + diff))) throw 'Plausabilty: ethprice has a too high value';
    if (!(row.ethDollarPrice > lastaverage.ethDollarPrice * (1 - diff))) throw 'Plausabilty: ethprice has a too low value';
    return row;

}

function checkTime(time, context) {
    if (!time) throw context + 'No time set';
    time = time * 1;
    if (time < 1199145600 * 1000) throw context + 'Ilegal Time before 2008';
    if (time > 2145916800 * 1000) throw context + 'Ilegal Time after 2038';
}

function checkFuture(time, baseTime, context) {
    if (!time) throw context + 'No time set';
    if (!baseTime) throw context + 'No baseTime set';
    time = time * 1;
    baseTime = baseTime * 1;
    if (baseTime > time) throw context + 'Date ' + time + ' is not in the future of ' + baseTime;
}