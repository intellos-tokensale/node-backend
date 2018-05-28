import config from '../../config';

const bunyan = require('bunyan');

const appName = config.general.appName;
let logger = bunyan.createLogger({ name: appName });

if (config.env === 'production') {
    const LoggingBunyan = require('@google-cloud/logging-bunyan').LoggingBunyan;
    const loggingBunyan = new LoggingBunyan();

    logger = bunyan.createLogger({
        name: appName,
        streams: [
            { stream: process.stdout, level: 'info' },
            loggingBunyan.stream('info'),
        ],
    });
}

export default logger;