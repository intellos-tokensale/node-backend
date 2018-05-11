import eventEmitter from './eventHandler';
import transaction from './transaction';

var models = require('../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;



export default {
    get,
    getFlat,
    saveErc20,
    saveBTCRefundAddress,
    saveETHRefundAddress,
    getAssociatedAccounts,
    getbyAccountId
};

function get(userId) {
    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {
            if (account) {
                return account;
            } else {
                return models.Accounts.find({ where: { userId: null } })
                    .then((account) => {

                        return account.updateAttributes({
                            userId: userId
                        });

                    });
            }
        })
        .then((account) =>  {
            //eventEmitter.emit('accountFetched', account.dataValues);
            return transaction.getByAccount(account.id)
                .then((transactions) => {
                    account.dataValues.transactions = transactions;
                    return account.dataValues;
                })

        });

}

function getFlat(userId) {
    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {
            if (account) {
                return account;
            } else {
                return models.Accounts.find({ where: { userId: null } })
                    .then((account) => {

                        return account.updateAttributes({
                            userId: userId
                        });

                    });
            }
        })
        .then((account) =>  {
            return account.dataValues;
        });

}

function getAssociatedAccounts(userId) {
    var where = {
        where: {
            userId: {
                [Op.ne]: null
            }
        }
    };
    return models.Accounts.findAll(where)
        .then((accounts) => {
            return accounts;
        });

}

function getbyAccountId(accountId) {
    var where = {
        where: {
            id: accountId
        }
    };
    return models.Accounts.findOne(where)
        .then((account) => {
            return account.dataValues;
        });

}

function saveErc20(userId, erc20Address) {
    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {

            return account.updateAttributes({
                erc20Address: erc20Address
            });

        });
}

function saveBTCRefundAddress(userId, btcRefundAddress) {
    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {
            return account.updateAttributes({
                btcRefundAddress: btcRefundAddress
            });
        });
}

function saveETHRefundAddress(userId, ethRefundAddress) {
    return models.Accounts.find({ where: { userId: userId } })
        .then((account) => {
            return account.updateAttributes({
                ethRefundAddress: ethRefundAddress
            });
        });
}