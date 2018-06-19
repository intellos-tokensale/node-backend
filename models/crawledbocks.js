'use strict';
module.exports = (sequelize, DataTypes) => {
    let Accounts = sequelize.define('Crawledblocks', {
        blocknumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        blocktime: {
            type: DataTypes.DATE,
            unique: true
        },
        blockhash: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
    }, {});
    Accounts.associate = (models) => {
        // associations can be defined here
    };
    return Accounts;
};