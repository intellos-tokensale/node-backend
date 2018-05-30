import email from '../lib/email';
import error from '../middleware/error';

export default {
    confirmInvestment,
};

function confirmInvestment(req, res) {
    if (!req.params.userId) return error.missingParam(res, 'user');
    if (!req.params.hash) return error.missingParam(res, 'transaction hash');
    res.json({});
    return email.sendInvestConfirmation(req.params.userId, req.params.hash);
}