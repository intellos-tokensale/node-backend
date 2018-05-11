'use strict';
module.exports = (sequelize, DataTypes) => {
    var Prices = sequelize.define('Prices', {
        btcDollarPrice: {
            type: DataTypes.DECIMAL(40, 20)
        },
        ethDollarPrice: {
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
    Prices.associate = function(models) {
        // associations can be defined here
    };
    return Prices;
};