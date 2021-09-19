const express = require('express');
const { findByTask } = require('./controller');
const router = express.Router();

router.get('/task/:taskId', findByTask);

module.exports = router;
