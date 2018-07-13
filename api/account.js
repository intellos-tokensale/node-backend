module.exports = {
    get,
    saveErc20,
    saveETHRefundAddress,
    saveBTCRefundAddress,
    register,
    login,
    confirmEmail
};

const account = require('../lib/account');
const error = require('../middleware/error');
const ethereum_address = require('ethereum-address');
const bitcoin_address = require('bitcoin-address');


function register(req, res) {
    if (!req.body.email) return error.missingParam(res, 'email');
    if (!req.body.password) return error.missingParam(res, 'password');
    const referedByCode = req.query.referedByCode;

    return account.register(req.body.email, req.body.password, referedByCode)
        .then((account) => {
            account = deleteUnwantedFields(account);
            return res.json(account);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err + '');
        });
}

function login(req, res) {
    if (!req.body.email) return error.missingParam(res, 'email');
    if (!req.body.password) return error.missingParam(res, 'password');
    const referedByCode = req.query.referedByCode;

    return account.login(req.body.email, req.body.password, referedByCode)
        .then((account) => {
            account = deleteUnwantedFields(account);
            return res.json(account);
        }).catch(err => {
            console.log('we arror now', err);
            res.status(400).send(err + '');
        });
}

function confirmEmail(req, res) {
    if (!req.params.code) return error.missingParam(res, 'code');
    return account.confirmEmail(req.params.code)
        .then(() => {
            return res.json({ confirmed: true });
        }).catch(err => {
            res.status(400).send(err + '');
        });
}


function get(req, res) {
    if (!req.userId) return error.unauthorized(res);
    if (!req.userEmail) return error.missingParam(res, 'email');
    const referedByCode = req.query.referedByCode;

    return account.get(req.userId, req.userEmail, referedByCode)
        .then((account) => {
            account = deleteUnwantedFields(account);
            return res.json(account);
        });
}

function saveErc20(req, res) {
    if (!req.userId) return error.unauthorized(res);
    if (!req.body.erc20Address) return error.missingParam(res, 'erc20');
    if (!ethereum_address.isAddress(req.body.erc20Address)) return error.invalidParam(res, 'erc20 address');

    return account.saveErc20(req.userId, req.body.erc20Address)
        .then((account) => {
            account = deleteUnwantedFields(account);
            return res.json(account);
        });
}

function saveETHRefundAddress(req, res) {
    if (!req.userId) return error.unauthorized(res);
    if (!req.body.ethRefundAddress) return error.missingParam(res, 'ETH refund address');
    if (!ethereum_address.isAddress(req.body.ethRefundAddress)) return error.invalidParam(res, 'ETH address');

    return account.saveETHRefundAddress(req.userId, req.body.ethRefundAddress)
        .then((account) => {
            account = deleteUnwantedFields(account);
            return res.json(account);
        });
}

function saveBTCRefundAddress(req, res) {
    if (!req.userId) return error.unauthorized(res);
    if (!req.body.btcRefundAddress) return error.missingParam(res, 'BTC refund address');
    if (!bitcoin_address.validate(req.body.btcRefundAddress)) return error.invalidParam(res, 'BTC address');

    return account.saveBTCRefundAddress(req.userId, req.body.btcRefundAddress)
        .then((account) => {
            account = deleteUnwantedFields(account);
            return res.json(account);
        });
}

function deleteUnwantedFields(account) {
    if (!account) return account;
    if (account.dataValues) account = account.dataValues;
    delete account.passwordHash;
    delete account.sanctions;
    delete account.pep;
    delete account.humanFace;
    delete account.liveliness;
    delete account.containsMRZ;
    delete account.selfieGenuity;
    delete account.faceMatch;
    delete account.MRZInfo;
    delete account.emailConfirmationCode;
    return account;
}