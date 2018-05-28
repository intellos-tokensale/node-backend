import _m from '../util/bigMath';
import _dt from '../util/checker';
import config from '../../config';
const diff = config.general.maxPriceDiffFraction;

const ethereum_address = require('ethereum-address');
const bitcoin_address = require('bitcoin-address');


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
    if (!tx) throw new Error('Transaction: Transaction undefined');
    if (!_m.isBigDecimal(tx.value)) throw new Error('Transaction: value undefined');
    if (!tx.hash) throw new Error('Transaction:  hash undefined');
    if (!('confirmations' in tx)) throw new Error('Transaction: confirmations undefined');
    if (isNaN(parseInt(tx.confirmations)) || !isFinite(tx.confirmations)) throw new Error('Transaction: confirmations not a number');
    if (parseInt(tx.confirmations) < 0) throw new Error('Transaction: confirmations negative');
    checkTime(tx.time, 'Transaction');
}


function checkBlockchainETHTransactionProperties(tx) {
    if (!tx.value) throw new Error('Eth: Transaction value undefined');
    if (isNaN(parseInt(tx.value)) || !isFinite(tx.value)) throw new Error('Eth: value not a number');
    if (!tx.hash) throw new Error('Eth: Transaction hash undefined');
    if (!('confirmations' in tx)) throw new Error('Eth: Transaction confirmations undefined');
    if (isNaN(parseInt(tx.confirmations)) || !isFinite(tx.confirmations)) throw new Error('Eth: Transaction confirmations not a number');
    if (parseInt(tx.confirmations) < 0) throw new Error('Eth: Transaction confirmations negative');
    checkTime(tx.timeStamp * 1000, 'Eth');
}


function checkBlockchainBTCTransactionProperties(tx, LBlock) {
    if (!tx.out) throw new Error('BTC: Transaction out undefined');
    if (!Array.isArray(tx.out)) throw new Error('BTC: Transaction out not an array');

    if (!tx.hash) throw new Error('BTC: Transaction hash undefined');

    if (!('height' in LBlock)) throw new Error('BTC: Last Block height undefined');
    if (isNaN(parseInt(LBlock.height)) || !isFinite(LBlock.height)) throw new Error('BTC: Last Block height not a number');
    if (parseInt(LBlock.height) < 0) throw new Error('BTC:  Last Block height negative');

    if (!('block_height' in tx)) throw new Error('BTC: Transaction block_height undefined');
    if (isNaN(parseInt(tx.block_height)) || !isFinite(tx.block_height)) throw new Error('BTC: Transaction block_height not a number');
    if (parseInt(tx.block_height) < 0) throw new Error('BTC: Transaction block_height negative');

    checkTime(tx.time * 1000, 'BTC');
}


function checkPricesProperties(prices) {
    if (!prices) throw new Error('Price: Prices undefined');
    if (!prices.btcDollarPrice) throw new Error('Price: for BTC not set');
    if (!prices.ethDollarPrice) throw new Error('Price: for ETH not set');
    if (!prices.dollarPrice) throw new Error('Price: for dollar not set');
    if (!prices.discount) throw new Error('Price: no discount defined');
    if (!prices.discountUntil) throw new Error('Price: discount end undefined');
    checkTime(prices.discountUntil, 'Price: discount:');
}

function checkAccountProperties(account) {
    if (!account) throw new Error('Account:account undefined');
    if (!account.id) throw new Error('Account: id missing');
    if (!account.userId) throw new Error('Account: external userId missing');
    if (!account.email) throw new Error('Account: email missing');
    if (!account.ethAddress) throw new Error('Account: ethAddress missing ');
    if (!ethereum_address.isAddress(account.ethAddress)) throw new Error('Account: Not a valid ETH address');
    if (!account.btcAddress) throw new Error('Account: btcAddress missing');
    if (!bitcoin_address.validate(account.btcAddress)) throw new Error('Account: Not a valid BTC address');
}

function priceRowPlausabilityCheck(row, lastaverage) {
    if (!row) throw new Error('Plausabilty: row not set');
    if (!lastaverage) throw new Error('Plausabilty: lastaverage not set');
    if (!row.btcDollarPrice) throw new Error('Plausabilty: BTC price not set in row');
    if (!row.ethDollarPrice) throw new Error('Plausabilty: ETH price not set in row');
    if (!lastaverage.btcDollarPrice) throw new Error('Plausabilty: BTC price not set in lastaverage');
    if (!lastaverage.ethDollarPrice) throw new Error('Plausabilty: ETH price not set in lastaverage');
    if (lastaverage.btcDollarPrice <= 0) return row;
    if (lastaverage.ethDollarPrice <= 0) return row;
    if (!(row.btcDollarPrice < lastaverage.btcDollarPrice * (1 + diff))) throw new Error('Plausabilty: btcprice has a too high value');
    if (!(row.btcDollarPrice > lastaverage.btcDollarPrice * (1 - diff))) throw new Error('Plausabilty: btcprice has a too low value');
    if (!(row.ethDollarPrice < lastaverage.ethDollarPrice * (1 + diff))) throw new Error('Plausabilty: ethprice has a too high value');
    if (!(row.ethDollarPrice > lastaverage.ethDollarPrice * (1 - diff))) throw new Error('Plausabilty: ethprice has a too low value');
    return row;

}

function checkTime(time, context) {
    if (!time) throw new Error(context + 'No time set');
    time = time * 1;
    if (time < 1199145600 * 1000) throw new Error(context + 'Ilegal Time before 2008');
    if (time > 2145916800 * 1000) throw new Error(context + 'Ilegal Time after 2038');
}

function checkFuture(time, baseTime, context) {
    if (!time) throw new Error(context + 'No time set');
    if (!baseTime) throw new Error(context + 'No baseTime set');
    time = time * 1;
    baseTime = baseTime * 1;
    if (baseTime > time) throw new Error(context + 'Date ' + time + ' is not in the future of ' + baseTime);
}