// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
import series from '../util/series';
import _m from '../util/bigMath';
import account from '../account';
import checker from '../util/checker';
import events from '../events/events';


var Web3 = require('web3');
var web3 = new Web3(
    new Web3.providers.HttpProvider('https://mainnet.infura.io/mSh9CgtJ3vUvDvFXMYxK')
);
var eth = web3.eth;

const DECIMALS = _m.newD(1000000000000000000);


export default {
    searchBlockChainForTransactions
}
var blockheight;

function searchBlockChainForTransactions(time) {
    if (!time) time = Date.now();
    return eth.getBlock('latest')
        .then(l => {
            blockheight = l.number;
            return processBlock(l.number, time, []);
        });


}


function processBlock(i, time, allTrans) {
    var prev;
    console.log('getBlock', i);
    return eth.getBlock(i, true)
        .catch(err => {
            //next block
            return processBlock(i - 1, time, allTrans);
        })
        .then((block) => {
            if (!block) return allTrans;
            if (!block.transactions) return block.transactions = [];
            console.log(new Date(block.timestamp * 1000), new Date(time * 1000));
            if (block.timestamp < time) return allTrans;

            var trx = getProcesBlockTransactions(block.transactions, block.timestamp);
            allTrans = allTrans.concat(trx);
            return processBlock(i - 1, time, allTrans);
        })
        .catch(err => {
            //next block
            return processBlock(i - 1, time, allTrans);
        });

}

function getProcesBlockTransactions(transactions, timestamp) {
    var txs = transactions.map((tx) => {
        var accountId = account.loadedAddressToAccountId(tx.to);
        if (!accountId) return null;
        tx.confirmations = blockheight - tx.blockNumber;
        tx.timeStamp = timestamp;
        tx.accountId = accountId;
        tx = processTransaction(tx);

        return tx;
    });
    txs = txs.filter(x => !!x);
    return txs;
}



function processTransaction(tx) {
    var address;
    try {
        checker.checkBlockchainETHTransactionProperties(tx);
        address = tx.address;
        var tmpTx = {};
        tmpTx.value = _m.newD(tx.value).divide(DECIMALS);
        tmpTx.confirmations = tx.confirmations || 0;
        tmpTx.hash = tx.hash;
        tmpTx.time = tx.timeStamp * 1000;
        tmpTx.accountId = tx.accountId;
        checker.checkInternalTransacitonProperties(tmpTx);
        return tmpTx;
    } catch (err) {
        console.log(tx);
        console.log('transaction did not pass', err);
        try {
            events.eventEmitter.emit('unsucessfulTransaction', address, 'ETH', tx, err);
        } catch (err) {
            console.log("event-fail");
        }
        return null;
    }
}