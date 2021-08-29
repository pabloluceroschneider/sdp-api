const express = require('express');
const { create, find, findOne, findByAttribute, setPriority, update, remove, upsert, } = require('./controller');
const router = express.Router();

router.get('/', find);
router.get('/assignedTo/:username', findByUsername);
router.get('/:id', findOne);
router.get('/:attribute/:value', findByAttribute);

router.post('/', create);

router.put('/priority', setPriority);
router.put('/bulk/upsert/:id', upsert);
router.put('/:id', update);

router.delete('/:id', remove);

module.exports = router;
