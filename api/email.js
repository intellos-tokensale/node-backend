module.exports = {
    confirmInvestment,
    confirmEmail
};
const email = require('../lib/email');
const error = require('../middleware/error');



function confirmInvestment(req, res) {
    if (!req.params.userId) return error.missingParam(res, 'user');
    if (!req.params.hash) return error.missingParam(res, 'transaction hash');
    res.json({});
    return email.sendInvestConfirmation(req.params.userId, req.params.hash);
}

function confirmEmail(req, res) {
    if (!req.params.id) return error.missingParam(res, 'user');
    res.json({});
    return email.sendConfirmationEmail(req.params.id);
}