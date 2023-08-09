const testingService = require('../services/testingService');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const logger = require('../utils/logger');
const { response } = require('express');
const mqttService = require('../services/mqttService');

exports.testData = catchAsyncErrors(async (req, res, next) => {

    const data = await testingService.testData(req, res, next);

    res.status(200).json({
        success: true,
        results: data.length,
        message: 'Test deploy code successful',
        data: data
    });

});


exports.testDataPost = catchAsyncErrors(async (req, res, next) => {


    await mqttService.senddata(req, res, next);

    const data = await testingService.testDataPost(req, res, next);

    res.status(200).json({
        success: true,
        results: data.length,
        message: 'Test post data successful',
        data: data
    });

});


