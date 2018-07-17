const error = require('../middleware/error');
const config = require('../config');

module.exports = auth;

function auth(req, res, next) {
    console.log('hellooooo');
    if (req.headers.authorization) {
        let id = req.headers.authorization.replace('Bearer ', '');
        console.log('next!', req.systemId, config.emailer.authtoken);
        console.log(id);
        req.systemId = id;
    }
    console.log('next!', req.systemId, config.emailer.authtoken);
    if (req.systemId !== config.emailer.authtoken) return error.unauthorized(res);
    console.log('next!', req.systemId, config.emailer.authtoken);
    next();
}