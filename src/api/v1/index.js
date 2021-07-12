const express = require('express');
const app_configurations = require('./app_configurations/routes')
const auth = require('./auth/routes')
const users = require('./users/routes')
const companies = require('./companies/routes')
const products = require('./products/routes')
const baseplans = require('./baseplans/routes')
const tasks = require('./tasks/routes')
const workorders = require('./workorders/routes')

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'v1'
  });
});

router.use('/configurations', app_configurations)
router.use('/auth', auth)
router.use('/users', users)
router.use('/companies', companies)
router.use('/products', products)
router.use('/baseplans', baseplans)
router.use('/tasks', tasks)
router.use('/workorders', workorders)
router.get('/permissions', (req, res) => {
  res.json([
    "Administrador",
    "Operario",
    "Lectura",
    "Escritura",
  ])
})


module.exports = router;
