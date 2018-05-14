'use strict';
var Sequelize = require('sequelize');


module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('UnsucessfulTransactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            address: {
                type: DataTypes.STRING
            },
            currency: {
                type: DataTypes.STRING
            },
            transactionJson: {
                type: DataTypes.TEXT('long')
            },
            error: {
                type: DataTypes.STRING
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },
    down: (queryInterface, DataTypes) => {
        return queryInterface.dropTable('UnsucessfulTransactions');
    }
};