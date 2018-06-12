const EVENT_INVESTMENT = 'investment';
const EVENT_UNSUCESSFULTRANSACTION = 'unsucessfulTransaction';
const events = require('events');
const eventEmitter = new events.EventEmitter();

module.exports = {
    eventEmitter,
    processInvestment,
    processUnsucessfulTransaction,
    EVENT_INVESTMENT,
    EVENT_UNSUCESSFULTRANSACTION
};

const transaction = require('../transaction');
const account = require('../account');
const unsucessfulTransaction = require('../unsucessfulTransaction');
const config = require('../../config');
const checker = require('../util/checker');
const logger = require('../logger');
const request = require('request-promise');
const ethereum_address = require('ethereum-address');
const bitcoin_address = require('bitcoin-address');




eventEmitter.on(EVENT_INVESTMENT, processInvestment);
eventEmitter.on(EVENT_UNSUCESSFULTRANSACTION, processUnsucessfulTransaction);

function processInvestment(accountId, hash) {
    if (!accountId) throw new Error('Eventhandler: accountId not defined');
    if (!hash) throw new Error('Eventhandler: hash not defined');

    return account.getbyAccountId(accountId)
        .then(acc => {
            let options = {
                url: config.emailer.baseurl + 'confirmInvestment/' + acc.userId + '/' + hash,
                headers: {
                    'Authorization': 'Bearer ' + config.emailer.authtoken
                }
            };
            return request(options);
        })
        .catch(err => {
            logger.warn('there was an error in the investment event handler', err);
        });
}

function processUnsucessfulTransaction(address, currency, tx, error) {
    return unsucessfulTransaction.save(address, currency, JSON.stringify(tx), error)
        .catch(err => {
            logger.warn('there was an error saving the unsucessful Transaction', err);
        });
}