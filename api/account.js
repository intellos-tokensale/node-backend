import account from '../lib/account';
var ethereum_address = require('ethereum-address');
var bitcoin_address = require('bitcoin-address');

export default {
    get,
    saveErc20,
    saveETHRefundAddress,
    saveBTCRefundAddress
};

function get(req, res) {
    if (!req.userId) throw 'unauthorized';
    if (!req.userEmail) throw 'No email found';

    return account.get(req.userId, req.userEmail)
        .then((account) => {
            return res.json(account);
        });
}

function saveErc20(req, res) {
    if (!req.userId) throw 'unauthorized';
    if (!req.body.erc20Address) throw 'erc20 address Missing';
    if (!ethereum_address.isAddress(req.body.erc20Address)) throw 'Not a valid erc20 address';

    return account.saveErc20(req.userId, req.body.erc20Address)
        .then((account) => {
            return res.json(account);
        });
}

function saveETHRefundAddress(req, res) {
    if (!req.userId) throw 'unauthorized';
    if (!req.body.ethRefundAddress) throw 'eth refund address Missing';
    if (!ethereum_address.isAddress(req.body.ethRefundAddress)) throw 'Not a valid ETH address';

    return account.saveETHRefundAddress(req.userId, req.body.ethRefundAddress)
        .then((account) => {
            return res.json(account);
        });
}

function saveBTCRefundAddress(req, res) {
    if (!req.userId) throw 'unauthorized';
    if (!req.body.btcRefundAddress) throw 'btc refund address address Missing';
    if (!bitcoin_address.validate(req.body.btcRefundAddress)) throw 'Not a valid BTC address';

    return account.saveBTCRefundAddress(req.userId, req.body.btcRefundAddress)
        .then((account) => {
            return res.json(account);
        });
}