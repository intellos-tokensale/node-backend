const db = require('./models');

const schedule = require('node-schedule');
const price = require('./lib/price');


price.priceNowByExchange();

schedule.scheduleJob('0 */1 * * * *', () => {
    price.priceNowByExchange();
});