module.exports = {
    save
};

const models = require('../models');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;



function save(address, currency, transactionJson, error) {
    const row = {
        address,
        currency,
        transactionJson,
        error
    }
    return models.UnsucessfulTransactions.create(row);
}