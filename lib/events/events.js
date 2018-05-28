import transaction from '../transaction';
import account from '../account';
import unsucessfulTransaction from '../unsucessfulTransaction';
import config from '../../config';
import checker from '../util/checker';
import logger from '../logger';
const events = require('events');
const eventEmitter = new events.EventEmitter();
const request = require('request-promise');
const ethereum_address = require('ethereum-address');
const bitcoin_address = require('bitcoin-address');


export default {
    eventEmitter,
    processInvestment,
    processUnsucessfulTransaction
};


eventEmitter.on('investment', processInvestment);
eventEmitter.on('unsucessfulTransaction', processUnsucessfulTransaction);

function processInvestment(accountId, hash) {
    if (!accountId) throw new Error('Eventhandler: accountId not defined');
    if (!hash) throw new Error('Eventhandler: hash not defined');

    return account.getbyAccountId(accountId)
        .then(acc => {
            let options = {
                url: config.emailer.baseUrl + 'confirmInvestment/' + acc.userId + '/' + hash,
                headers: {
                    'Authorization': 'Bearer ' + config.emailer.authToken
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