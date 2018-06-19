'use strict';
let Sequelize = require('sequelize');


module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('Crawledblocks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            blocknumber: {
                type: DataTypes.STRING
            },
            currency: {
                type: DataTypes.STRING
            },
            blocktime: {
                allowNull: false,
                type: DataTypes.DATE
            },
            blockhash: {
                type: DataTypes.STRING,
                allowNull: true,
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
        return queryInterface.dropTable('Crawledblocks');
    }
};