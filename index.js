import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './api';
import config from './config';
import db from './models';
import auth from './middleware/auth';
import logger from './lib/logger';



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

export default app;