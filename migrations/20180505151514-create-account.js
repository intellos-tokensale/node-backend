'use strict';
module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('Accounts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            ethAddress: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            btcAddress: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            erc20Address: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            btcRefundAddress: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            ethRefundAddress: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            kyc: {
                type: DataTypes.BOOLEAN
            },
            suspended: {
                type: DataTypes.BOOLEAN,
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
        return queryInterface.dropTable('Accounts');
    }
};