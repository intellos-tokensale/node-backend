import price from '../lib/transaction';
import transaction from '../lib/transaction';
import account from '../lib/account';

export default {
    get,
    getTokenAmount
};

function getTokenAmount(req, res) {
    if (!req.userId) throw new Error('unauthorized');
    return account.getFlat(req.userId)
        .then((account) => {
            return transaction.getTokens(account.id);
        })
        .then((tokens) => {
            res.json(tokens);
        });
}

function get(req, res) {
    if (!req.userId) throw new Error('unauthorized');
    return account.getFlat(req.userId)
        .then((account) => {
            return transaction.getByAccount(account.id);
        })
        .then((transaction) => {
            res.json(transaction);
        });
}