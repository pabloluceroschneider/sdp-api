const AbstractService = require('../abstract/AbstractService');
const schema = require('./model');

class HistoryService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}
	findByTask = async ({ id }) => {
		try {
			const items = await this.find({ refId: id });
			return items.reverse();
		} catch (error) {
			throw error;
		}
	};
}

module.exports = new HistoryService(schema, 'history');
