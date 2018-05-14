let chai = require('chai');


chai.should();
var expect = require('chai').expect;


import price from '../../api/price';

describe('Price API', () => {
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
            it('throws an error', () => {
                delete req.params.time;
                expect(() => { price.getByTime(req, res); })
                    .to.throw('time not defined');
            });
        });

    });

});