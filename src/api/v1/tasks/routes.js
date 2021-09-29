const express = require('express');
const { create, record, findTasks, findOne, findByAttribute, setPriority, updateTask, remove, upsert, } = require('./controller');
const router = express.Router();

router.get('/', findTasks);
router.post('/', create);
router.get('/record/:name', record);
router.get('/:id', findOne);
router.get('/:attribute/:value', findByAttribute);
router.put('/priority', setPriority);
router.put('/bulk/upsert/:id', upsert);
router.put('/:id', updateTask);
router.delete('/:id', remove);

module.exports = router;
