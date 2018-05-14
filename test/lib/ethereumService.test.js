let chai = require('chai');


chai.should();
var expect = require('chai').expect;


import ethereumService from '../../lib/services/ethereumService';

describe('EthereumService', () => {


    describe('getTransactionsByAddress', () => {

        describe('wrong address', () => {
            it('has not been saved', () => {
                expect(() => { ethereumService.getTransactionsByAddress('0x876EabF441B2EE5B5b0554Fd502a8E0600950c'); })
                    .to.throw('Account: Not a valid ETH address');
            });
        });
    });

    describe('calculateTransactions', () => {

        describe('wrong address', () => {
            it('has not been saved', () => {

                expect(() => { ethereumService.calculateTransactions([], null); })
                    .to.throw('Eth Service: address undefined');
            });
        });

        describe('txs do not exist', () => {
            it('has not been saved', () => {

                expect(() => { ethereumService.calculateTransactions(null, '0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa'); })
                    .to.throw('Eth Service: txDate undefined');
            });
        });

        describe('txs are not an array', () => {
            it('has not been saved', () => {
                expect(() => { ethereumService.calculateTransactions('lala', '0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa'); })
                    .to.throw('Eth Service: txDate not an array');
            });
        });
    });





});