'use strict';
module.exports = (sequelize, DataTypes) => {
    let Discounts = sequelize.define('Discounts', {
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
    Discounts.associate = (models) => {
        // associations can be defined here
    };
    return Discounts;
};