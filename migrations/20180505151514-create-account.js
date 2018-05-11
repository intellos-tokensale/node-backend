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
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                unique: true
            },
            ethAddress: {
                type: DataTypes.STRING,
                unique: true
            },
            btcAddress: {
                type: DataTypes.STRING,
                unique: true
            },
            erc20Address: {
                type: DataTypes.STRING,
                unique: true
            },
            btcRefundAddress: {
                type: DataTypes.STRING,
                unique: true
            },
            ethRefundAddress: {
                type: DataTypes.STRING,
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