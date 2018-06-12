const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const api = require('./api');
const config = require('./config');
const db = require('./models');
const auth = require('./middleware/auth');
const logger = require('./lib/logger');



const app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
    exposedHeaders: config.server.corsHeaders
}));

app.use(bodyParser.json({
    limit: config.server.bodyLimit
}));

app.use(auth);

// api router
app.use('/api', api());

app.server.listen(config.server.port, () => {
    logger.info(`Started on port ${app.server.address().port}`);
});

module.exports = app;