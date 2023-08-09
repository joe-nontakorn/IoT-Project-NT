const ErrorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');
const casual = require('casual');

exports.testData = (async (req, res, next) => {

    // Get data from Database or MQTT

    let message = {
        code: casual.unix_time,
        name: casual.sentence
    }

    return message;
});

exports.testDataPost = (async (req, res, next) => {

    logger.info(req.body);
    // Submit data to MQTT
    
    return req.body;
});

