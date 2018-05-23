import bitcoinRpc from './bitcoinRpc.json';
import database from './database.json';
import emailer from './emailer.json';
import general from './general.json';
import server from './server.json';

var config;

var env = process.env.NODE_ENV || 'development';

config = {
    bitcoinRpc: bitcoinRpc[env],
    database: database[env],
    emailer: emailer[env],
    general: general[env],
    server: server[env]
}

Object.keys(config).forEach(base => {
    Object.keys(config[base]).forEach(v => {
        var env_key = (base + '_' + v).toUpperCase();
        if (process.env[env_key]) config[base][v] = process.env[env_key];
    });
});
if (env === 'development') console.log(config);
export default config;