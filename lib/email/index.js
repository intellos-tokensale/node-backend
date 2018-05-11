import sender from './sender';
import account from '../account';

export default {
    sendInvestConfirmation
}

function sendInvestConfirmation(userId, hash) {
    return account.get(userId)
        .then(acc => {
            acc.transactions = acc.transactions.splice(1, 5);
            acc.hash = hash;
            sender.send('../../emailTemplates/confirmInvest.html', acc, acc.email);
        });
}