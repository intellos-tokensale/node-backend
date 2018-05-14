let chai = require('chai');


chai.should();
var expect = require('chai').expect;


import unsucessfulTransaction from '../../lib/unsucessfulTransaction';

describe('UnsucessfulTransaction', () => {

    describe('save', () => {
        describe('correct', () => {
            let utx;
            before(() => {
                return new Promise((resolve) => {
                    unsucessfulTransaction.save('btcAddress', 'BTC', '{}', 'error')
                        .then(x => {
                            utx = x.dataValues;
                            resolve();
                        });
                });
            });

            it('has been saved', () => {
                utx.address.should.equal('btcAddress');
                utx.currency.should.equal('BTC');
                utx.transactionJson.should.equal('{}');
                utx.error.should.equal('error');
            });
        });

        describe('no address', () => {
            it('has not been saved', () => {
                expect(() => { unsucessfulTransaction.save(undefined, 'BTC', '{}', 'error'); })
                    .to.throw('UnsucessfulTransaction: address not defined');
            });
        });

        describe('no currecy', () => {
            it('has not been saved', () => {
                expect(() => { unsucessfulTransaction.save('btcAddress', null, '{}', 'error'); })
                    .to.throw('UnsucessfulTransaction: currency not defined');
            });
        });

        describe('no transactionJson', () => {
            it('has not been saved', () => {
                expect(() => { unsucessfulTransaction.save('btcAddress', 'BTC', null, 'error'); })
                    .to.throw('UnsucessfulTransaction: transactionJson not defined');
            });
        });

        describe('no error', () => {
            it('has not been saved', () => {
                expect(() => { unsucessfulTransaction.save('btcAddress', 'BTC', '{}', null); })
                    .to.throw('UnsucessfulTransaction: error not defined');
            });
        });


    });


});