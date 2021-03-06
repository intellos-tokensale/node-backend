'use strict';
module.exports = (sequelize, DataTypes) => {
    let UnsucessfulTransactions = sequelize.define('UnsucessfulTransactions', {
        address: {
            type: DataTypes.STRING
        },
        currency: {
            type: DataTypes.STRING
        },
        transactionJson: {
            type: DataTypes.BLOB
        },
        error: {
            type: DataTypes.STRING
        },
    }, {});

    return UnsucessfulTransactions;
};