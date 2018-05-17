import account from './lib/account';
import transaction from './lib/transaction';
import bitcoinRpcService from './lib/services/bitcoinRpcService';
import ethereumWeb3 from './lib/services/etherumWeb3';
import schedule from 'node-schedule';



var j = schedule.scheduleJob('0 */1 * * * *', function() {
    account.reloadAccounts().then(() => {
            return crawlBTC();
        })
        .then(() => {
            return crawlETH();
        });
});

var j = schedule.scheduleJob('*/19 * * * * *', function() {
    crawlUnconfirmedtransactions();
});

function crawlBTC() {
    console.time('crawl BTC');

    return bitcoinRpcService.searchBlockChainForTransactions(Math.floor(Date.now() / 1000) - 4 * 60 * 60)
        .then((txs) => {
            console.log('found', txs.length, ' txs');
            return transaction.saveAllTransactionsBTC(txs);
        })
        .then((tx) => {
            console.timeEnd('crawl BTC');
            console.log('done crawling btc transactions');
            return;
        });
}


function crawlUnconfirmedtransactions() {
    console.log('crawling btc unconfirmed btc transactions');
    console.time('crawl btc unconfirmed');
    return bitcoinRpcService.searchUnconfirmedTransactions()
        .then(txs => console.log('matched', txs.length))
        .then((tx) => {
            console.timeEnd('crawl btc unconfirmed');
            console.log('done crawling unconfirmed btc transactions');
            return;
        });
}



function crawlETH() {
    console.time('crawl ETH');

    return ethereumWeb3.searchBlockChainForTransactions(Math.floor(Date.now() / 1000) - 1 * 60 * 5)
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