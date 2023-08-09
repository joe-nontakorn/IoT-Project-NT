const express = require('express');
const router = express.Router();


const {
    testData,
    testDataPost,
} = require('../controllers/testingController');


router.route('/testing').get(testData);
router.route('/testing').post(testDataPost);

module.exports = router;