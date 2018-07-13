const account = require('./lib/account');
const crawler = require('./lib/crawler');
const schedule = require('node-schedule');


//crawler.crawlBTC(Math.floor(Date.now() / 1000) - 7 * 60 * 60);
account.reloadAccounts().then(() => {
    return crawler.crawlWAN(Math.floor(Date.now() / 1000) - 20 * 60);
});

// schedule.scheduleJob('0 */1 * * * *', () => {
//     account.reloadAccounts().then(() => {
//             return crawler.crawlBTC(Math.floor(Date.now() / 1000) - 4 * 60 * 60);
//         })
//         .then(() => {
//             return crawler.crawlETH(Math.floor(Date.now() / 1000) - 10 * 60 * 5);
//         })
//         .then(() => {
//             return crawler.crawlWAN(Math.floor(Date.now() / 1000) - 10 * 60 * 5);
//         });
// });

// schedule.scheduleJob('*/19 * * * * *', () => {
//     crawler.crawlUnconfirmedtransactions();
// });