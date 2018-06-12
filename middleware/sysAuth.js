const error = require('../middleware/error');
const config = require('../config');

module.exports = auth;

function auth(req, res, next) {
    if (req.headers.authorization) {
        let id = req.headers.authorization.replace('Bearer ', '');
        req.systemId = id;
    }
    if (req.systemId !== config.emailer.authtoken) return error.unauthorized(res);
    next();
}