const chai = require('chai');


chai.should();
const expect = require('chai').expect;
let account = {
    "id": 1,
    "userId": "hello1",
    "email": "hauri.32@gmail.com",
    "ethAddress": "0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a",
    "btcAddress": "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v",
    "erc20Address": "0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a",
    "btcRefundAddress": "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v",
    "ethRefundAddress": "0x47316Df453e8C9f7C942f5dCbFdF66D518d61f2D",
    "kyc": true,
    "suspended": false,
    "createdAt": "2018-05-05T23:38:42.000Z",
    "updatedAt": "2018-05-07T21:02:31.000Z",
    "transactions": []
};

const events = require('../../lib/events/events');

describe('Events', () => {

    describe('processInvestment', () => {

        it('does not Throw an error', () => {
            expect(() => { events.processInvestment(1, '06b37d2b485ff2922ef7ec2e94510d2c103cf791d4b1b3021c312e6508d9c75f'); })
                .to.not.throw();
        });

        describe('no accountid set', () => {
            it('throws an error', () => {
                expect(() => { events.processInvestment(null, '06b37d2b485ff2922ef7ec2e94510d2c103cf791d4b1b3021c312e6508d9c75f'); })
                    .to.throw('Eventhandler: accountId not defined');
            });
        });

        describe('no hash set', () => {
            it('throws an error', () => {
                expect(() => { events.processInvestment(1, null); })
                    .to.throw('Eventhandler: hash not defined');
            });
        });
    });

    describe('processUnsucessfulTransaction', () => {
        it('does not Throw an error', () => {
            expect(() => { events.processUnsucessfulTransaction('address', 'currency', '{}', 'error'); })
                .to.not.throw();
        });

    });

})