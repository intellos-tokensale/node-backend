import account from '../lib/account';
const ethereum_address = require('ethereum-address');
const bitcoin_address = require('bitcoin-address');

export default {
    get,
    saveErc20,
    saveETHRefundAddress,
    saveBTCRefundAddress
};

function get(req, res) {
    if (!req.userId) throw new Error('unauthorized');
    if (!req.userEmail) throw new Error('email on user missing');

    return account.get(req.userId, req.userEmail)
        .then((account) => {
            return res.json(account);
        });
}

function saveErc20(req, res) {
    if (!req.userId) throw new Error('unauthorized');
    if (!req.body.erc20Address) throw new Error('erc20 address Missing');
    if (!ethereum_address.isAddress(req.body.erc20Address)) throw new Error('Not a valid erc20 address');

    return account.saveErc20(req.userId, req.body.erc20Address)
        .then((account) => {
            return res.json(account);
        });
}

function saveETHRefundAddress(req, res) {
    if (!req.userId) throw new Error('unauthorized');
    if (!req.body.ethRefundAddress) throw new Error('eth refund address Missing');
    if (!ethereum_address.isAddress(req.body.ethRefundAddress)) throw new Error('Not a valid ETH address');

    return account.saveETHRefundAddress(req.userId, req.body.ethRefundAddress)
        .then((account) => {
            return res.json(account);
        });
}

function saveBTCRefundAddress(req, res) {
    if (!req.userId) throw new Error('unauthorized');
    if (!req.body.btcRefundAddress) throw new Error('btc refund address address Missing');
    if (!bitcoin_address.validate(req.body.btcRefundAddress)) throw new Error('Not a valid BTC address');

    return account.saveBTCRefundAddress(req.userId, req.body.btcRefundAddress)
        .then((account) => {
            return res.json(account);
        });
}