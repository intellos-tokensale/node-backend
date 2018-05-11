'use strict';
var Sequelize = require('sequelize');


module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('Transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            blockchainTxId: {
                allowNull: false,
                type: DataTypes.STRING
            },
            currency: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(40, 20),
                allowNull: false,
            },
            dollarRate: {
                type: DataTypes.DECIMAL(40, 20),
                allowNull: false,
            },
            dollarTokenRate: {
                type: DataTypes.DECIMAL(40, 20),
                allowNull: false,
            },
            discount: {
                type: DataTypes.DECIMAL(4, 2),
                allowNull: false,
            },
            tokens: {
                type: DataTypes.DECIMAL(40, 20),
                allowNull: false,
            },
            confirmations: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            accountId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Accounts',
                    key: 'id'
                },
            },
            time: {
                allowNull: false,
                type: DataTypes.DATE
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
        return queryInterface.dropTable('Transactions');
    }
};