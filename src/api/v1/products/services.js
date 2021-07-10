const AbstractService = require('../abstract/AbstractService')
const schema = require('./model');

module.exports = new AbstractService(schema, 'products');
