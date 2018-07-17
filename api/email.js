module.exports = {
    confirmInvestment,
    confirmEmail,
    referalEmail,
    newPwEmail,
};
const email = require('../lib/email');
const error = require('../middleware/error');



function confirmInvestment(req, res) {
    if (!req.params.id) return error.missingParam(res, 'user');
    if (!req.params.hash) return error.missingParam(res, 'transaction hash');
    res.json({});
    return email.sendInvestConfirmation(req.params.id, req.params.hash);
}

function confirmEmail(req, res) {
    if (!req.params.id) return error.missingParam(res, 'id');
    res.json({});
    return email.sendConfirmationEmail(req.params.id);
}

function referalEmail(req, res) {
    if (!req.params.id) return error.missingParam(res, 'id');
    res.json({});
    return email.sendReferalEmail(req.params.id);
}

function newPwEmail(req, res) {
    if (!req.params.id) return error.missingParam(res, 'id');
    if (!req.params.pw) return error.missingParam(res, 'pw');
    res.json({});
    return email.sendPasswordEmail(req.params.id, req.params.pw);
}