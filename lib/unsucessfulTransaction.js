var models = require('../models');
var Sequelize = require('sequelize');

const Op = Sequelize.Op;

export default {
    save
};

function save(address, currency, transactionJson, error) {
    if (!address) throw 'UnsucessfulTransaction: address not defined';
    if (!currency) throw 'UnsucessfulTransaction: currency not defined';
    if (!transactionJson) throw 'UnsucessfulTransaction: transactionJson not defined';
    if (!error) throw 'UnsucessfulTransaction: error not defined';
    const row = {
        address,
        currency,
        transactionJson,
        error
    }
    return models.UnsucessfulTransactions.create(row);
}