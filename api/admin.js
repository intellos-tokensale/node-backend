import crawler from '../lib/crawler';
import account from '../lib/account';
import error from '../middleware/error';


export default {
    fetchTransactions
};

function fetchTransactions(req, res) {
    if (!req.params.time) return error.missingParam(res, 'time');

    account.reloadAccounts().then(() => {
            return crawler.crawlBTC(req.params.time);
        })
        .then(() => {
            return crawler.crawlETH(req.params.time);
        });
    return res.json({});
}