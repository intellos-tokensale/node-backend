import db from './models';

// import blochcaininfo from './lib/socket/blockchaininfo';
// import etherscan from './lib/socket/etherscan';
// import schedule from 'node-schedule';
import o from './lib/services/bitcoinRpcService';




// var j = schedule.scheduleJob('*/15 */1 * * * *', function() {
//     blochcaininfo.loadNewAddresses()
//         .then(() => {
//             return etherscan.loadNewAddresses();
//         });
//     // console.log('The answer to life, the universe, and everything!');
// });