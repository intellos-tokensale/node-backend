import config from '../../config.json';
import _m from '../util/bigMath';
import _dt from '../util/checker';
import Etherscan from 'etherscan';
import events from '../events/events';
import checker from '../util/checker';

const etherscan = new Etherscan(config.etherscanKey);

var ethereum_address = require('ethereum-address');


const DECIMALS = _m.newD(1000000000000000000);



export default {
    getTransactionsByAddress,
    calculateTransactions
};





function getTransactionsByAddress(address) {
    if (!ethereum_address.isAddress(address)) throw 'Account: Not a valid ETH address';
    return etherscan.getTxList({
        address: address,
        //startblock: 0, // Optional
        sort: 'desc' // Optional, default 'asc'
    }).then(data => {
        return calculateTransactions(data, address);
    });
}

function calculateTransactions(txData, address) {
    if (!txData) throw 'Eth Service: txDate undefined';
    if (!Array.isArray(txData)) throw 'Eth Service: txDate not an array';
    if (!address) throw 'Eth Service: address undefined';
    txData = txData.slice(0, 20);
    var txs = txData.map(tx => {
        try {
            checker.checkBlockchainETHTransactionProperties(tx);
            var tmpTx = {};
            tmpTx.value = _m.newD(tx.value).divide(DECIMALS);
            tmpTx.confirmations = tx.confirmations || 0;
            tmpTx.hash = tx.hash;
            tmpTx.time = tx.timeStamp * 1000;
            checker.checkInternalTransacitonProperties(tmpTx);
            return tmpTx;
        } catch (err) {
            console.log('transaction did not pass', err);
            events.eventEmitter.emit('unsucessfulTransaction', address, 'ETH', tx, err);
            return null;
        }
    });
    txs = txs.filter(tx => !!tx);
    return txs;
}



/*
console.log("getTransactionsByAddress");
getTransactionsByAddress('0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa')
    .then(x => console.log('transactions', x)); */