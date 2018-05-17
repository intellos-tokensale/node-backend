let chai = require('chai');


chai.should();
var expect = require('chai').expect;


import crawler from '../../lib/crawler';
import account from '../../lib/account';

describe('Crawler', () => {
    before(() => {
        return new Promise((resolve) => {
            account.reloadAccounts()
                .then(() => {
                    resolve();
                });
        });
    });
    describe('crawlBTC', () => {

        it('returns', () => {
            return crawler.crawlBTC(Math.floor(Date.now() / 1000) - 1 * 60 * 60)
                .then(x => {
                    return;
                });
        });

    });


    describe('crawlETH', () => {

        it('returns', () => {
            return crawler.crawlETH(Math.floor(Date.now() / 1000) - 2 * 60).then(x => {
                return;
            });
        });

    });

    describe('crawlUnconfirmedtransactions', () => {

        it('returns', () => {
            return crawler.crawlUnconfirmedtransactions().then(x => {
                return;
            });
        });

    });
});