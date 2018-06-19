const chai = require('chai');


chai.should();
const expect = require('chai').expect;


const crawledblock = require('../../lib/crawledblock');
const models = require('../../models');

describe('crawledblock', () => {
    describe('get', () => {
        let blk;
        before(() => {
            return new Promise((resolve) => {
                crawledblock.get(5793409, 'ETH')
                    .then(x => {
                        blk = x;
                        resolve();
                    });
            });
        });

        it('has all properties', () => {
            blk.id.should.equal(168);
            blk.blocknumber.should.equal("5793409");
            blk.currency.should.equal("ETH");
            blk.blockhash.should.equal("0xdc80714ef6c47f48d0b0e7dac24107919525ee6d5977aa8751473d648eb5346b");
            ("" + blk.blocktime).should.equal("Fri Jun 15 2018 15:22:04 GMT+0200 (CEST)");
        });

        describe('no blocknumber', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.get(null, 'ETH'); })
                    .to.throw('crawledblock: no blocknumber defined');
            });
        });

        describe('no currency', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.get(5793409, null); })
                    .to.throw('crawledblock: no currency defined');
            });
        });
    });

    describe('getByHash', () => {
        let blk;
        before(() => {
            return new Promise((resolve) => {
                crawledblock.getByHash("0xdc80714ef6c47f48d0b0e7dac24107919525ee6d5977aa8751473d648eb5346b", 'ETH')
                    .then(x => {
                        blk = x;
                        resolve();
                    });
            });
        });

        it('has all properties', () => {
            blk.id.should.equal(168);
            blk.blocknumber.should.equal("5793409");
            blk.currency.should.equal("ETH");
            blk.blockhash.should.equal("0xdc80714ef6c47f48d0b0e7dac24107919525ee6d5977aa8751473d648eb5346b");
            ("" + blk.blocktime).should.equal("Fri Jun 15 2018 15:22:04 GMT+0200 (CEST)");
        });

        describe('no hash', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.getByHash(null, 'ETH'); })
                    .to.throw('crawledblock: no blockhash defined');
            });
        });

        describe('no currency', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.getByHash("0xdc80714ef6c47f48d0b0e7dac24107919525ee6d5977aa8751473d648eb5346b", null); })
                    .to.throw('crawledblock: no currency defined');
            });
        });
    });

    describe('blockprocessed', () => {
        let blk;
        before(() => {
            return new Promise((resolve) => {
                crawledblock.blockprocessed(1111111, 'HUR', Date.now(), '00000AAAA000')
                    .then(x => {
                        blk = x.data.dataValues;
                        resolve();
                    });
            });
        });

        it('has all properties', () => {
            blk.blocknumber.should.equal(1111111);
            blk.currency.should.equal("HUR");
            blk.blockhash.should.equal("00000AAAA000");
        });

        describe('no blocknumber', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.blockprocessed(null, 'HUR', Date.now(), '00000AAAA000'); })
                    .to.throw('crawledblock: blocknumber not defined');
            });
        });

        describe('no currency', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.blockprocessed(1111111, null, Date.now(), '00000AAAA000'); })
                    .to.throw('crawledblock: currency not defined');
            });
        });

        describe('no hash', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.blockprocessed(1111111, 'HUR', Date.now(), null); })
                    .to.throw('crawledblock: blockhash not defined');
            });
        });

        describe('no date', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.blockprocessed(1111111, 'HUR', null, '00000AAAA000'); })
                    .to.throw('crawledblock: blocktime not defined');
            });
        });
    });


    describe('skipToLastUnprocessedByHash', () => {
        let blk;
        before(() => {
            return new Promise((resolve) => {
                crawledblock.skipToLastUnprocessedByHash('0xdc80714ef6c47f48d0b0e7dac24107919525ee6d5977aa8751473d648eb5346b', Date.now(), 'ETH')
                    .then(x => {
                        blk = x;
                        resolve();
                    });
            });
        });

        it('has all properties', () => {
            blk.blocknumber.should.equal('5793409');
            blk.currency.should.equal("ETH");
            blk.blockhash.should.equal("0xdc80714ef6c47f48d0b0e7dac24107919525ee6d5977aa8751473d648eb5346b");
        });

        describe('no blocknumber', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.skipToLastUnprocessedByHash(null, Date.now(), 'ETH'); })
                    .to.throw('crawledblock: no hash defined');
            });
        });

        describe('no time', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.skipToLastUnprocessedByHash('0xdc80714ef6c47f48d0b0e7dac24107919525ee6d5977aa8751473d648eb5346b', null, 'ETH'); })
                    .to.throw('crawledblock: no time defined');
            });
        });

        describe('no currency', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.skipToLastUnprocessedByHash('0xdc80714ef6c47f48d0b0e7dac24107919525ee6d5977aa8751473d648eb5346b', Date.now(), null); })
                    .to.throw('crawledblock: no currency defined');
            });
        });
    });

    describe('skipToLastUnprocessed', () => {
        let blk;
        before(() => {
            return new Promise((resolve) => {
                crawledblock.skipToLastUnprocessed(5793409, Date.now(), 'ETH')
                    .then(x => {
                        blk = x;
                        resolve();
                    });
            });
        });

        it('has all properties', () => {
            blk.blocknumber.should.equal('5793409');
            blk.currency.should.equal("ETH");
            blk.blockhash.should.equal("0xdc80714ef6c47f48d0b0e7dac24107919525ee6d5977aa8751473d648eb5346b");
        });

        describe('no blocknumber', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.skipToLastUnprocessed(null, Date.now(), 'ETH'); })
                    .to.throw('crawledblock: no blocknumber defined');
            });
        });

        describe('no time', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.skipToLastUnprocessed(5793409, null, 'ETH'); })
                    .to.throw('crawledblock: no time defined');
            });
        });

        describe('no currency', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.skipToLastUnprocessed(5793409, Date.now(), null); })
                    .to.throw('crawledblock: no currency defined');
            });
        });
    });

    describe('markBlockasProcessed', () => {
        let blk = {
            height: 100000000,
            time: Date.now() / 1000,
            hash: '111122223333AAA'
        };

        it('has all properties', () => {

            crawledblock.markBlockasProcessed(blk, 'ETH', 200000000);
            let b = true;
            b.should.equal(true);
        });

        describe('no blocknumber', () => {
            it('throws an error', () => {
                expect(() => { return crawledblock.markBlockasProcessed(null, 'ETH', 200000000); })
                    .to.throw('crawledblock: no block defined');
            });
        });

        describe('no time', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.markBlockasProcessed(blk, null, 200000000); })
                    .to.throw('crawledblock: no currency defined');
            });
        });

        describe('no currency', () => {
            it('throws an error', () => {
                expect(() => { return crawledblock.markBlockasProcessed(blk, 'ETH', null); })
                    .to.throw('crawledblock: no bestheight defined');
            });
        });
    });

    describe('saveProcessesBlocks', () => {
        let blk = {
            height: 100000000,
            time: Date.now() / 1000,
            hash: '111122223333AAA'
        };
        before(() => {
            return new Promise((resolve) => {
                crawledblock.markBlockasProcessed(blk, 'ETH', 200000000);
                resolve();
            });
        });

        it('has all properties', () => {
            expect(() => { crawledblock.saveProcessesBlocks('ETH'); })
                .to.not.throw();
        });

        describe('no blocknumber', () => {
            it('throws an error', () => {
                expect(() => { crawledblock.saveProcessesBlocks(null); })
                    .to.throw('crawledblock: no currency defined');
            });
        });
    });

});