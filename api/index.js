module.exports = () => {
    let api = Router();

    // mount the facets resource

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version });
    });

    api.post('/accounts/register', account.register);
    api.post('/accounts/login', account.login);
    api.get('/accounts/confirmEmail/:code', account.confirmEmail);
    api.get('/accounts/', auth, account.get);
    api.post('/accounts/erc20', auth, account.saveErc20);
    api.post('/accounts/btcRefundAddress', auth, account.saveBTCRefundAddress);
    api.post('/accounts/ethRefundAddress', auth, account.saveETHRefundAddress);

    api.get('/accounts/transactions', auth, transactions.get);
    api.get('/accounts/tokenamount', auth, transactions.getTokenAmount);

    api.get('/prices', prices.getLast);
    api.get('/prices/:time', prices.getByTime);

    if (process.env.EMAIL) {
        api.get('/email/confirmInvestment/:userId/:hash', sysAuth, email.confirmInvestment);
        api.get('/email/confirmEmail/:id', sysAuth, email.confirmEmail);
    }

    if (process.env.ADMIN) {
        api.get('/admin/fetchTransactions/:time', sysAuth, admin.fetchTransactions);
    }

    return api;
};


const version = require('../package.json').version;
const Router = require('express').Router;
const account = require('./account');
const transactions = require('./transaction');
const prices = require('./price');
const email = require('./email');
const admin = require('./admin');

const auth = require('../middleware/auth');
const sysAuth = require('../middleware/sysAuth');