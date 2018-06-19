module.exports = {
    searchBlockChainForTransactions
};


// Eth.providers.givenProvider will be set if in an Ethereum supported browser.
const series = require('../util/series');
const _m = require('../util/bigMath');
const account = require('../account');
const checker = require('../util/checker');
const crawledblock = require('../crawledblock');
const events = require('../events/events');
const logger = require('../logger');


const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider('https://mainnet.infura.io/mSh9CgtJ3vUvDvFXMYxK')
);
const eth = web3.eth;

const DECIMALS = _m.newD(1000000000000000000);


let bestheight;

//console.log(web3.currentProvider);
//console.log(Web3);
// web3.currentProvider.send({
//     method: "debug_traceTransaction",
//     params: ['0x3fac854179691e377fc1aa180b71a4033b6bb3bde2a7ef00bc8e78f849ad356e', {}],
//     jsonrpc: "2.0",
//     id: "2"
// }, function(err, result) {
//     console.log(err);
//     console.log(result);
// });



function searchBlockChainForTransactions(time) {
    if (!time) time = Date.now();
    return eth.getBlock('latest')
        .then(l => {
            bestheight = l.number;
            return processBlock(l.number, time, []);
        });


}


function processBlock(i, time, allTrans) {
    let prev;
    logger.info('getBlock', i);
    return crawledblock.skipToLastUnprocessed(i, time, 'ETH')
        .then((b) => {
            if (!b.blocktime) b.blocktime = time;
            if (b.blocktime < time) { return allTrans; }
            i = b.blocknumber;
            return eth.getBlock(i, true)
                .catch(err => {
                    //next block
                    return processBlock(i - 1, time, allTrans);
                })
                .then((block) => {
                    if (!block) return allTrans;
                    if (!block.transactions) return block.transactions = [];
                    logger.info(new Date(block.timestamp * 1000), new Date(time * 1000));
                    if (block.timestamp < time) return allTrans;

                    let trx = getProcesBlockTransactions(block.transactions, block.timestamp);
                    allTrans = allTrans.concat(trx);

                    crawledblock.markBlockasProcessed(patch(block), 'ETH', bestheight);
                    return processBlock(i - 1, time, allTrans);
                })
                .catch(err => {
                    //next block
                    return processBlock(i - 1, time, allTrans);
                });
        });
}

function patch(block) {
    return {
        height: block.number,
        time: block.timestamp,
        hash: block.hash,
    };
}

function getProcesBlockTransactions(transactions, timestamp) {
    let txs = transactions.map((tx) => {
        let accountId = account.loadedAddressToAccountId(tx.to);
        if (!accountId) return null;
        tx.confirmations = bestheight - tx.blockNumber;
        tx.timeStamp = timestamp;
        tx.accountId = accountId;
        tx = processTransaction(tx);

        return tx;
    });
    txs = txs.filter(x => !!x);
    return txs;
}



function processTransaction(tx) {
    let address;
    try {
        checker.checkBlockchainETHTransactionProperties(tx);
        address = tx.address;
        let tmpTx = {};
        tmpTx.value = _m.newD(tx.value).divide(DECIMALS);
        tmpTx.confirmations = tx.confirmations || 0;
        tmpTx.hash = tx.hash;
        tmpTx.time = tx.timeStamp * 1000;
        tmpTx.accountId = tx.accountId;
        checker.checkInternalTransacitonProperties(tmpTx);
        return tmpTx;
    } catch (err) {
        logger.info(tx);
        logger.info('transaction did not pass', err);
        try {
            events.eventEmitter.emit(event.EVENT_UNSUCESSFULTRANSACTION, address, 'ETH', tx, err);
        } catch (err) {
            logger.warn('event-fail');
        }
        return null;
    }
}