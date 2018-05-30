const chai = require('chai');


chai.should();
const expect = require('chai').expect;


import price from '../../api/price';

describe('Price API', () => {
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
        };
        res = {
            status: (s) => {
                console.log("*");
                status = s;
                return {
                    send: (x) => { errorText = x; }
                }
            },
            json: (x) => {}
        }
    });

    describe('getLast', () => {

        it('returns', () => {
            price.getLast(req, res).then(x => {
                expect(2).equals(2);
            })
        });
    });

    describe('getByTime', () => {

        it('returns', () => {
            price.getByTime(req, res).then(x => {
                expect(2).equals(2);
            })
        });

        describe('no time defined', () => {
            it('returns an error', () => {
                delete req.params.time;
                console.log(res);
                price.getByTime(req, res);

                status.should.equals(400);
                errorText.should.equal('missing parameter: time');
            });
        });

    });

});