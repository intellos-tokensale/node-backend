import account from './account';
import transaction from './transaction';
import bitcoinRpcService from './services/bitcoinRpcService';
import ethereumWeb3 from './services/etherumWeb3';
import logger from './logger';



export default {
    crawlBTC,
    crawlETH,
    crawlUnconfirmedtransactions
}


function crawlBTC(time) {
    console.time('crawl BTC');

    return bitcoinRpcService.searchBlockChainForTransactions(time)
        .then((txs) => {
            logger.info('found', txs.length, ' txs');
            logger.info(txs[1]);
            return transaction.saveAllTransactionsBTC(txs);
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
            console.timeEnd('crawl ETH');
            logger.info('done crawling eth transactions');
        });
}