const AbstractService = require('../abstract/AbstractService');
const schema = require('./model');

class ConfigurationService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

	findOne = async () => {
		try {
			const options = await this.Collection.findOne({});
			const { permissions, status } = options;
			return { permissions, status };
		} catch (error) {
			throw error
		}
	}

}

module.exports = new ConfigurationService(schema, 'configurations');
