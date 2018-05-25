import db from './models';

import schedule from 'node-schedule';
import price from './lib/price';


price.priceNowByExchange();

schedule.scheduleJob('*/15 */1 * * * *', () => {
    price.priceNowByExchange();
});