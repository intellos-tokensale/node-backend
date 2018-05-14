import events from './events/events';

import transaction from './transaction';
import checker from './util/checker';

var models = require('../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var ethereum_address = require('ethereum-address');
var bitcoin_address = require('bitcoin-address');



export default {
    get,
    getFlat,
    saveErc20,
    saveBTCRefundAddress,
    saveETHRefundAddress,
    getAssociatedAccounts,
    getbyAccountId,

};

function get(userId) {
    if (!userId) throw 'Account: no user Id defined';

    var account;
    return getFlat(userId)
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
        if (!Array.isArray(data.transactions)) throw 'Account: transactions is missing or not an array';
    }
}



function getFlat(userId) {
    if (!userId) throw 'Account: no user Id defined';

    var account;
    return models.Accounts.find({ where: { userId: userId } })
        .then((acc) => {
            if (acc) {
                return acc;
            } else {
                return models.Accounts.find({ where: { userId: null } })
                    .then((acc) => {

                        return acc.updateAttributes({
                            userId: userId
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

function getAssociatedAccounts() {
    var where = {
        where: {
            userId: {
                [Op.ne]: null
            }
        }
    };
    return models.Accounts.findAll(where)
        .then((accounts) => {
            postContract(accounts);
            return accounts;
        });

    function postContract(data) {
        if (!Array.isArray(data)) throw 'Account: associated accounts are not defined or not an array';
    }

}

function getbyAccountId(accountId) {
    if (!accountId) throw 'Account: accountId not defined';
    var where = {
        where: {
            id: accountId
        }
    };
    var account;
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
    if (!userId) throw 'Account: userId not defined';
    if (!erc20Address) throw 'Account: erc20Address not defined';
    if (!ethereum_address.isAddress(erc20Address)) throw 'Account: Not a valid erc20 address';


    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {

            return account.updateAttributes({
                erc20Address: erc20Address
            });

        });
}

function saveBTCRefundAddress(userId, btcRefundAddress) {
    if (!userId) throw 'Account: userId not defined';
    if (!btcRefundAddress) throw 'Account: BTCAddress not defined';
    if (!bitcoin_address.validate(btcRefundAddress)) throw 'Account: Not a valid BTC address';

    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {
            return account.updateAttributes({
                btcRefundAddress: btcRefundAddress
            });
        });
}

function saveETHRefundAddress(userId, ethRefundAddress) {
    if (!userId) throw 'Account: userId not defined';
    if (!ethRefundAddress) throw 'Account: ETHAddress not defined';
    if (!ethereum_address.isAddress(ethRefundAddress)) throw 'Account: Not a valid ETH address';

    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {
            return account.updateAttributes({
                ethRefundAddress: ethRefundAddress
            });
        });
}