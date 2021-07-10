const monk = require('monk');
const db = monk(process.env.MONGO_URI);

class AbstractService{
    constructor(model, collection){
        this.Schema = model;
        this.Collection = db.get(collection);
    }

    find = async (query = {}, options = {}) => {
        try {
            const items = await this.Collection.find(query, options);
            return items
        } catch (error) {
            throw error
        }
    };
    
    create = async ({ body }) => {
        try {
            const value = await this.Schema.validateAsync(body);
            const inserted = await this.Collection.insert(value);
            return inserted
        } catch (error) {
            throw error
        }
    };
    
    findOne = async ({ id }) => {
        try {
            const item = await this.Collection.findOne({ _id: id });
            return item;
        } catch (error) {
            throw error
        }
    };
    
    findByAttribute = async ({ attribute, value }) => {
        try {
            const item = await this.Collection.find({ [attribute]: value });
            if (!item.length) return;
            return item;
        } catch (error) {
            throw error
        }
    };
    
    update = async ({ id, values }) => {
        try {
            const element = await this.Collection.findOne({ _id: id });
            if (!element) return;
            const mappingElement = Object.entries({...element, ...values})
            .reduce( (acc, [key, value]) => ({
                ...acc,
                [key]: values[key] || value
            }),{})
            const { _id, ...restElement } = mappingElement;
            const value = await this.Schema.validateAsync(restElement);
            await this.Collection.update({ _id: id }, { $set: value });
            return { _id, ...value };
        } catch (error) {
            throw error
        }
    };
    
    remove = async ({ id }) => {
        try {
            const deletedCount = await this.Collection.remove({ _id: id });
            return deletedCount
        } catch (error) {
            throw error
        }
    };

}

module.exports = AbstractService;
