'use strict';
module.exports = (sequelize, DataTypes) => {
    let Prices = sequelize.define('Prices', {
        btcDollarPrice: {
            type: DataTypes.DECIMAL(40, 20)
        },
        ethDollarPrice: {
            type: DataTypes.DECIMAL(40, 20)
        },
        wanDollarPrice: {
            type: DataTypes.DECIMAL(40, 20)
        },
        dollarPrice: {
            type: DataTypes.DECIMAL(40, 20)
        },
        exchange: {
            type: DataTypes.STRING
        },
        time: {
            type: DataTypes.DATE
        }
    }, {});
    Prices.associate = (models) => {
        // associations can be defined here
    };
    return Prices;
};