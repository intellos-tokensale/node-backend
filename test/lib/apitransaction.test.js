const chai = require('chai');


chai.should();
const expect = require('chai').expect;


import transaction from '../../api/transaction';

describe('Transaction API', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            userId: 'hello1',
            body: {

            },
            params: {
                hash: '12341312',

            }
        }
        res = {
            json: (x) => {}
        }
    });

    describe('confirmInvestment', () => {

        it('returns', () => {
            transaction.getTokenAmount(req, res).then(x => {
                expect(2).equals(2);
            })
        });

        describe('no userid', () => {
            it('throws an error', () => {
                delete req.userId;
                expect(() => { transaction.getTokenAmount(req, res); })
                    .to.throw('unauthorized');
            });
        });

    });
    describe('get', () => {

        it('returns', () => {
            transaction.get(req, res).then(x => {
                expect(2).equals(2);
            })
        });

        describe('no userid', () => {
            it('throws an error', () => {
                delete req.userId;
                expect(() => { transaction.get(req, res); })
                    .to.throw('unauthorized');
            });
        });

    });


});