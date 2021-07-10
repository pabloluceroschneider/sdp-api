const AbstractController = require('../abstract/AbstractController')
const WorkordersService = require('./services')

module.exports = new AbstractController(WorkordersService);