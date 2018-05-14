import sender from './sender';
import account from '../account';

export default {
    sendInvestConfirmation
}

function sendInvestConfirmation(userId, hash) {
    if (!userId) throw 'Email Service: userId undefined';
    if (!hash) throw 'Email Service: hash undefined';
    return account.get(userId)
        .then(acc => {
            acc.transactions = acc.transactions.splice(1, 5);
            acc.hash = hash;
            sender.send('../../emailTemplates/confirmInvest.html', acc, acc.email);
        });
}