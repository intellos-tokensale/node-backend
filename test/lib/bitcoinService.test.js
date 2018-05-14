let chai = require('chai');


chai.should();
var expect = require('chai').expect;


import bitcoinService from '../../lib/services/bitcoinService';

describe('BitcoinService', () => {


    describe('getTransactionsByAddress', () => {

        describe('wrong address', () => {
            it('has not been saved', () => {
                expect(() => { bitcoinService.getTransactionsByAddress('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36'); })
                    .to.throw('Account: Not a valid BTC address');
            });
        });
    });

    describe('calculateTransactions', () => {
        let addressData;
        beforeEach(() => {
            addressData = {
                txs: [],
                address: '14ChPPM8rPYJeHnw6kMVUDnNNKx1KnjYW4'
            }
        });

        describe('wrong address', () => {
            it('has not been saved', () => {
                delete addressData.address;
                expect(() => { bitcoinService.calculateTransactions(addressData); })
                    .to.throw('BTC Service: addressData.address undefined');
            });
        });

        describe('txs do not exist', () => {
            it('has not been saved', () => {
                delete addressData.txs;
                expect(() => { bitcoinService.calculateTransactions(addressData); })
                    .to.throw('BTC Service: addressData.txs undefined');
            });
        });

        describe('txs are not an array', () => {
            it('has not been saved', () => {
                addressData.txs = 'lala';
                expect(() => { bitcoinService.calculateTransactions(addressData); })
                    .to.throw('BTC Service: addressData.txs not an array');
            });
        });
    });





});