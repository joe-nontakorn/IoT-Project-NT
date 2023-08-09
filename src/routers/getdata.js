const express = require('express');
const router = express.Router();


const {
    getData,
} = require('../controllers/getdataController');


router.route('/getdata').get(getData);

module.exports = router;