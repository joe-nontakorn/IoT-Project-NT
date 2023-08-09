const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDatabase = () => {
    mongoose.connect(process.env.DATABASE_URI, {
        autoIndex: true,
    }).then(con => {
        logger.info(`MongoDB Database connected with host: ${con.connection.host}`);
    });
};


module.exports = connectDatabase;