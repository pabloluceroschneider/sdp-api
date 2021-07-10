const AbstractController = require('../abstract/AbstractController')
const BasePlansService = require('./services')

module.exports = new AbstractController(BasePlansService);