const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

require('winston-daily-rotate-file');

// const logDir = '/var/www/siphez/src/logs';
const logDir = 'src/logs';
const datePatternConfiguration = {
    default: 'YYYY-MM-DD',
    everHour: 'YYYY-MM-DD-HH',
    everMinute: 'YYYY-MM-DD-THH-mm',
};
const numberOfDaysToKeepLog = 10;
const fileSizeToRotate = 10; // in megabyte

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%.log`,
    datePattern: datePatternConfiguration.everHour,
    zippedArchive: true,
    maxSize: `${fileSizeToRotate}m`,
    maxFiles: `${numberOfDaysToKeepLog}d`
});


const consoleTransport = new transports.Console({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.colorize(),
        format.printf(info => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`),
    ),
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
});


const logger = createLogger({
    level: 'info',
    handleExceptions: true,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`),
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({ filename: `${logDir}/error.log`, level: 'error' }),
        // new transports.File({ filename: 'logs/combined.log' }),
        dailyRotateFileTransport,
    ]
});


// if (process.env.NODE_ENV == 'production') {
//     logger.add(dailyRotateFileTransport)
// }


if (process.env.NODE_ENV !== 'production') {
    logger.add(consoleTransport);
}

logger.stream = {
    write: (message) => {
        logger.info(message);
    },
};

module.exports = logger;