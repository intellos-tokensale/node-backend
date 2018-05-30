const chai = require('chai');


chai.should();
const expect = require('chai').expect;


import admin from '../../api/admin';

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
                time: Date.now()
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
            admin.fetchTransactions(req, res);
            expect(2).equals(2);
        });

        describe('no time', () => {
            it('returns an error', () => {
                delete req.params.time;
                admin.fetchTransactions(req, res);
                status.should.equals(400);
                errorText.should.equal('missing parameter: time');
            });
        });

    });

});