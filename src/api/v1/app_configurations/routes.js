const express = require('express');
const { findOne } = require('./controller');
const router = express.Router();

router.get('/options', findOne);

module.exports = router;
