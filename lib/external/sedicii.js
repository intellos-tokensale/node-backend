const request = require('request-promise');
const config = require('../../config');
const account = require('../account');

module.exports = {
    auth,
    getAuthToken
}

function auth(accessToken) {
    const options = {
        url: config.sedicii.baseurl + '/oauth/check_token?token=accessToken',
    };
    return request(options)
        .then(o => {
            return o;
        });

}

function getAuthToken(authorizationCode, referedByCode) {
    console.log(referedByCode);
    const auth = "Basic " + new Buffer(config.sedicii.client_id + ":" + config.sedicii.client_secret).toString("base64");
    const options = {
        method: 'POST',
        url: config.sedicii.baseurl + '/api/oauth/token' +
            '?grant_type=authorization_code' +
            '&code=' + authorizationCode +
            '&redirect_uri=' + config.sedicii.redirect_uri,
        headers: {
            "Authorization": auth
        }
    };
    console.log(options);
    return request(options)
        .then(o => {
            o = JSON.parse(o);
            console.log(o);
            console.log(referedByCode);
            account.getFlat(o.info.id, o.info.email, referedByCode)
                .then(acc => {
                    account.saveToken(acc.id, o.access_token);
                });
            const res = {
                authToken: o.access_token
            };
            return res;
        });


}