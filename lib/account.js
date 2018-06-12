module.exports = {
    get,
    getFlat,
    saveErc20,
    saveBTCRefundAddress,
    saveETHRefundAddress,
    loadedAddressToAccountId,
    getbyAccountId,
    reloadAccounts,
    getAssociatedAccountsETH,
    getAssociatedAccountsBTC
};

const events = require('./events/events');

const transaction = require('./transaction');
const checker = require('./util/checker');
const logger = require('./logger');

const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const ethereum_address = require('ethereum-address');
const bitcoin_address = require('bitcoin-address');

let ethAddresses = {};
let btcAddresses = {};




function get(userId, email) {
    if (!userId) throw new Error('Account: no user Id defined');

    let account;
    return getFlat(userId, email)
        .then((acc) =>  {
            account = acc;
            return transaction.getByAccount(account.id);
        })
        .then((transactions) => {
            account.transactions = transactions;
            postContract(account);
            return account;
        });

    function postContract(data) {
        checker.checkAccountProperties(data);
        if (!Array.isArray(data.transactions)) throw new Error('Account: transactions is missing or not an array');
    }
}



function getFlat(userId, email) {
    if (!userId) throw new Error('Account: no user Id defined');

    let account;
    return models.Accounts.find({ where: { userId: userId } })
        .then((acc) => {
            if (acc) {
                return acc;
            } else {
                if (!email) throw new Error('Account: no email defined');
                return models.Accounts.find({ where: { userId: null } })
                    .then((acc) => {
                        return acc.updateAttributes({
                            userId: userId,
                            email: email
                        });
                    });
            }
        })
        .then((acc) =>  {
            account = acc.dataValues;
            checker.checkAccountProperties(account);
            return account;
        });

}

function loadedAddressToAccountId(address) {
    if (ethAddresses[address]) return ethAddresses[address];
    if (btcAddresses[address]) return btcAddresses[address];
    return null;
}


function reloadAccounts() {
    let where = {
        where: {
            userId: {
                [Op.ne]: null
            }
        }
    };
    return models.Accounts.findAll(where)
        .then((accounts) => {
            return accounts;
        })
        .then(accounts => {
            accounts.forEach(acc => {
                if (accounts[acc.btcAddress]) return;
                btcAddresses[acc.btcAddress] = acc.id;
                ethAddresses[acc.ethAddress] = acc.id;

            });
            logger.info('loaded #', accounts.length, 'Addresses');
        });
}

function getbyAccountId(accountId) {
    if (!accountId) throw new Error('Account: accountId not defined');
    let where = {
        where: {
            id: accountId
        }
    };
    let account;
    return models.Accounts.findOne(where)
        .then((acc) => {
            account = acc.dataValues;
            postContract(account);
            return account;
        });

    function postContract(data) {
        checker.checkAccountProperties(data);
    }

}

function saveErc20(userId, erc20Address) {
    if (!userId) throw new Error('Account: userId not defined');
    if (!erc20Address) throw new Error('Account: erc20Address not defined');
    if (!ethereum_address.isAddress(erc20Address)) throw new Error('Account: Not a valid erc20 address');


    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {

            return account.updateAttributes({
                erc20Address: erc20Address
            });

        });
}

function saveBTCRefundAddress(userId, btcRefundAddress) {
    if (!userId) throw new Error('Account: userId not defined');
    if (!btcRefundAddress) throw new Error('Account: BTCAddress not defined');
    if (!bitcoin_address.validate(btcRefundAddress)) throw new Error('Account: Not a valid BTC address');

    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {
            return account.updateAttributes({
                btcRefundAddress: btcRefundAddress
            });
        });
}

function saveETHRefundAddress(userId, ethRefundAddress) {
    if (!userId) throw new Error('Account: userId not defined');
    if (!ethRefundAddress) throw new Error('Account: ETHAddress not defined');
    if (!ethereum_address.isAddress(ethRefundAddress)) throw new Error('Account: Not a valid ETH address');

    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {
            return account.updateAttributes({
                ethRefundAddress: ethRefundAddress
            });
        });
}

function getAssociatedAccountsETH() {
    return Object.keys(ethAddresses);
}

function getAssociatedAccountsBTC() {
    return Object.keys(btcAddresses);
}