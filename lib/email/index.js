module.exports = {
    sendInvestConfirmation,
    sendConfirmationEmail,
    sendReferalEmail,
    sendPasswordEmail,
}

const sender = require('./sender');
const account = require('../account');
const Queue = require('better-queue');

const emaiConfirmInvest = new Queue(processEmailConfirmInvestRequest, { concurrent: 3 });
const emailVerification = new Queue(processEmailVerificationRequest, { concurrent: 3 });
const emailReferal = new Queue(processEmailReferalRequest, { concurrent: 3 });
const emailPassword = new Queue(processEmailPasswordRequest, { concurrent: 3 });

function sendInvestConfirmation(id, hash) {
    if (!id) throw new Error('Email Service: id undefined');
    if (!hash) throw new Error('Email Service: hash undefined');

    emaiConfirmInvest.push({ id, hash });
}

function sendConfirmationEmail(id) {
    if (!id) throw new Error('Email Service: id undefined');
    emailVerification.push({ id });
}

function sendReferalEmail(id) {
    if (!id) throw new Error('Email Service: id undefined');
    console.log('we push');
    emailReferal.push({ id });
}

function sendPasswordEmail(id, pw) {
    if (!id) throw new Error('Email Service: id undefined');
    if (!pw) throw new Error('Email Service: pw undefined');
    emailPassword.push({ id, pw });
}

function processEmailConfirmInvestRequest(input, callback) {

    account.get(input.id)
        .then(acc => {
            acc.transactions = acc.transactions.splice(1, 5);
            acc.hash = input.hash;
            return sender.send('../../emailTemplates/confirmInvest.html', acc, acc.email);
        })
        .then(() => {
            callback(null, {});
        });
}

function processEmailVerificationRequest(input, callback) {

    account.get(input.id)
        .then(acc => {
            acc.transactions = [];
            return sender.send('../../emailTemplates/verification.html', acc, acc.email);
        })
        .then(() => {
            callback(null, {});
        });
}

function processEmailReferalRequest(input, callback) {
    console.log('we executies');
    account.get(input.id)
        .then(acc => {
            acc.transactions = [];
            console.log('we send it!');
            return sender.send('../../emailTemplates/referal.html', acc, acc.email);
        })
        .then(() => {
            callback(null, {});
        });
}

function processEmailPasswordRequest(input, callback) {

    account.get(input.id)
        .then(acc => {
            acc.transactions = [];
            acc.pw = input.pw;
            return sender.send('../../emailTemplates/password.html', acc, acc.email);
        })
        .then(() => {
            callback(null, {});
        });
}