const AbstractController = require('../abstract/AbstractController')
const ProductsService = require('./services')

module.exports = new AbstractController(ProductsService);