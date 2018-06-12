module.exports = auth;

function auth(req, res, next) {
    if (req.headers.authorization) {
        let id = req.headers.authorization.replace('Bearer ', '');
        req.userId = id;
        req.userEmail = id + 'nomail@nomail_.ch';
    }
    next();
}