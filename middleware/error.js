export default {
    unauthorized,
    missingParam,
    invalidParam
}

function unauthorized(res) {
    res.status(403).send('unauthorized');
}


function missingParam(res, param) {
    res.status(400).send('missing parameter: ' + param);
}

function invalidParam(res, param) {
    res.status(400).send('parameter not valid: ' + param);
}