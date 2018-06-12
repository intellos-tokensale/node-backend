const config = require('../../config');

const bunyan = require('bunyan');

const appName = config.general.appName;
let logger = bunyan.createLogger({ name: appName });

if (config.env === 'production') {
    try {
        const LoggingBunyan = require('@google-cloud/logging-bunyan').LoggingBunyan;
        const loggingBunyan = new LoggingBunyan();

        logger = bunyan.createLogger({
            name: appName,
            streams: [
                { stream: process.stdout, level: 'info' },
                loggingBunyan.stream('info'),
            ],
        });
    } catch (err) {
        logger.err('could not connect to google cloud', err);
    }
}

module.exports = logger;