import email from '../lib/email';

export default {
    confirmInvestment,
};

function confirmInvestment(req, res) {
    if (!req.params.userId) throw new Error('user not defined');
    if (!req.params.hash) throw new Error('tranasaction not defined');
    res.json({});
    return email.sendInvestConfirmation(req.params.userId, req.params.hash);
}