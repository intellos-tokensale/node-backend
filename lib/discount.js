var models = require('../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

export default {
    get,
};


function get(time) {
    time = Date.now();
    time = time * 1;
    var req = {
        where: {
            from: {
                [Op.lt]: time
            },
            to: {
                [Op.gt]: time
            }
        }
    };

    var def = {
        discount: 0,
        from: Date.now(),
        to: Date.now() + 60 * 60 * 24 * 356
    };

    return models.Discounts.findOne(req)
        .then((row) => {
            if (!row) return def;
            row = row.dataValues;
            return row;
        });
}