const chai = require('chai');

chai.should();
const expect = require('chai').expect;


const transaction = require('../../lib/transaction');
const bigMath = require('../../lib/util/bigMath');

describe('Transaction', () => {

    describe('getByAccount', () => {
        let trans;
        before(() => {
            return new Promise((resolve) => {
                transaction.getByAccount(1)
                    .then(x => {
                        trans = x;
                        resolve();
                    });
            });
        });

        it('is an array', () => {
            trans.should.be.an('array');
        });

        describe('no accountId', () => {
            it('throws an error', () => {
                expect(() => { transaction.getByAccount(); })
                    .to.throw('Transaction: accountId not defined');
            });
        });
    });

    describe('getTokens', () => {
        let tok;
        before(() => {
            return new Promise((resolve) => {
                transaction.getTokens(1)
                    .then(x => {
                        tok = x;
                        resolve();
                    });
            });
        });

        it('is an array', () => {
            tok.tokens.should.be.a('string');
            tok.confirmed.should.be.a('boolean');
        });

        describe('no accountId', () => {
            it('throws an error', () => {
                expect(() => { transaction.getTokens(); })
                    .to.throw('Transaction: accountId not defined');
            });
        });

    });

    describe('saveAllTransactionsBTC', () => {
        let transactions = [{
            value: bigMath.newD(1),
            address: '1NxaBCFQwejSZbQfWcYNwgqML5wWoE3rK4',
            hash: '2b4148ce75e62f3358e33e594013cd4d420cac70b8dcc4bd50516a580a6d58df',
            confirmations: 2,
            time: 1526564947000,
            accountId: 149
        }];

        it('can save', () => {
            expect(() => { transaction.saveAllTransactionsBTC(transactions); })
                .to.not.throw();
        });

    });


    describe('saveAllTransactionsETH', () => {
        let transactions = [{
            value: bigMath.newD(1),
            address: '1NxaBCFQwejSZbQfWcYNwgqML5wWoE3rK4',
            hash: '2b4148ce75e62f3358e33e594013cd4d420cac70b8dcc4bd50516a580a6d58df',
            confirmations: 2,
            time: 1526564947000,
            accountId: 149
        }];

        it('can save', () => {
            expect(() => { transaction.saveAllTransactionsETH(transactions); })
                .to.not.throw();
        });
    });






    describe('calcTransactionDataAndSave', () => {

        let currency = 'BTC';
        let currencyPrice = '684.940750000000000000000000';
        let accountId = 1;

        let prices = {
            btcDollarPrice: -1,
            ethDollarPrice: -1,
            dollarPrice: -1,
            discount: '0.00',
            discountUntil: 1526185994000
        };
        let trans = {
            value: 1,
            confirmations: 22,
            hash: 'ee918efddbd54f17e029ff1bf58ec32d147d59f1f88d4cdcb32c0024c8a7ed4c',
            time: 1526185994000
        };

        describe('no accountId defined', () => {
            it('throws an error', () => {
                expect(() => { transaction.calcTransactionDataAndSave(null, currencyPrice, accountId, prices, trans); })
                    .to.throw('Transaction: currency not defined');
            });
        });

        describe('no currency defined', () => {
            it('throws an error', () => {
                expect(() => { transaction.calcTransactionDataAndSave(currency, null, accountId, prices, trans); })
                    .to.throw('Transaction: currencyPrice not defined');
            });
        });

        describe('no transaction defined', () => {
            it('throws an error', () => {
                expect(() => { transaction.calcTransactionDataAndSave(currency, currencyPrice, null, prices, trans); })
                    .to.throw('Transaction: accountId not defined');
            });
        });

        describe('no prices defined', () => {
            it('throws an error', () => {
                expect(() => { transaction.calcTransactionDataAndSave(currency, currencyPrice, accountId, null, trans); })
                    .to.throw('Price: Prices undefined');
            });
        });

        describe('no transaction defined', () => {
            it('throws an error', () => {
                expect(() => { transaction.calcTransactionDataAndSave(currency, currencyPrice, accountId, prices, null); })
                    .to.throw('Transaction: Transaction undefined');
            });
        });


    });




});