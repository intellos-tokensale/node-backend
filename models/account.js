'use strict';
module.exports = (sequelize, DataTypes) => {
    var Accounts = sequelize.define('Accounts', {
        userId: {
            type: DataTypes.STRING,
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
            type: DataTypes.BOOLEAN,
        },
        suspended: {
            type: DataTypes.BOOLEAN,
        }
    }, {});
    Accounts.associate = function(models) {
        // associations can be defined here
    };
    return Accounts;
};