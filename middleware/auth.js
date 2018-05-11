export default auth;

function auth(req, res, next) {
    if (req.headers.authorization) {
        var id = req.headers.authorization.replace('Bearer ', '');
        req.userId = id;
    }
    next();
}