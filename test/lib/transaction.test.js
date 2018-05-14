let chai = require('chai');


chai.should();
var expect = require('chai').expect;


import transaction from '../../lib/transaction';

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

    describe('updateForBTCAddress', () => {


        it('returns', () => {
            return transaction.updateForBTCAddress('1LuckyY9fRzcJre7aou7ZhWVXktxjjBb9S', 1).then(() => {
                expect(2).to.equal(2);
            });
        });


        describe('no accountId', () => {
            it('throws an error', () => {
                expect(() => { transaction.updateForBTCAddress('1LuckyY9fRzcJre7aou7ZhWVXktxjjBb9S', null); })
                    .to.throw('Transaction: accountId not defined');
            });
        });

        describe('no address', () => {
            it('throws an error', () => {
                expect(() => { transaction.updateForBTCAddress(null, 1); })
                    .to.throw('Transaction: address not defined');
            });
        });

        describe('no btc address', () => {
            it('throws an error', () => {
                expect(() => { transaction.updateForBTCAddress('1LuckyY9fRzcJre7aou7ZhWVXktxjjBb9', 1); })
                    .to.throw('Transaction: Not a valid BTC address');
            });
        });



    });

    describe('updateForETHAddress', () => {


        it('returns', () => {
            return transaction.updateForETHAddress('0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa', 1).then(() => {
                expect(2).to.equal(2);
            });
        });

        describe('no accountId', () => {
            it('throws an error', () => {
                expect(() => { transaction.updateForETHAddress('0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa', null); })
                    .to.throw('Transaction: accountId not defined');
            });
        });

        describe('no address', () => {
            it('throws an error', () => {
                expect(() => { transaction.updateForETHAddress(null, 1); })
                    .to.throw('Transaction: address not defined');
            });
        });

        describe('no ETH address', () => {
            it('throws an error', () => {
                expect(() => { transaction.updateForETHAddress('inv0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa', 1); })
                    .to.throw('Transaction: Not a valid ETH address');
            });
        });



    });

    describe('calcTransactionDataAndSave', () => {

        let currency = 'BTC';
        let currencyPrice = '684.940750000000000000000000';
        let accountId = 1;

        var prices = {
            btcDollarPrice: -1,
            ethDollarPrice: -1,
            dollarPrice: -1,
            discount: '0.00',
            discountUntil: 1526185994000
        };
        var trans = {
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