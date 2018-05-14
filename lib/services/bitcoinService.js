import _m from '../util/bigMath';
import events from '../events/events';
import checker from '../util/checker';

var blockexplorer = require('blockchain.info/blockexplorer');
var bitcoin_address = require('bitcoin-address');
const DECIMALS = _m.newD(100000000);
var LBlock = 0;



export default {
    getTransactionsByAddress,
    calculateTransactions
};




function getTransactionsByAddress(address) {
    if (!bitcoin_address.validate(address)) throw 'Account: Not a valid BTC address';
    return blockexplorer.getLatestBlock()
        .then((latestBlock) => {
            LBlock = latestBlock;
            return;
        }).then(() => {
            return blockexplorer.getAddress(address, { limit: 20 });
        }).then(data => {
            return calculateTransactions(data);
        });
}

function calculateTransactions(addressData) {
    if (!addressData.txs) throw 'BTC Service: addressData.txs undefined';
    if (!Array.isArray(addressData.txs)) throw 'BTC Service: addressData.txs not an array';
    if (!addressData.address) throw 'BTC Service: addressData.address undefined';

    var txs = addressData.txs.map(tx => {
        try {
            checker.checkBlockchainBTCTransactionProperties(tx, LBlock);
            var tmpTx = {};

            tmpTx.value = calculateValue(tx, addressData.address);
            tmpTx.confirmations = LBlock.height - tx.block_height + 1;
            tmpTx.hash = tx.hash;
            tmpTx.time = tx.time * 1000;

            checker.checkInternalTransacitonProperties(tmpTx);
            console.log('transaction passed');
            return tmpTx;
        } catch (err) {
            console.log('transaction did not pass', err);
            events.eventEmitter.emit('unsucessfulTransaction', addressData.address, 'BTC', tx, err);
            return null;
        }
    });
    txs = txs.filter(tx => !!tx);
    return txs;
}


function calculateValue(tx, btcAddress) {
    var sum = tx.out.reduce((sum, current) => {
        if (current.addr === btcAddress) return sum + current.value;
        return sum;
    }, 0);
    sum = _m.newD(sum).divide(DECIMALS);
    return sum;
}

/*
getTransactionsByAddress('14ChPPM8rPYJeHnw6kMVUDnNNKx1KnjYW4')
    .then(x => {
        x.map(x => {
            x.datetime = new Date(x.time);
            return x;
        })
        console.log('transactions', x)
    });
*/