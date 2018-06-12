module.exports = {
    getLast,
    getByTime
};

const price = require('../lib/price');
const error = require('../middleware/error');

function getLast(req, res) {
    return price.getLast()
        .then((price) => {
            return res.json(price);
        });
}


function getByTime(req, res) {
    if (!req.params.time) return error.missingParam(res, 'time');
    return price.getByTime(req.params.time)
        .then((price) => {
            return res.json(price);
        });
}