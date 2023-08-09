const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const options = rateLimit.options = {
    windowMs: 10 * 60 * 1000, //10 Mints
    max: process.env.RATE_LIMIT,

    // Send custom rate limit header with limit and remaining
    headers: true,
    keyGenerator: function (req /*, res*/) {
        return req.ip;
    },

    onLimitReached: function (req, res, options) {
        // Log warning message to database
        logger.warn(this.message.error, {
            metadata: {
                status: this.statusCode,
                message: this.message
            }
        });
    },
    skip: function (req, res, options) {
        // trusted IPs
        if (req.ip === '::1' || req.ip === '127.0.0.1') return true 
        else return false
    },

    message: {
        success: false,
        error: 'Too many requests, please try again later.'
    }
}

const rateLimiter = rateLimit(options);

module.exports = rateLimiter;