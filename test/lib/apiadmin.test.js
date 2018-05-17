let chai = require('chai');


chai.should();
var expect = require('chai').expect;


import admin from '../../api/admin';

describe('Email API', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {

            },
            params: {
                time: Date.now()
            }
        }
        res = {
            json: function(x) {}
        }
    });

    describe('confirmInvestment', () => {

        it('returns', () => {
            admin.fetchTransactions(req, res);
            expect(2).equals(2);
        });

        describe('no time', () => {
            it('throws an error', () => {
                delete req.params.time;
                expect(() => { admin.fetchTransactions(req, res); })
                    .to.throw('time missing');
            });
        });

    });

});