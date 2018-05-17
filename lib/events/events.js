import transaction from '../transaction';
import account from '../account';
import unsucessfulTransaction from '../unsucessfulTransaction';
import config from '../../config.json';
import checker from '../util/checker';
var events = require('events');
var eventEmitter = new events.EventEmitter();
var request = require('request');
var ethereum_address = require('ethereum-address');
var bitcoin_address = require('bitcoin-address');

export default {
    eventEmitter,
    processInvestment,
    processUnsucessfulTransaction
};


eventEmitter.on('investment', processInvestment);
eventEmitter.on('unsucessfulTransaction', processUnsucessfulTransaction);


function processInvestment(accountId, hash) {
    if (!accountId) throw 'Eventhandler: accountId not defined';
    if (!hash) throw 'Eventhandler: hash not defined';

    return account.getbyAccountId(accountId)
        .then(acc => {
            var options = {
                url: config.email.baseUrl + 'confirmInvestment/' + acc.userId + '/' + hash,
                headers: {
                    'Authorization': 'Bearer ' + config.email.authToken
                }
            };
            return request(options);
        })
        .catch(err => {
            console.log('there was an error in the investment event handler', err);
        });
}

function processUnsucessfulTransaction(address, currency, tx, error) {
    return unsucessfulTransaction.save(address, currency, JSON.stringify(tx), error)
        .catch(err => {
            console.log('there was an error saving the unsucessful Transaction', err);
        });
}