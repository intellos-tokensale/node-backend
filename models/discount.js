'use strict';
module.exports = (sequelize, DataTypes) => {
    var Discounts = sequelize.define('Discounts', {
        discount: {
            type: DataTypes.DECIMAL(4, 2)
        },
        from: {
            type: DataTypes.DATE
        },
        to: {
            type: DataTypes.DATE
        }
    }, {});
    Discounts.associate = function(models) {
        // associations can be defined here
    };
    return Discounts;
};