module.exports = {
    crawlBTC,
    crawlETH,
    crawlWAN,
    crawlUnconfirmedtransactions
};


const account = require('./account');
const bitcoinRpcService = require('./services/bitcoinRpcService');
const ethereumWeb3 = require('./services/etherumWeb3');
const wanchainWeb3 = require('./services/wanchainWeb3');
const logger = require('./logger');
const crawldblock = require('./crawledblock');
const transaction = require('./transaction');





function crawlBTC(time) {
    console.time('crawl BTC');

    return bitcoinRpcService.searchBlockChainForTransactions(time)
        .then((txs) => {
            logger.info('found', txs.length, ' txs');
            logger.info(txs[1]);
            return transaction.saveAllTransactionsBTC(txs);
        })
        .then(() => {
            return crawldblock.saveProcessesBlocks('BTC');
        })
        .then(() => {
            console.timeEnd('crawl BTC');
            logger.info('done crawling btc transactions');
        });
}


function crawlUnconfirmedtransactions() {
    logger.info('crawling btc unconfirmed btc transactions');
    console.time('crawl btc unconfirmed');
    return bitcoinRpcService.searchUnconfirmedTransactions()
        .then(txs => {
            logger.info('matched', txs.length);
            return transaction.saveAllTransactionsBTC(txs);
        })
        .then(() => {
            console.timeEnd('crawl btc unconfirmed');
            logger.info('done crawling unconfirmed btc transactions');
        });
}



function crawlETH(time) {
    console.time('crawl ETH');

    return ethereumWeb3.searchBlockChainForTransactions(time)
        .then((txs) => {
            logger.info('found', txs.length, ' txs');
            return transaction.saveAllTransactionsETH(txs);
        })
        .then((tx) => {
            return crawldblock.saveProcessesBlocks('ETH');
        })
        .then(() => {
            console.timeEnd('crawl ETH');
            logger.info('done crawling eth transactions');
        });
}

function crawlWAN(time) {
    console.time('crawl WAN');

    return wanchainWeb3.searchBlockChainForTransactions(time)
        .then((txs) => {
            console.log('we found these wantrans', txs);
            logger.info('found', txs.length, ' txs');
            return transaction.saveAllTransactionsWAN(txs);
        })
        .then((tx) => {
            return crawldblock.saveProcessesBlocks('WAN');
        })
        .then(() => {
            console.timeEnd('crawl WAN');
            logger.info('done crawling wan transactions');
        });
}