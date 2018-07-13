const error = require('./error');
const account = require('../lib/account');
const config = require('../config');

module.exports = auth;

function auth(req, res, next) {
    if (req.headers.authorization) {
        let acessToken = req.headers.authorization.replace('Bearer ', '');

        if (true) {
            console.log(acessToken);
            account.authLocally(acessToken)
                .then(user => {
                    console.log(user);
                    req.userId = user.id;
                    req.userEmail = user.email;
                    return next();
                })
                .catch((err) => {
                    return error.unauthorized(res);
                });
        } else {
            req.userId = acessToken;
            req.userEmail = acessToken + '_123@nomail.com';
            return next();
        }
    } else {
        return next();
    }


}