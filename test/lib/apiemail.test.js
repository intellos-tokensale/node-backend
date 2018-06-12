const chai = require('chai');


chai.should();
const expect = require('chai').expect;


const email = require('../../api/email');

describe('Email API', () => {
    let req;
    let res;
    let status;
    let errorText;
    beforeEach(() => {
        status = "";
        errorText = "";
        req = {
            body: {

            },
            params: {
                hash: '12341312',
                userId: 'hello1'
            }
        }
        res = {
            status: (s) => {
                status = s;
                return {
                    send: (x) => { errorText = x; }
                }
            },
            json: (x) => {}
        }
    });

    describe('confirmInvestment', () => {

        it('returns', () => {
            email.confirmInvestment(req, res).then(x => {
                expect(2).equals(2);
            })
        });

        describe('no userid', () => {
            it('returns an error', () => {
                delete req.params.userId;
                email.confirmInvestment(req, res);
                status.should.equals(400);
                errorText.should.equal('missing parameter: user');
            });
        });

        describe('no hash defined', () => {
            it('returns an error', () => {
                delete req.params.hash;
                email.confirmInvestment(req, res);
                status.should.equals(400);
                errorText.should.equal('missing parameter: transaction hash');
            });
        });

    });

});