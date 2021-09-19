const express = require('express');
const { findByTask, bulk } = require('./controller');
const router = express.Router();

router.get('/task/:taskId', findByTask);
router.post('/task/bulk', bulk);

module.exports = router;
