const chai = require('chai');


chai.should();
const expect = require('chai').expect;


import price from '../../lib/price';

describe('Price', () => {

    before(() => {
        return new Promise((resolve) => {
            price.priceNowByExchange();
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    });

    describe('fetchPairToDB', () => {
        describe('exchange set', () => {
            it('throws no error', () => {
                expect(() => { price.fetchPairToDB('coinbase'); })
                    .to.not.throw();
            });
        });
        describe('no exchange set', () => {
            it('throws an error', () => {
                expect(() => { price.fetchPairToDB(); })
                    .to.throw('exchange not set');
            });
        });
    });

    describe('getLast', () => {
        let p;
        before(() => {
            return new Promise((resolve) => {
                price.getLast()
                    .then(x => {
                        p = x;
                        resolve();
                    });
            });
        });

        it('has all properties', () => {
            expect(p.btcDollarPrice).to.exist;
            expect(p.ethDollarPrice).to.exist;
            expect(p.dollarPrice).to.exist;
            expect(p.discount).to.exist;
            expect(p.discountUntil).to.exist;
        });

    });

    describe('getLast', () => {
        let p;
        before(() => {
            return new Promise((resolve) => {
                price.getByTime(Date.now())
                    .then(x => {
                        p = x;
                        resolve();
                    });
            });
        });

        it('has all properties', () => {
            expect(p.btcDollarPrice).to.exist;
            expect(p.ethDollarPrice).to.exist;
            expect(p.dollarPrice).to.exist;
            expect(p.discount).to.exist;
            expect(p.discountUntil).to.exist;
        });

    });

});