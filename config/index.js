import bitcoinRpc from './bitcoinRpc.json';
import database from './database.json';
import emailer from './emailer.json';
import general from './general.json';
import server from './server.json';


let config;

const env = process.env.NODE_ENV || 'development';

config = {
    env: env,
    bitcoinRpc: bitcoinRpc[env],
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
export default config;