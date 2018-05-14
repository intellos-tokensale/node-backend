import _dt from './util/checker';
var models = require('../models');
var Sequelize = require('sequelize');

const Op = Sequelize.Op;

export default {
    get,
};


function get(time) {
    _dt.checkTime(time, 'get discount:');
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
    var discount;
    return models.Discounts.findOne(req)
        .then((data) => {
            if (!data) discount = def;
            else discount = data.dataValues;

            if (!discount.discount) {
                discount = def;
                time = Date.now();
            }
            postContract(discount);
            return discount;
        });

    function postContract(data) {

        if (!('discount' in data)) throw 'Discount: discount missing';
        if (data.discount < 0) throw 'Discount: discount must be bigger then 0';
        if (data.discount > 1) throw 'Discount: discount must be smaller then 1';
        _dt.checkFuture(data.to, time, 'Discount to: ');
        _dt.checkFuture(time, data.from, 'Discount from: ');
        _dt.checkTime(data.to, 'Discount: ');
    }
}

get(1400536106000);