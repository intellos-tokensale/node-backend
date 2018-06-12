const chai = require('chai');


chai.should();
const expect = require('chai').expect;


const account = require('../../api/account');
const sender = require('../../lib/email/sender');

describe('Account API', () => {
    let req;
    let res;
    let status;
    let errorText;
    beforeEach(() => {
        status = "";
        errorText = "";
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
            status: (s) => {
                status = s;
                return {
                    send: (x) => { errorText = x; }
                }
            },
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
            it('returns an error', () => {
                delete req.userId;
                account.get(req, res);
                status.should.equals(403);
                errorText.should.equal('unauthorized');
            });
        });

        describe('no email', () => {
            it('returns an error', () => {
                delete req.userEmail;
                account.get(req, res);
                status.should.equals(400);
                errorText.should.equal('missing parameter: email');
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
            it('returns an error', () => {
                delete req.userId;
                account.saveErc20(req, res);
                status.should.equals(403);
                errorText.should.equal('unauthorized');

            });
        });

        describe('no erc20Address', () => {
            it('returns an error', () => {
                delete req.body.erc20Address;
                account.saveErc20(req, res);
                status.should.equals(400);
                errorText.should.equal('missing parameter: erc20');

            });
        });

        describe('no erc20Address', () => {
            it('returns an error', () => {
                req.body.erc20Address = "asdf";
                account.saveErc20(req, res);
                status.should.equals(400);
                errorText.should.equal('parameter not valid: erc20 address');

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
            it('returns an error', () => {
                delete req.userId;
                account.saveETHRefundAddress(req, res);
                status.should.equals(403);
                errorText.should.equal('unauthorized');

            });
        });

        describe('no ethRefundAddress', () => {
            it('returns an error', () => {
                delete req.body.ethRefundAddress;
                account.saveETHRefundAddress(req, res);
                status.should.equals(400);
                errorText.should.equal('missing parameter: ETH refund address');

            });
        });

        describe('invalid ethRefundAddress', () => {
            it('returns an error', () => {
                req.body.ethRefundAddress = "asdf";
                account.saveETHRefundAddress(req, res);
                status.should.equals(400);
                errorText.should.equal('parameter not valid: ETH address');

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
            it('returns an error', () => {
                delete req.userId;
                account.saveBTCRefundAddress(req, res);
                status.should.equals(403);
                errorText.should.equal('unauthorized');

            });
        });

        describe('no btcRefundAddress', () => {
            it('returns an error', () => {
                delete req.body.btcRefundAddress;
                account.saveBTCRefundAddress(req, res);
                status.should.equals(400);
                errorText.should.equal('missing parameter: BTC refund address');

            });
        });

        describe('no btcRefundAddress', () => {
            it('returns an error', () => {
                req.body.btcRefundAddress = "asdf";
                account.saveBTCRefundAddress(req, res);
                status.should.equals(400);
                errorText.should.equal('parameter not valid: BTC address');

            });
        });
    });

});