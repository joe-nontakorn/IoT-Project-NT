const ErrorHandler = require('../utils/errorHandler');
const getDataService = require('../services/getdataService');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const logger = require('../utils/logger');
const { response } = require('express');

exports.getData = catchAsyncErrors(async (req, res, next) => {

    let data = await getDataService.getData(req, res, next);

    res.status(200).json({
        success: true,
        results: data.length,
        message: 'Get data successful',
        data: data
    });

});


exports.testDataPost = catchAsyncErrors(async (req, res, next) => {

    const data = await testingService.testDataPost(req, res, next);

    res.status(200).json({
        success: true,
        results: data.length,
        message: 'Test post data successful',
        data: data
    });

});


