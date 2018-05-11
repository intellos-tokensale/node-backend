'use strict';
module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('Prices', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            btcDollarPrice: {
                allowNull: false,
                type: DataTypes.DECIMAL(40, 20)
            },
            ethDollarPrice: {
                allowNull: false,
                type: DataTypes.DECIMAL(40, 20)
            },
            dollarPrice: {
                allowNull: false,
                type: DataTypes.DECIMAL(40, 20)
            },
            ethAddress: {
                allowNull: false,
                type: DataTypes.STRING
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
        return queryInterface.dropTable('Prices');
    }
};