module.exports = {
    fetchTransactions
};


const crawler = require('../lib/crawler');
const account = require('../lib/account');
const error = require('../middleware/error');



function fetchTransactions(req, res) {
    if (!req.params.time) return error.missingParam(res, 'time');

    account.reloadAccounts().then(() => {
            return crawler.crawlBTC(req.params.time);
        })
        .catch(e => { console.log(error, e); })
        .then(() => {
            return crawler.crawlETH(req.params.time);
        })
        .catch(e => { console.log(error, e); })
        .then(() => {
            return crawler.crawlWAN(req.params.time);
        });
    return res.json({});
}