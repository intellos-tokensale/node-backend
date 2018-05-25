const chai = require('chai');


chai.should();
const expect = require('chai').expect;


import email from '../../api/email';

describe('Email API', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {

            },
            params: {
                hash: '12341312',
                userId: 'hello1'
            }
        }
        res = {
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
            it('throws an error', () => {
                delete req.params.userId;
                expect(() => { email.confirmInvestment(req, res); })
                    .to.throw('user not defined');
            });
        });

        describe('no hash defined', () => {
            it('throws an error', () => {
                delete req.params.hash;
                expect(() => { email.confirmInvestment(req, res); })
                    .to.throw('tranasaction not defined');
            });
        });

    });

});