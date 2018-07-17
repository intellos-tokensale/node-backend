'use strict';
module.exports = (sequelize, DataTypes) => {
    let Accounts = sequelize.define('Accounts', {
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
        wanAddress: {
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
        wanRefundAddress: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        kyc: {
            type: DataTypes.BOOLEAN,
        },
        suspended: {
            type: DataTypes.BOOLEAN,
        },
        referalCode: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        referedByCode: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        accessToken: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        tokenExpiresIn: {
            type: DataTypes.DATE,
            allowNull: true,
            unique: true
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: true
        },
        investmentAmount: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sanctions: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        pep: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        humanFace: {
            type: DataTypes.BOOLEAN,
        },
        liveliness: {
            type: DataTypes.BOOLEAN,
        },
        containsMRZ: {
            type: DataTypes.BOOLEAN,
        },
        selfieGenuity: {
            type: DataTypes.BOOLEAN,
        },
        faceMatch: {
            type: DataTypes.BOOLEAN,
        },
        MRZInfo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        emailConfirmationCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        emailConfirmed: {
            type: DataTypes.BOOLEAN,
        },
    }, {});
    Accounts.associate = (models) => {
        // associations can be defined here
    };

    return Accounts;
};