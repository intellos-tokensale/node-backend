import config from '../../config.json';
import Etherscan from 'etherscan';
const etherscan = new Etherscan(config.etherscanKey);

const DECIMALS = 1000000000000000000;



export default {
    getTransactionsByAddress
};


function getTransactionsByAddress(address) {

    return etherscan.getTxList({
        address: address,
        //startblock: 0, // Optional
        sort: 'desc' // Optional, default 'asc'
    }).then(data => {
        return calculateTransactions(data);
    });
}

function calculateTransactions(txData) {

    txData = txData.slice(0, 20);
    var txs = txData.map(tx => {
        var tmpTx = {};
        tmpTx.value = tx.value / DECIMALS;
        tmpTx.confirmations = tx.confirmations;
        tmpTx.hash = tx.hash;
        tmpTx.time = tx.timeStamp * 1000;
        return tmpTx;
    });
    return txs;
}