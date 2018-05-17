import account from './account';
import transaction from './transaction';
import bitcoinRpcService from './services/bitcoinRpcService';
import ethereumWeb3 from './services/etherumWeb3';



export default {
    crawlBTC,
    crawlETH,
    crawlUnconfirmedtransactions
}


function crawlBTC(time) {
    console.time('crawl BTC');

    return bitcoinRpcService.searchBlockChainForTransactions(time)
        .then((txs) => {
            console.log('found', txs.length, ' txs');
            console.log(txs[1]);
            return transaction.saveAllTransactionsBTC(txs);
        })
        .then(() => {
            console.timeEnd('crawl BTC');
            console.log('done crawling btc transactions');
            return;
        });
}


function crawlUnconfirmedtransactions() {
    console.log('crawling btc unconfirmed btc transactions');
    console.time('crawl btc unconfirmed');
    return bitcoinRpcService.searchUnconfirmedTransactions()
        .then(txs => {
            console.log('matched', txs.length);
            return transaction.saveAllTransactionsBTC(txs);
        })
        .then(() => {
            console.timeEnd('crawl btc unconfirmed');
            console.log('done crawling unconfirmed btc transactions');
            return;
        });
}



function crawlETH(time) {
    console.time('crawl ETH');

    return ethereumWeb3.searchBlockChainForTransactions(time)
        .then((txs) => {
            console.log('found', txs.length, ' txs');
            return transaction.saveAllTransactionsETH(txs);
        })
        .then((tx) => {
            console.timeEnd('crawl ETH');
            console.log('done crawling eth transactions');
            return;
        });
}