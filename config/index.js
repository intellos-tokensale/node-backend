const bitcoinrpc = require('./bitcoinrpc.json');
const database = require('./database.json');
const emailer = require('./emailer.json');
const general = require('./general.json');
const server = require('./server.json');


let config;

const env = process.env.NODE_ENV || 'development';



config = {
    env: env,
    bitcoinrpc: bitcoinrpc[env],
    database: database[env],
    emailer: emailer[env],
    general: general[env],
    server: server[env]
}
Object.keys(config).forEach(base => {
    Object.keys(config[base]).forEach(v => {
        let env_key = (base + '_' + v).toUpperCase();
        if (process.env[env_key]) config[base][v] = process.env[env_key];
    });
});
if (env === 'development') console.log(config);
module.exports = config;