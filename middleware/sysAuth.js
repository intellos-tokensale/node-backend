export default auth;

function auth(req, res, next) {
    if (req.headers.authorization) {
        let id = req.headers.authorization.replace('Bearer ', '');
        req.systemId = id;
    }
    if (req.systemId !== 'w%4^Zt4K@6*7') throw new Error('unauthorized');
    next();
}