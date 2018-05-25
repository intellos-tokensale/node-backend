const chai = require('chai');


chai.should();
const expect = require('chai').expect;


import bigMath from '../../lib/util/bigMath';

describe('bigMath', () => {


    describe('newD without number', () => {
        it('has thrown an error', () => {
            expect(() => { bigMath.newD('hello'); })
                .to.throw();
        });
    });

    describe('norm without number', () => {
        it('has thrown an error', () => {
            expect(() => { bigMath.norm(1); })
                .to.throw();
        });
    });


});