import transaction from './transaction';
import account from './account';
import config from '../config.json';
var events = require('events');
var eventEmitter = new events.EventEmitter();
var request = require('request');


export default eventEmitter;

eventEmitter.on('accountFetched', (account) => {
    transaction.updateForBTCAddress(account.btcAddress, account.id)
        .catch(err => {
            console.log('error fetching BTC Transactions', err);
        })
        .then(() => {
            return transaction.updateForETHAddress(account.ethAddress, account.id)
        })
        .catch(err => {
            console.log('error fetching ETH Transactions', err);
        })
        .then(() => {
            console.log('update done');
        });

});




eventEmitter.on('investment', (accountId, hash) => {
    console.log("---->investment event gotten!");
    account.getbyAccountId(accountId).then(acc => {
            var options = {
                url: config.email.baseUrl + 'confirmInvestment/' + acc.userId + '/' + hash,
                headers: {
                    'Authorization': 'Bearer ' + config.email.authToken
                }
            };
            request(options);
        })
        .catch(err => {
            console.log('there was an error in the investment event handler', err);
        })

});