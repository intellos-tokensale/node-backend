const chai = require('chai');


chai.should();
const expect = require('chai').expect;


const unsucessfulTransaction = require('../../lib/unsucessfulTransaction');

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


    });


});