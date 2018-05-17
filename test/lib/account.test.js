let chai = require('chai');


chai.should();
var expect = require('chai').expect;


import account from '../../lib/account';
import models from '../../models';

describe('Account', () => {
    describe('get', () => {
        let acc;
        before(() => {
            return new Promise((resolve) => {
                account.get('hello1', 'hauri.32@gmail.com')
                    .then(x => {
                        acc = x;
                        resolve();
                    });
            });
        });

        it('has all properties', () => {
            acc.id.should.equal(1);
            acc.userId.should.equal("hello1");
            acc.email.should.equal("hauri.32@gmail.com");
            acc.ethAddress.should.equal("0x70faa28A6B8d6829a4b1E649d26eC9a2a39ba413");
            acc.btcAddress.should.equal("1dice7W2AicHosf5EL3GFDUVga7TgtPFn");
            acc.erc20Address.should.equal("0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a");
            acc.btcRefundAddress.should.equal("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
            acc.ethRefundAddress.should.equal("0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a");
            acc.kyc.should.equal(true);
            acc.suspended.should.equal(false);
            acc.transactions.should.be.an('array');
        });

        describe('no userid', () => {
            it('throws an error', () => {
                expect(() => { account.get(); })
                    .to.throw('Account: no user Id defined');
            });
        });
    });



    describe('getFlat', () => {
        let acc;
        before(() => {
            return new Promise((resolve) => {
                account.getFlat('hello1', 'hauri.32@gmail.com')
                    .then(x => {
                        acc = x;
                        resolve();
                    });
            });
        });

        it('has all properties', () => {
            acc.id.should.equal(1);
            acc.userId.should.equal("hello1");
            acc.email.should.equal("hauri.32@gmail.com");
            acc.ethAddress.should.equal("0x70faa28A6B8d6829a4b1E649d26eC9a2a39ba413");
            acc.btcAddress.should.equal("1dice7W2AicHosf5EL3GFDUVga7TgtPFn");
            acc.erc20Address.should.equal("0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a");
            acc.btcRefundAddress.should.equal("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
            acc.ethRefundAddress.should.equal("0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a");
            acc.kyc.should.equal(true);
            acc.suspended.should.equal(false);
            expect(acc.transactions).to.be.undefined;
        });

        describe('no userid', () => {
            it('throws an error', () => {
                expect(() => { account.getFlat(); })
                    .to.throw('Account: no user Id defined');
            });
        });
    });

    describe('getFlat', () => {


        it('making new entry', () => {
            let tmp = {
                ethAddress: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
                btcAddress: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v'
            };
            let id;
            models.Accounts.create(tmp)
                .then((o) => {
                    id = o.dataValues.id;
                    return account.getFlat('user' + Math.random(), 'email@email' + Math.random());
                }).then(x => {
                    expect(id).to.be.equals(x.id);
                    models.Accounts.destroy({
                        where: {
                            id: id
                        }
                    });
                });

        });

    });

    describe('getbyAccountId', () => {
        let acc;
        before(() => {
            return new Promise((resolve) => {
                account.getbyAccountId(1)
                    .then(x => {
                        acc = x;
                        resolve();
                    });
            });
        });

        it('has all properties', () => {
            acc.id.should.equal(1);
            acc.userId.should.equal("hello1");
            acc.email.should.equal("hauri.32@gmail.com");
            acc.ethAddress.should.equal("0x70faa28A6B8d6829a4b1E649d26eC9a2a39ba413");
            acc.btcAddress.should.equal("1dice7W2AicHosf5EL3GFDUVga7TgtPFn");
            acc.erc20Address.should.equal("0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a");
            acc.btcRefundAddress.should.equal("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
            acc.ethRefundAddress.should.equal("0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a");
            acc.kyc.should.equal(true);
            acc.suspended.should.equal(false);
            expect(acc.transactions).to.be.undefined;
        });

        describe('no accountid', () => {
            it('throws an error', () => {
                expect(() => { account.getbyAccountId(); })
                    .to.throw('Account: accountId not defined');
            });
        });
    });

    describe('reloadAccounts', () => {
        let acc;
        before(() => {
            return new Promise((resolve) => {
                account.reloadAccounts()
                    .then(() => {
                        resolve();
                    });
            });
        });
        describe('loadedAddressToAccountId', () => {
            it('eth address exists', () => {
                var id = account.loadedAddressToAccountId("0x70faa28A6B8d6829a4b1E649d26eC9a2a39ba413");
                id.should.equal(1);
            });

            it('btc address exists', () => {
                var id = account.loadedAddressToAccountId("1dice7W2AicHosf5EL3GFDUVga7TgtPFn");
                id.should.equal(1);
            });

            it('address des not exist', () => {
                var id = account.loadedAddressToAccountId("asdf");
                expect(id).to.be.null;
            });

            it('address des not exist', () => {
                var id = account.loadedAddressToAccountId("asdf");
                expect(id).to.be.null;
            });
        });
        describe('getAssociatedAccountsETH', () => {
            it('eth address exists', () => {
                var accs = account.getAssociatedAccountsETH();
                accs.should.be.an('array');
            });
        });

        describe('getAssociatedAccountsBTC', () => {
            it('eth address exists', () => {
                var accs = account.getAssociatedAccountsBTC();
                accs.should.be.an('array');
            });
        });

    });


    describe('saveErc20', () => {
        describe('correct address', () => {
            let acc;
            before(() => {
                return new Promise((resolve) => {
                    account.saveErc20('hello1', '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a')
                        .then(x => {
                            acc = x.dataValues;
                            resolve();
                        });
                });
            });

            it('has been saved', () => {
                acc.erc20Address.should.equal('0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a');
            });
        });

        describe('wrong address', () => {
            it('has not been saved', () => {
                expect(() => { account.saveErc20('hello1', '0xddbd2b932c763ba5b1b7ae3b362ea0121a'); })
                    .to.throw('Account: Not a valid erc20 address');
            });
        });

        describe('no address', () => {
            it('has not been saved', () => {
                expect(() => { account.saveErc20('hello1'); })
                    .to.throw('Account: erc20Address not defined');
            });
        });

        describe('no userid', () => {
            it('has not been saved', () => {
                expect(() => { account.saveErc20(undefined, '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a'); })
                    .to.throw('Account: userId not defined');
            });
        });
    });



    describe('saveETHRefundAddress', () => {
        describe('correct address', () => {
            let acc;
            before(() => {
                return new Promise((resolve) => {
                    account.saveETHRefundAddress('hello1', '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a')
                        .then(x => {
                            acc = x.dataValues;
                            resolve();
                        });
                });
            });

            it('has been saved', () => {
                acc.ethRefundAddress.should.equal('0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a');
            });
        });

        describe('wrong address', () => {
            it('has not been saved', () => {
                expect(() => { account.saveETHRefundAddress('hello1', '0xddbd2b932c763ba5b1b7ae3b362ea0121a'); })
                    .to.throw('Account: Not a valid ETH address');
            });
        });

        describe('no address', () => {
            it('has not been saved', () => {
                expect(() => { account.saveETHRefundAddress('hello1'); })
                    .to.throw('Account: ETHAddress not defined');
            });
        });

        describe('no userid', () => {
            it('has not been saved', () => {
                expect(() => { account.saveETHRefundAddress(undefined, '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a'); })
                    .to.throw('Account: userId not defined');
            });
        });
    });

    describe('saveBTCRefundAddress', () => {
        describe('correct address', () => {
            let acc;
            before(() => {
                return new Promise((resolve) => {
                    account.saveBTCRefundAddress('hello1', '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v')
                        .then(x => {
                            acc = x.dataValues;
                            resolve();
                        });
                });
            });

            it('has been saved', () => {
                acc.btcRefundAddress.should.equal('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v');
            });
        });

        describe('wrong address', () => {
            it('has not been saved', () => {
                expect(() => { account.saveBTCRefundAddress('hello1', '0xddbd2b932c763ba5b1b7ae3b362ea0121a'); })
                    .to.throw('Account: Not a valid BTC address');
            });
        });

        describe('no address', () => {
            it('has not been saved', () => {
                expect(() => { account.saveBTCRefundAddress('hello1'); })
                    .to.throw('Account: BTCAddress not defined');
            });
        });

        describe('no userid', () => {
            it('has not been saved', () => {
                expect(() => { account.saveBTCRefundAddress(undefined, '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a'); })
                    .to.throw('Account: userId not defined');
            });
        });
    });



});