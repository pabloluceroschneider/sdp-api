const AbstractService = require('../abstract/AbstractService')
const Schema = require('./model');

class BasePlansService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}
  
  create = async ({ body }) => {
    try {
        const value = await this.Schema.validateAsync(body);

        const validate = await this.Collection.find({ 
          name: body.name, 
          productId: body.productId
        });
        if (validate.length) {
          throw Error(`El plano ${body.name} ya existe.`)
        }
        
        const inserted = await this.Collection.insert(value);
        
        return inserted
    } catch (error) {
        throw error
    }
};

}

module.exports = new BasePlansService(Schema, 'baseplans');
