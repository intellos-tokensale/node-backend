const EVENT_INVESTMENT = 'investment';
const EVENT_PASSWORDRESET = 'passwordReset';
const EVENT_USERREGISTRATION = 'userRegistration';
const EVENT_EMAILCONFIRMATION = 'emailConfirmation';
const EVENT_UNSUCESSFULTRANSACTION = 'unsucessfulTransaction';
const events = require('events');
const eventEmitter = new events.EventEmitter();

module.exports = {
    eventEmitter,
    processInvestment,
    processUnsucessfulTransaction,
    processEmailConfirmation,
    processPasswordReset,
    EVENT_INVESTMENT,
    EVENT_USERREGISTRATION,
    EVENT_PASSWORDRESET,
    EVENT_EMAILCONFIRMATION,
    EVENT_UNSUCESSFULTRANSACTION
};

const account = require('../account');
const unsucessfulTransaction = require('../unsucessfulTransaction');
const config = require('../../config');
const logger = require('../logger');
const request = require('request-promise');


eventEmitter.on(EVENT_INVESTMENT, processInvestment);
eventEmitter.on(EVENT_USERREGISTRATION, processUserregistration);
eventEmitter.on(EVENT_EMAILCONFIRMATION, processEmailConfirmation);
eventEmitter.on(EVENT_PASSWORDRESET, processPasswordReset);
eventEmitter.on(EVENT_UNSUCESSFULTRANSACTION, processUnsucessfulTransaction);

function processInvestment(accountId, hash) {
    if (!accountId) throw new Error('Eventhandler: accountId not defined');
    if (!hash) throw new Error('Eventhandler: hash not defined');

    return account.getbyAccountId(accountId)
        .then(acc => {
            let options = {
                url: config.emailer.baseurl + 'confirmInvestment/' + acc.id + '/' + hash,
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

function processUserregistration(accountId) {
    if (!accountId) throw new Error('Eventhandler: accountId not defined');

    let options = {
        url: config.emailer.baseurl + 'confirmEmail/' + accountId,
        headers: {
            'Authorization': 'Bearer ' + config.emailer.authtoken
        }
    };
    return request(options)
        .catch(err => {
            logger.warn('there was an error in the investment event handler', err);
        });
}

function processEmailConfirmation(accountId) {
    if (!accountId) throw new Error('Eventhandler: accountId not defined');

    let options = {
        url: config.emailer.baseurl + 'referalEmail/' + accountId,
        headers: {
            'Authorization': 'Bearer ' + config.emailer.authtoken
        }
    };
    return request(options)
        .catch(err => {
            logger.warn('there was an error in the processEmailConfirmation event handler', err);
        });
}

function processPasswordReset(accountId, pw) {
    if (!accountId) throw new Error('Eventhandler: accountId not defined');
    if (!pw) throw new Error('Eventhandler: pw not defined');

    let options = {
        url: config.emailer.baseurl + 'passwordReset/' + accountId + '/' + pw,
        headers: {
            'Authorization': 'Bearer ' + config.emailer.authtoken
        }
    };

    return request(options)
        .catch(err => {
            logger.warn('there was an error in the processEmailConfirmation event handler', err);
        });
}

function processUnsucessfulTransaction(address, currency, tx, error) {
    return unsucessfulTransaction.save(address, currency, JSON.stringify(tx), error)
        .catch(err => {
            logger.warn('there was an error saving the unsucessful Transaction', err);
        });
}