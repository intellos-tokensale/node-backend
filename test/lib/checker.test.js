import _m from '../../lib/util/bigMath';
let chai = require('chai');


chai.should();
var expect = require('chai').expect;


import checker from '../../lib/util/checker';

describe('Checker', () => {

    describe('checkAccountProperties', () => {
        let acc;
        beforeEach(() => {
            acc = {
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
            }
        });

        describe('account not defined', () => {
            it('has thrown an error', () => {
                acc = null;
                expect(() => { checker.checkAccountProperties(acc); })
                    .to.throw('Account:account undefined');
            });
        });

        describe('Account: id missing', () => {
            it('has thrown an error', () => {
                delete acc.id;
                expect(() => { checker.checkAccountProperties(acc); })
                    .to.throw('Account: id missing');
            });
        });

        describe('Account: external userId missing', () => {
            it('has thrown an error', () => {
                delete acc.userId;
                expect(() => { checker.checkAccountProperties(acc); })
                    .to.throw('Account: external userId missing');
            });
        });

        describe('Account: email missing', () => {
            it('has thrown an error', () => {
                delete acc.email;
                expect(() => { checker.checkAccountProperties(acc); })
                    .to.throw('Account: email missing');
            });
        });

        describe('Account: ETH Address missing', () => {
            it('has thrown an error', () => {
                delete acc.ethAddress;
                expect(() => { checker.checkAccountProperties(acc); })
                    .to.throw('Account: ethAddress missing ');
            });
        });

        describe('Account: Not a valid ETH address', () => {
            it('has thrown an error', () => {
                acc.ethAddress = '123123231231';
                expect(() => { checker.checkAccountProperties(acc); })
                    .to.throw('Account: Not a valid ETH address');
            });
        });

        describe('Account: BTC Address missing', () => {
            it('has thrown an error', () => {
                delete acc.btcAddress;
                expect(() => { checker.checkAccountProperties(acc); })
                    .to.throw('Account: btcAddress missing');
            });
        });

        describe('Account: Not a valid BTC address', () => {
            it('has thrown an error', () => {
                acc.btcAddress = '123123231231';
                expect(() => { checker.checkAccountProperties(acc); })
                    .to.throw('Account: Not a valid BTC address');
            });
        });

    });

    describe('checkPricesProperties', () => {
        let prices;
        beforeEach(() => {

            prices = {
                btcDollarPrice: 0.3,
                ethDollarPrice: 0.4,
                dollarPrice: 10,
                discount: '0.00',
                discountUntil: 1526185994000
            };
        });


        it('has not thrown an error', () => {
            expect(() => { checker.checkPricesProperties(prices); })
                .to.not.throw();
        });

        describe('price not defined', () => {
            it('has thrown an error', () => {
                prices = null;
                expect(() => { checker.checkPricesProperties(prices); })
                    .to.throw('Price: Prices undefined');
            });
        });

        describe('Price: id missing', () => {
            it('has thrown an error', () => {
                delete prices.btcDollarPrice;
                expect(() => { checker.checkPricesProperties(prices); })
                    .to.throw('Price: for BTC not set');
            });
        });

        describe('Price: ethDollarPrice missing', () => {
            it('has thrown an error', () => {
                delete prices.ethDollarPrice;
                expect(() => { checker.checkPricesProperties(prices); })
                    .to.throw('Price: for ETH not set');
            });
        });

        describe('Price: dollarPrice missing', () => {
            it('has thrown an error', () => {
                delete prices.dollarPrice;
                expect(() => { checker.checkPricesProperties(prices); })
                    .to.throw('Price: for dollar not set');
            });
        });

        describe('Price: discount missing', () => {
            it('has thrown an error', () => {
                delete prices.discount;
                expect(() => { checker.checkPricesProperties(prices); })
                    .to.throw('Price: no discount defined');
            });
        });

        describe('Price: discountUntil missing', () => {
            it('has thrown an error', () => {
                delete prices.discountUntil;
                expect(() => { checker.checkPricesProperties(prices); })
                    .to.throw('Price: discount end undefined');
            });
        });

    });

    describe('priceRowPlausabilityCheck', () => {
        let prices;
        let av;
        beforeEach(() => {

            prices = {
                btcDollarPrice: 1,
                ethDollarPrice: 1
            };

            av = {
                btcDollarPrice: 1.01,
                ethDollarPrice: 1.01
            };
        });

        it('price returned', () => {
            var o = checker.priceRowPlausabilityCheck(prices, av);
            expect(o.btcDollarPrice).to.be.equal(1);
        });

        it('price is row btc negative', () => {
            av.btcDollarPrice = -1;
            var o = checker.priceRowPlausabilityCheck(prices, av);
            expect(o.btcDollarPrice).to.be.equal(1);
        });

        it('price is row eth negative', () => {
            av.ethDollarPrice = -1;
            var o = checker.priceRowPlausabilityCheck(prices, av);
            expect(o.btcDollarPrice).to.be.equal(1);
        });


        it('has not thrown an error', () => {
            expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                .to.not.throw();
        });

        describe('row not defined', () => {
            it('has thrown an error', () => {
                prices = null;
                expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                    .to.throw('Plausabilty: row not set');
            });
        });

        describe('lastaverage not defined', () => {
            it('has thrown an error', () => {
                av = null;
                expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                    .to.throw('Plausabilty: lastaverage not set');
            });
        });

        describe('row.btcDollarPrice not defined', () => {
            it('has thrown an error', () => {
                prices.btcDollarPrice = null;
                expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                    .to.throw('Plausabilty: BTC price not set in row');
            });
        });

        describe('row.ethDollarPrice not defined', () => {
            it('has thrown an error', () => {
                prices.ethDollarPrice = null;
                expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                    .to.throw('Plausabilty: ETH price not set in row');
            });
        });

        describe('lastaverage.btcDollarPrice not defined', () => {
            it('has thrown an error', () => {
                av.btcDollarPrice = null;
                expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                    .to.throw('Plausabilty: BTC price not set in lastaverage');
            });
        });

        describe('lastaverage.ethDollarPrice not defined', () => {
            it('has thrown an error', () => {
                av.ethDollarPrice = null;
                expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                    .to.throw('Plausabilty: ETH price not set in lastaverage');
            });
        });


        describe('btcDollarPrice too high', () => {
            it('has thrown an error', () => {
                prices.btcDollarPrice = 10;
                expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                    .to.throw('Plausabilty: btcprice has a too high value');
            });
        });

        describe('btcDollarPrice too low', () => {
            it('has thrown an error', () => {
                prices.ethDollarPrice = 10;
                expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                    .to.throw('Plausabilty: ethprice has a too high value');
            });
        });

        describe('btcDollarPrice too high', () => {
            it('has thrown an error', () => {
                prices.btcDollarPrice = 0.01;
                expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                    .to.throw('Plausabilty: btcprice has a too low value');
            });
        });

        describe('btcDollarPrice too low', () => {
            it('has thrown an error', () => {
                prices.ethDollarPrice = 0.001;
                expect(() => { checker.priceRowPlausabilityCheck(prices, av); })
                    .to.throw('Plausabilty: ethprice has a too low value');
            });
        });



    });



    describe('checkInternalTransacitonProperties', () => {
        let trans;
        beforeEach(() => {

            trans = {
                value: _m.newD(1),
                confirmations: 22,
                hash: 'ee918efddbd54f17e029ff1bf58ec32d147d59f1f88d4cdcb32c0024c8a7ed4c',
                time: 1526185994000
            };
        });


        describe('transaction passes all', () => {
            it('has not thrown an error', () => {
                expect(() => { checker.checkInternalTransacitonProperties(trans); })
                    .to.not.throw();
            });
        });

        describe('transaction not defined', () => {
            it('has thrown an error', () => {
                trans = null;
                expect(() => { checker.checkInternalTransacitonProperties(trans); })
                    .to.throw('Transaction: Transaction undefined');
            });
        });

        describe('Transaction: value not big decimal', () => {
            it('has thrown an error', () => {
                trans.value = 1;
                expect(() => { checker.checkInternalTransacitonProperties(trans); })
                    .to.throw('Transaction: value undefined');
            });
        });

        describe('Transaction: value not defined', () => {
            it('has thrown an error', () => {
                delete trans.value;
                expect(() => { checker.checkInternalTransacitonProperties(trans); })
                    .to.throw('Transaction: value undefined');
            });
        });

        describe('Transaction: hash missing', () => {
            it('has thrown an error', () => {
                delete trans.hash;
                expect(() => { checker.checkInternalTransacitonProperties(trans); })
                    .to.throw('Transaction:  hash undefined');
            });
        });

        describe('Transaction: confirmations missing', () => {
            it('has thrown an error', () => {
                delete trans.confirmations;
                expect(() => { checker.checkInternalTransacitonProperties(trans); })
                    .to.throw('Transaction: confirmations undefined');
            });
        });

        describe('Transaction: confirmations not a number', () => {
            it('has thrown an error', () => {
                trans.confirmations = NaN;
                expect(() => { checker.checkInternalTransacitonProperties(trans); })
                    .to.throw('Transaction: confirmations not a number');
            });
        });

        describe('Transaction: confirmations negative', () => {
            it('has thrown an error', () => {
                trans.confirmations = -1;
                expect(() => { checker.checkInternalTransacitonProperties(trans); })
                    .to.throw('Transaction: confirmations negative');
            });
        });

    });

    describe('checkBlockchainBTCTransactionProperties', () => {
        let trans;
        let LBlock;
        beforeEach(() => {
            LBlock = { height: 522495 };
            trans = {
                ver: 1,
                inputs: [{
                        sequence: 4294967295,
                        witness: '02483045022100cdecadcbe030c584dda8421a99f7b34113bc1fcd6ad90ff6db2c1036440c5e8a02202a889092457df7853ba77600c50bc7afeb772c6ea3047360fc335f223ae7c7ba012102a8708ba0cce5dd095b5cdb9f4fe8c476a0723fae677f828e155d8c28f3b072be',
                        prev_out: [Object],
                        script: '1600145de4fcb38656ae86b77718a8fa32c819f0690c6d'
                    },
                    {
                        sequence: 4294967295,
                        witness: '02483045022100a00906fcab4c58ab8b81b10a4866357e9de8e47f91d49f49d54740501fc26f8802201ff593c2c4f57fdf336193252e7b1561552f77c74ba04271587791c379eaa6f90121025dd0235a8827961b7ae94e6ed2339a32184f35e339e91dfe133bde9921e262f1',
                        prev_out: [Object],
                        script: '16001485c550e45f3cf3cb2c3b3c393398098b1d02ea6d'
                    }
                ],
                weight: 906,
                block_height: 522490,
                relayed_by: '0.0.0.0',
                out: [{
                    addr_tag_link: 'http://luckyb.it/',
                    addr_tag: 'LuckyBit yellow',
                    spent: true,
                    tx_index: 347951415,
                    type: 0,
                    addr: '1LuckyY9fRzcJre7aou7ZhWVXktxjjBb9S',
                    value: 2934785,
                    n: 0,
                    script: '76a914da5dde8cbf20315f3e00ad8d6b610c14bb6d0ab888ac'
                }],
                lock_time: 0,
                result: -3730205,
                size: 390,
                time: 1526203001,
                tx_index: 347951415,
                vin_sz: 2,
                hash: '5a251a3c5af9528e09d2e47382b2f68515ec03e3f690b0d8591333efc623f682',
                vout_sz: 1
            };
        });

        describe('BTC Transaction: passes all', () => {
            it('has not thrown an error', () => {
                expect(() => { checker.checkBlockchainBTCTransactionProperties(trans, LBlock); })
                    .to.not.throw();
            });
        });

        describe('BTC Transaction: out is missing', () => {
            it('has thrown an error', () => {
                delete trans.out;
                expect(() => { checker.checkBlockchainBTCTransactionProperties(trans, LBlock); })
                    .to.throw('BTC: Transaction out undefined');
            });
        });

        describe('BTC Transaction: out is not an array', () => {
            it('has thrown an error', () => {
                trans.out = 'something';
                expect(() => { checker.checkBlockchainBTCTransactionProperties(trans, LBlock); })
                    .to.throw('BTC: Transaction out not an array');
            });
        });

        describe('BTC Transaction: hash missing', () => {
            it('has thrown an error', () => {
                delete trans.hash;
                expect(() => { checker.checkBlockchainBTCTransactionProperties(trans, LBlock); })
                    .to.throw('BTC: Transaction hash undefined');
            });
        });

        describe('BTC Transaction: Last block Block height missing', () => {
            it('has thrown an error', () => {
                delete LBlock.height;
                expect(() => { checker.checkBlockchainBTCTransactionProperties(trans, LBlock); })
                    .to.throw('BTC: Last Block height undefined');
            });
        });

        describe('BTC Transaction: LBlock height not a number', () => {
            it('has thrown an error', () => {
                LBlock.height = NaN;
                expect(() => { checker.checkBlockchainBTCTransactionProperties(trans, LBlock); })
                    .to.throw('BTC: Last Block height not a number');
            });
        });

        describe('Transaction: LBlock height negative', () => {
            it('has thrown an error', () => {
                LBlock.height = -1;
                expect(() => { checker.checkBlockchainBTCTransactionProperties(trans, LBlock); })
                    .to.throw('BTC:  Last Block height negative');
            });
        });

        describe('BTC Transaction: height missing', () => {
            it('has thrown an error', () => {
                delete trans.block_height;
                expect(() => { checker.checkBlockchainBTCTransactionProperties(trans, LBlock); })
                    .to.throw('BTC: Transaction block_height undefined');
            });
        });

        describe('BTC Transaction: height not a number', () => {
            it('has thrown an error', () => {
                trans.block_height = NaN;
                expect(() => { checker.checkBlockchainBTCTransactionProperties(trans, LBlock); })
                    .to.throw('BTC: Transaction block_height not a number');
            });
        });

        describe('Transaction:  height negative', () => {
            it('has thrown an error', () => {
                trans.block_height = -1;
                expect(() => { checker.checkBlockchainBTCTransactionProperties(trans, LBlock); })
                    .to.throw('BTC: Transaction block_height negative');
            });
        });

    });


    describe('checkBlockchainETHTransactionProperties', () => {
        let trans;
        beforeEach(() => {
            trans = {
                blockNumber: '5607909',
                timeStamp: '1526236316',
                hash: '0xbfc36430a7ee7c9fb6f95a4b5a0bcabee497721bc3fdf542429b330bf1dcfcae',
                nonce: '396336',
                blockHash: '0x5378d3bcd695eb2d19286212d15291a6ae016f198d8f260454714bc678125639',
                transactionIndex: '66',
                from: '0x876eabf441b2ee5b5b0554fd502a8e0600950cfa',
                to: '0xab0821eaab7a216572308471c88acedd293952fd',
                value: '112253640000000000',
                gas: '90000',
                gasPrice: '30000000000',
                isError: '0',
                txreceipt_status: '1',
                input: '0x00',
                contractAddress: '',
                cumulativeGasUsed: '2373643',
                gasUsed: '21004',
                confirmations: '26'
            };
        });

        describe('ETH Transaction: passes all', () => {
            it('has not thrown an error', () => {
                expect(() => { checker.checkBlockchainETHTransactionProperties(trans); })
                    .to.not.throw();
            });
        });

        describe(' Transaction: value is missing', () => {
            it('has thrown an error', () => {
                delete trans.value;
                expect(() => { checker.checkBlockchainETHTransactionProperties(trans); })
                    .to.throw('Eth: Transaction value undefined');
            });
        });


        describe('ETH Transaction: value not a number', () => {
            it('has thrown an error', () => {
                trans.value = 'aa';
                expect(() => { checker.checkBlockchainETHTransactionProperties(trans); })
                    .to.throw('Eth: value not a number');
            });
        });


        describe('ETH Transaction: hash missing', () => {
            it('has thrown an error', () => {
                delete trans.hash;
                expect(() => { checker.checkBlockchainETHTransactionProperties(trans); })
                    .to.throw('Eth: Transaction hash undefined');
            });
        });

        describe('ETH Transaction: confirmations missing', () => {
            it('has thrown an error', () => {
                delete trans.confirmations;
                expect(() => { checker.checkBlockchainETHTransactionProperties(trans); })
                    .to.throw('Eth: Transaction confirmations undefined');
            });
        });

        describe('ETH Transaction: confirmations not a number', () => {
            it('has thrown an error', () => {
                trans.confirmations = NaN;
                expect(() => { checker.checkBlockchainETHTransactionProperties(trans); })
                    .to.throw('Eth: Transaction confirmations not a number');
            });
        });

        describe('ETH Transaction: confirmations negative', () => {
            it('has thrown an error', () => {
                trans.confirmations = -1;
                expect(() => { checker.checkBlockchainETHTransactionProperties(trans); })
                    .to.throw('Eth: Transaction confirmations negative');
            });
        });

    });

    describe('checkTime', () => {

        describe('no time set', () => {
            it('throws an error', () => {
                expect(() => { checker.checkTime(null, ''); })
                    .to.throw('No time set');
            });
        });

        describe('time to early', () => {
            it('throws an error', () => {
                expect(() => { checker.checkTime(370569600 * 1000, ''); })
                    .to.throw('Ilegal Time before 2008');
            });
        });

        describe('time to late', () => {
            it('throws an error', () => {
                expect(() => { checker.checkTime(2208988800 * 1000, ''); })
                    .to.throw('Ilegal Time after 2038');
            });
        });

    });

    describe('checkFuture', () => {

        describe('no time set', () => {
            it('throws an error', () => {
                expect(() => { checker.checkFuture(null, Date.now(), ''); })
                    .to.throw('No time set');
            });
        });

        describe('no time set', () => {
            it('throws an error', () => {
                expect(() => { checker.checkFuture(Date.now(), null, ''); })
                    .to.throw('No baseTime set');
            });
        });

        describe('basetime after time', () => {
            it('throws an error', () => {
                expect(() => { checker.checkFuture(Date.now() - 1, Date.now(), ''); })
                    .to.throw();
            });
        });


    });


});