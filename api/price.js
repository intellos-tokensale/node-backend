import price from '../lib/price';

export default {
    getLast,
    getByTime
};

function getLast(req, res) {
    return price.getLast()
        .then((price) => {
            return res.json(price);
        });
}


function getByTime(req, res) {
    if (!req.params.time) throw new Error('time not defined');
    return price.getByTime(req.params.time)
        .then((price) => {
            return res.json(price);
        });
}