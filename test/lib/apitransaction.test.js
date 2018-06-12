const chai = require('chai');


chai.should();
const expect = require('chai').expect;


const transaction = require('../../api/transaction');

describe('Transaction API', () => {
    let req;
    let res;
    let status;
    let errorText;
    beforeEach(() => {
        status = "";
        errorText = "";
        req = {
            userId: 'hello1',
            body: {

            },
            params: {
                hash: '12341312',

            }
        };
        res = {
            status: (s) => {
                status = s;
                return {
                    send: (x) => { errorText = x; }
                }
            },
            json: (x) => {}
        };
    });

    describe('confirmInvestment', () => {

        it('returns', () => {
            transaction.getTokenAmount(req, res).then(x => {
                expect(2).equals(2);
            })
        });

        describe('no userid', () => {
            it('returns an error', () => {
                delete req.userId;
                transaction.getTokenAmount(req, res);
                status.should.equals(403);
                errorText.should.equal('unauthorized');
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
            it('returns an error', () => {
                delete req.userId;
                transaction.get(req, res);
                status.should.equals(403);
                errorText.should.equal('unauthorized');
            });
        });

    });


});