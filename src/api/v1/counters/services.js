const AbstractService = require('../abstract/AbstractService')
const schema = require('./model');

class CountersService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

  findOneAndUpdate = ({ field }) => {
    return this.Collection.findOneAndUpdate(
      {},
      { $inc: { [field]: 1 } },
      { upsert: true }
    )
  }

}

module.exports = new CountersService(schema, 'counters');
