import email from '../lib/email';

export default {
    confirmInvestment,
};

function confirmInvestment(req, res) {
    if (!req.params.userId) throw 'user not defined';
    if (!req.params.hash) throw 'tranasaction not defined';
    res.json({});
    email.sendInvestConfirmation(req.params.userId, req.params.hash);
}