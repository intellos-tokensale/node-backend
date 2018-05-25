import account from './lib/account';
import crawler from './lib/crawler';
import schedule from 'node-schedule';



schedule.scheduleJob('0 */1 * * * *', () => {
    account.reloadAccounts().then(() => {
            return crawler.crawlBTC(Math.floor(Date.now() / 1000) - 4 * 60 * 60);
        })
        .then(() => {
            return crawler.crawlETH(Math.floor(Date.now() / 1000) - 1 * 60 * 5);
        });
});

schedule.scheduleJob('*/19 * * * * *', () => {
    crawler.crawlUnconfirmedtransactions();
});