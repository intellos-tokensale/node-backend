import account from './lib/account';
import crawler from './lib/crawler';
import schedule from 'node-schedule';



var j = schedule.scheduleJob('0 */1 * * * *', function() {
    account.reloadAccounts().then(() => {
            return crawler.crawlBTC(Math.floor(Date.now() / 1000) - 4 * 60 * 60);
        })
        .then(() => {
            return crawler.crawlETH(Math.floor(Date.now() / 1000) - 1 * 60 * 5);
        });
});

var j = schedule.scheduleJob('*/19 * * * * *', function() {
    crawler.crawlUnconfirmedtransactions();
});