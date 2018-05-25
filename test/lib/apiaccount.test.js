const chai = require('chai');


chai.should();
const expect = require('chai').expect;


import account from '../../api/account';

describe('Account API', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            userId: 'hello1',
            userEmail: 'hallo@hallo_nomail.com',
            body: {
                erc20Address: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
                ethRefundAddress: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
                btcRefundAddress: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v'
            }
        }
        res = {
            json: (x) => {}
        }
    });

    describe('get', () => {

        it('returns', () => {
            account.get(req, res).then(x => {
                expect(2).equals(2);
            })
        });

        describe('no userid', () => {
            it('throws an error', () => {
                delete req.userId;
                expect(() => { account.get(req, res); })
                    .to.throw('unauthorized');
            });
        });

        describe('no email', () => {
            it('throws an error', () => {
                delete req.userEmail;
                expect(() => { account.get(req, res); })
                    .to.throw('email on user missing');
            });
        });
    });

    describe('saveErc20', () => {

        it('returns', () => {
            account.saveErc20(req, res).then(x => {
                expect(2).equals(2);
            })
        });

        describe('no userid', () => {
            it('throws an error', () => {
                delete req.userId;
                expect(() => { account.saveErc20(req, res); })
                    .to.throw('unauthorized');
            });
        });

        describe('no erc20Address', () => {
            it('throws an error', () => {
                delete req.body.erc20Address;
                expect(() => { account.saveErc20(req, res); })
                    .to.throw('erc20 address Missing');
            });
        });

        describe('no erc20Address', () => {
            it('throws an error', () => {
                req.body.erc20Address = "asdf";
                expect(() => { account.saveErc20(req, res); })
                    .to.throw('Not a valid erc20 address');
            });
        });
    });

    describe('saveETHRefundAddress', () => {

        it('returns', () => {
            account.saveETHRefundAddress(req, res).then(x => {
                expect(2).equals(2);
            })
        });

        describe('no userid', () => {
            it('throws an error', () => {
                delete req.userId;
                expect(() => { account.saveETHRefundAddress(req, res); })
                    .to.throw('unauthorized');
            });
        });

        describe('no ethRefundAddress', () => {
            it('throws an error', () => {
                delete req.body.ethRefundAddress;
                expect(() => { account.saveETHRefundAddress(req, res); })
                    .to.throw('eth refund address Missing');
            });
        });

        describe('no erc20Address', () => {
            it('throws an error', () => {
                req.body.ethRefundAddress = "asdf";
                expect(() => { account.saveETHRefundAddress(req, res); })
                    .to.throw('Not a valid ETH address');
            });
        });

    });

    describe('saveBTCRefundAddress', () => {

        it('returns', () => {
            account.saveBTCRefundAddress(req, res).then(x => {
                expect(2).equals(2);
            })
        });

        describe('no userid', () => {
            it('throws an error', () => {
                delete req.userId;
                expect(() => { account.saveBTCRefundAddress(req, res); })
                    .to.throw('unauthorized');
            });
        });

        describe('no erc20Address', () => {
            it('throws an error', () => {
                delete req.body.btcRefundAddress;
                expect(() => { account.saveBTCRefundAddress(req, res); })
                    .to.throw('btc refund address address Missing');
            });
        });

        describe('no btcRefundAddress', () => {
            it('throws an error', () => {
                req.body.btcRefundAddress = "asdf";
                expect(() => { account.saveBTCRefundAddress(req, res); })
                    .to.throw('Not a valid BTC address');
            });
        });
    });

});