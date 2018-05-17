import crawler from '../lib/crawler';
import account from '../lib/account';


export default {
    fetchTransactions
};

function fetchTransactions(req, res) {
    if (!req.params.time) throw 'time missing';

    account.reloadAccounts().then(() => {
            return crawler.crawlBTC(req.params.time);
        })
        .then(() => {
            return crawler.crawlETH(req.params.time);
        });
    return res.json({});
}