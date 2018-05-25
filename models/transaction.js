'use strict';
module.exports = (sequelize, DataTypes) => {
    let Transactions = sequelize.define('Transactions', {
        blockchainTxId: {
            type: DataTypes.STRING
        },
        currency: {
            type: DataTypes.STRING
        },
        amount: {
            type: DataTypes.DECIMAL(40, 20)
        },
        dollarRate: {
            type: DataTypes.DECIMAL(40, 20)
        },
        dollarTokenRate: {
            type: DataTypes.DECIMAL(40, 20)
        },
        discount: {
            type: DataTypes.DECIMAL(4, 2)
        },
        tokens: {
            type: DataTypes.DECIMAL(40, 20)
        },
        time: {
            type: DataTypes.DATE
        },
        confirmations: {
            type: DataTypes.INTEGER
        },
    }, {});
    Transactions.associate = (models) => {
        Transactions.belongsTo(models.Accounts, { foreignKey: 'accountId', as: 'transactions' });
    };
    return Transactions;
};