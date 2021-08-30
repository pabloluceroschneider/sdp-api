const AbstractService = require('../abstract/AbstractService')
const schema = require('./model');

class HistoryService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}
}

module.exports = new HistoryService(schema, 'history');
