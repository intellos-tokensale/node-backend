import db from './models';

import schedule from 'node-schedule';
import price from './lib/price';


price.priceNowByExchange();


var j = schedule.scheduleJob('*/15 */1 * * * *', function() {
    price.priceNowByExchange();
});