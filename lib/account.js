module.exports = {
    register,
    login,
    confirmEmail,
    get,
    getFlat,
    saveErc20,
    saveBTCRefundAddress,
    saveETHRefundAddress,
    saveWANRefundAddress,
    loadedAddressToAccountId,
    getbyAccountId,
    reloadAccounts,
    getAssociatedAccountsETH,
    getAssociatedAccountsBTC,
    getAssociatedAccountsWAN,
    authLocally
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
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');

let ethAddresses = {};
let btcAddresses = {};
let wanAddresses = {};



function register(data) {
    if (!data.email) throw new Error('Account: no email defined');
    if (!data.password) throw new Error('Account: no password defined');
    if (!data.firstName) throw new Error('Account: no firstName defined');
    if (!data.lastName) throw new Error('Account: no lastName definied');
    if (!data.nationality) throw new Error('Account: no nationality defined');
    if (!data.ip) throw new Error('Account: no ip defined');
    if (!data.investmentAmount) throw new Error('Account: no investmentAmount defined ');

    data.hash = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));

    data.referalCode = randomstring.generate({
        length: 6,
        charset: 'ABCDEFGHJKLNPQRSTUVWXYZ23456789'
    });

    data.emailConfirmationCode = randomstring.generate({
        length: 6,
        charset: 'ABCDEFGHJKLNPQRSTUVWXYZ23456789'
    });


    if (!data.referedByCode) referedByCode = null;
    return models.Accounts.find({ where: { email: data.email } })
        .then(acc => {
            if (acc) throw new Error('Email Already Registered');
            return models.Accounts.find({ where: { email: null } });
        }).then((acc) => {
            return acc.updateAttributes({
                email: data.email,
                passwordHash: data.hash,
                firstName: data.firstName,
                lastName: data.lastName,
                nationality: data.nationality,
                ip: data.ip,
                investmentAmount: data.investmentAmount,
                referalCode: data.referalCode,
                referedByCode: data.referedByCode,
                emailConfirmationCode: data.emailConfirmationCode
            });
        }).then(acc => {
            events.eventEmitter.emit(events.EVENT_USERREGISTRATION, acc.id);
            checker.checkAccountProperties(acc);
            return {};
        });
}

function login(email, password) {
    if (!email) throw new Error('Account: no email defined');
    if (!password) throw new Error('Account: no user Id defined');
    console.log(email, password);
    return models.Accounts.find({ where: { email: email } })
        .then((acc) => {
            if (!acc) throw new Error('unauthorized');
            if (!acc.emailConfirmed) throw new Error('Email not Confirmed yet');
            if (!bcrypt.compareSync(password, acc.passwordHash)) throw new Error('unauthorized');
            const accessToken = randomstring.generate({ length: 21 });
            const tokenExpiresIn = new Date();
            tokenExpiresIn.setDate(tokenExpiresIn.getDate() + 2);
            return acc.updateAttributes({
                accessToken: accessToken,
                tokenExpiresIn: tokenExpiresIn
            });
        })
        .then(acc => {
            checker.checkAccountProperties(acc);
            return acc;
        });
}

function confirmEmail(emailConfirmationCode) {
    if (!emailConfirmationCode) throw new Error('Account: emailConfirmationCode defined');
    console.log('confirmemail', emailConfirmationCode);
    return models.Accounts.find({ where: { emailConfirmationCode: emailConfirmationCode } })
        .then((acc) => {
            if (!acc) throw new Error('unauthorized');
            return acc.updateAttributes({
                emailConfirmed: true,
                emailConfirmationCode: null
            });
        });
}

function get(id, email, referedByCode) {
    if (!id) throw new Error('Account: Id defined');

    let account;
    return getFlat(id, email, referedByCode)
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



function getFlat(id, email, referedByCode) {
    if (!id) throw new Error('Account: no user Id defined');

    let account;
    return models.Accounts.find({ where: { id: id } })
        .then((acc) => {
            if (acc) {
                return acc;
            } else {
                if (!email) throw new Error('Account: no email defined');
                const referalCode = randomstring.generate({
                    length: 6,
                    charset: 'ABCDEFGHJKLNPQRSTUVWXYZ23456789'
                });
                if (!referedByCode) referedByCode = null;
                return models.Accounts.find({ where: { email: null } })
                    .then((acc) => {
                        return acc.updateAttributes({
                            email: email,
                            referalCode: referalCode,
                            referedByCode: referedByCode
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
    if (wanAddresses[address]) return wanAddresses[address];
    return null;
}


function reloadAccounts() {
    let where = {
        where: {
            email: {
                [Op.ne]: null
            }
        }
    };
    return models.Accounts.findAll(where)
        .then((accounts) => {
            return accounts;
        })
        .then(accounts => {
            console.log()
            accounts.forEach(acc => {
                if (accounts[acc.btcAddress]) return;
                btcAddresses[acc.btcAddress] = acc.id;
                ethAddresses[acc.ethAddress] = acc.id;
                wanAddresses[acc.wanAddress] = acc.id;

            });
            console.log(wanAddresses);
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

function saveErc20(id, erc20Address) {
    if (!id) throw new Error('Account: id not defined');
    if (!erc20Address) throw new Error('Account: erc20Address not defined');
    if (!ethereum_address.isAddress(erc20Address)) throw new Error('Account: Not a valid erc20 address');


    return models.Accounts.find({ where: { id: id } })
        .then((account) => {

            return account.updateAttributes({
                erc20Address: erc20Address
            });

        });
}

function saveBTCRefundAddress(id, btcRefundAddress) {
    if (!id) throw new Error('Account: id not defined');
    if (!btcRefundAddress) throw new Error('Account: BTCAddress not defined');
    if (!bitcoin_address.validate(btcRefundAddress)) throw new Error('Account: Not a valid BTC address');

    return models.Accounts.find({ where: { id: id } })
        .then((account) => {
            return account.updateAttributes({
                btcRefundAddress: btcRefundAddress
            });
        });
}

function saveWANRefundAddress(id, wanRefundAddress) {
    if (!id) throw new Error('Account: id not defined');
    if (!wanRefundAddress) throw new Error('Account: BTCAddress not defined');
    // if (!bitcoin_address.validate(wanRefundAddress)) throw new Error('Account: Not a valid BTC address');

    return models.Accounts.find({ where: { id: id } })
        .then((account) => {
            return account.updateAttributes({
                wanRefundAddress: wanRefundAddress
            });
        });
}

function saveETHRefundAddress(id, ethRefundAddress) {
    if (!id) throw new Error('Account: id not defined');
    if (!ethRefundAddress) throw new Error('Account: ETHAddress not defined');
    if (!ethereum_address.isAddress(ethRefundAddress)) throw new Error('Account: Not a valid ETH address');

    return models.Accounts.find({ where: { id: id } })
        .then((account) => {
            return account.updateAttributes({
                ethRefundAddress: ethRefundAddress
            });
        });
}

function getAssociatedAccountsETH() {
    return Object.keys(ethAddresses);
}

function getAssociatedAccountsWAN() {
    return Object.keys(wanAddresses);
}

function getAssociatedAccountsBTC() {
    return Object.keys(btcAddresses);
}

function authLocally(accessToken) {
    if (!accessToken) throw new Error('Account: accessToken not defined');
    const now = new Date();
    return models.Accounts.find({
        where: {
            tokenExpiresIn: {
                [Op.gt]: now
            },
            accessToken: accessToken
        }
    });
}