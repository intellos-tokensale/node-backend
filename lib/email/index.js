module.exports = {
    sendInvestConfirmation
}

const sender = require('./sender');
const account = require('../account');
const Queue = require('better-queue');

const q = new Queue(processEmailRequest, { concurrent: 3 });
let count = 0;

function sendInvestConfirmation(userId, hash) {
    if (!userId) throw new Error('Email Service: userId undefined');
    if (!hash) throw new Error('Email Service: hash undefined');

    q.push({ userId, hash });
}

function processEmailRequest(input, callback) {

    account.get(input.userId)
        .then(acc => {
            acc.transactions = acc.transactions.splice(1, 5);
            acc.hash = input.hash;
            return sender.send('../../emailTemplates/confirmInvest.html', acc, acc.email);
        })
        .then(() => {
            callback(null, {});
        })


}