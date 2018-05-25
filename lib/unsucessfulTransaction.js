const models = require('../models');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

export default {
    save
};

function save(address, currency, transactionJson, error) {
    const row = {
        address,
        currency,
        transactionJson,
        error
    }
    return models.UnsucessfulTransactions.create(row);
}