const AbstractService = require('../abstract/AbstractService')
const schema = require('./model');

class CompanyService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

  findcompanies = async () => {
    return await this.find({}, { sort: { name: 1 } });
  };
  
  create = async ({ body }) => {
    try {
        const value = await this.Schema.validateAsync(body);

        const validate = await this.Collection.find(body);
        if (validate.length) {
          throw Error(`La empresa ${body.name} ya existe.`)
        }
        
        const inserted = await this.Collection.insert(value);
        
        return inserted
    } catch (error) {
        throw error
    }
};

}

module.exports = new CompanyService(schema, 'companies');
