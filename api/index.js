import { version } from '../package.json';
import { Router } from 'express';
import account from './account';
import transactions from './transaction';
import prices from './price';
import email from './email';

import auth from '../middleware/auth';
import sysAuth from '../middleware/sysAuth';



export default () => {
    let api = Router();

    // mount the facets resource

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version });
    });

    api.get('/accounts/', auth, account.get);
    api.post('/accounts/erc20', auth, account.saveErc20);
    api.post('/accounts/btcRefundAddress', auth, account.saveBTCRefundAddress);
    api.post('/accounts/ethRefundAddress', auth, account.saveETHRefundAddress);

    api.get('/accounts/transactions', auth, transactions.get);
    api.get('/accounts/tokenamount', auth, transactions.getTokenAmount);

    api.get('/prices', prices.getLast);
    api.get('/prices/:time', prices.getByTime);

    api.get('/email/confirmInvestment/:userId/:hash', sysAuth, email.confirmInvestment);

    return api;
}