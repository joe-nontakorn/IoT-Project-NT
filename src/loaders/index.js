const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const useragent = require('express-useragent');

// Setting up config.env file variables
// dotenv.config({ path: './src/config/config.env' });

const limiter = require('../utils/rateLimit');
const logger = require('../utils/logger');
const errorMiddleware = require('../middlewares/errors');
const appRoutes = require('../loaders/routes');
const ErrorHandler = require('../utils/errorHandler');

const MQTT = require('../services/mqttService');
const connectDatabase = require('../config/database');

exports.init = ({ app }) => {

    // Connect database
    connectDatabase();

    // Access log stream
    app.use(morgan('tiny', { stream: logger.stream }));

    // Setup body parser
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static('public'));

    // Setup security headers
    app.use(helmet());

    // Setup body parser
    app.use(express.json());

    // Set cookie parser
    app.use(cookieParser());

    // Prevent XSS attacks
    app.use(xssClean());

    // Express user agent
    app.use(useragent.express());

    // Prevent Parameter Pollution
    app.use(hpp({
        whitelist: ['positions']
    }));

    // Rate Limiting
    // app.use(limiter);

    // Setup CORS - Accessible by other domains
    app.use(cors());

    // Setup app routes
    appRoutes.routes({ app: app });

    // Handle unhandled routes
    app.all('*', (req, res, next) => {
        next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
    });

    // Middleware to handle errors
    app.use(errorMiddleware);

}
