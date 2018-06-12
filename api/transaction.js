module.exports = {
    get,
    getTokenAmount
};

const price = require('../lib/transaction');
const transaction = require('../lib/transaction');
const account = require('../lib/account');
const error = require('../middleware/error');


function getTokenAmount(req, res) {
    if (!req.userId) return error.unauthorized(res);
    return account.getFlat(req.userId)
        .then((account) => {
            return transaction.getTokens(account.id);
        })
        .then((tokens) => {
            res.json(tokens);
        });
}

function get(req, res) {
    if (!req.userId) return error.unauthorized(res);
    return account.getFlat(req.userId)
        .then((account) => {
            return transaction.getByAccount(account.id);
        })
        .then((transaction) => {
            res.json(transaction);
        });
}