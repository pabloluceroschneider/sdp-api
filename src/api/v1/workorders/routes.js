const express = require('express');
const { create, find, findOne, findByAttribute, update, remove } = require('./controller');
const router = express.Router();

router.get('/', find);
router.post('/', create);
router.get('/:id', findOne);
router.get('/:attribute/:value', findByAttribute);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
