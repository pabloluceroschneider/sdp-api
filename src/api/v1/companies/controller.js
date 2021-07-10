const AbstractController = require('../abstract/AbstractController')
const CompaniesService = require('./services')

module.exports = new AbstractController(CompaniesService);