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
    return price.getByTime(req.params.time)
        .then((price) => {
            return res.json(price);
        });
}