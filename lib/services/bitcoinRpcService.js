import _m from '../util/bigMath';
import events from '../events/events';
import checker from '../util/checker';
import rpcConfig from '../../config/bitcoinRpc.json';

var RpcClient = require('bitcoind-rpc');
var bitcoin_address = require('bitcoin-address');
const DECIMALS = _m.newD(100000000);
var LBlock = 0;


var rpc = new RpcClient(rpcConfig);



export default {
    getTransactionsByAddress,
    calculateTransactions
};



function getTransactionsByAddress(address) {
    if (!bitcoin_address.validate(address)) throw 'Account: Not a valid BTC address';
    const account = ''; //= 'acc'+address;
    return new Promise((resolve, reject) => {
        rpc.listtransactions(account, 100, 0, true, (e, o) => {
            if (e) return reject(e);
            var tmp = o.result.filter(tx => tx.category == 'receive');
            resolve(tmp);
        });
    }).then(data => {
        return calculateTransactions(data, address);
    });
}

function calculateTransactions(transactions, address) {
    if (!transactions) throw 'BTC Service: addressData.txs undefined';
    if (!Array.isArray(transactions)) throw 'BTC Service: addressData.txs not an array';
    if (!address) throw 'BTC Service: addressData.address undefined';

    var txs = transactions.map(tx => {
        try {
            checker.checkBlockchainRpcBTCTransactionProperties(tx);
            var tmpTx = {};
            tmpTx.value = _m.newD(tx.amount);
            tmpTx.confirmations = tx.confirmations;
            tmpTx.hash = tx.txid;
            tmpTx.time = tx.time * 1000; //maybe received time?

            checker.checkInternalTransacitonProperties(tmpTx);
            console.log('transaction passed');
            return tmpTx;
        } catch (err) {
            console.log('transaction did not pass', err);
            events.eventEmitter.emit('unsucessfulTransaction', address, 'BTC', tx, err);
            return null;
        }
    });
    txs = txs.filter(tx => !!tx);
    return txs;
}



getTransactionsByAddress('14ChPPM8rPYJeHnw6kMVUDnNNKx1KnjYW4')
    .then(x => {
        x.map(x => {
            x.datetime = new Date(x.time);
            return x;
        })
        console.log('transactions', x)
    });