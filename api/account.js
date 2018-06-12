module.exports = {
    get,
    saveErc20,
    saveETHRefundAddress,
    saveBTCRefundAddress
};

const account = require('../lib/account');
const error = require('../middleware/error');
const ethereum_address = require('ethereum-address');
const bitcoin_address = require('bitcoin-address');



function get(req, res) {
    if (!req.userId) return error.unauthorized(res);
    if (!req.userEmail) return error.missingParam(res, 'email');

    return account.get(req.userId, req.userEmail)
        .then((account) => {
            return res.json(account);
        });
}

function saveErc20(req, res) {
    if (!req.userId) return error.unauthorized(res);
    if (!req.body.erc20Address) return error.missingParam(res, 'erc20');
    if (!ethereum_address.isAddress(req.body.erc20Address)) return error.invalidParam(res, 'erc20 address');

    return account.saveErc20(req.userId, req.body.erc20Address)
        .then((account) => {
            return res.json(account);
        });
}

function saveETHRefundAddress(req, res) {
    if (!req.userId) return error.unauthorized(res);
    if (!req.body.ethRefundAddress) return error.missingParam(res, 'ETH refund address');
    if (!ethereum_address.isAddress(req.body.ethRefundAddress)) return error.invalidParam(res, 'ETH address');

    return account.saveETHRefundAddress(req.userId, req.body.ethRefundAddress)
        .then((account) => {
            return res.json(account);
        });
}

function saveBTCRefundAddress(req, res) {
    if (!req.userId) return error.unauthorized(res);
    if (!req.body.btcRefundAddress) return error.missingParam(res, 'BTC refund address');
    if (!bitcoin_address.validate(req.body.btcRefundAddress)) return error.invalidParam(res, 'BTC address');

    return account.saveBTCRefundAddress(req.userId, req.body.btcRefundAddress)
        .then((account) => {
            return res.json(account);
        });
}