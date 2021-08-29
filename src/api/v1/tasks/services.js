const AbstractService = require('../abstract/AbstractService');
const schema = require('./model');

class TasksService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

	setPriority = async ({ tasks }) => {
		try {
			const promises = tasks.map( ({ id, priority }) => 
				this.Collection.update({ _id: id }, { $set : { priority } })
			)
			return Promise.all(promises)
			
		} catch (error) {
			throw error
		}
	}

	upsert = async ({ id, tasks }) => {
		try {
			const promises = tasks.map( ({ 
				_id,
				tableData,
				newTaskOrder,
				...value
			}) => {
				if (_id){
					const tasks = { workorderId: id, ...value };
					return this.Collection.update({ _id }, { $set: tasks}, { upsert: true, multi: true })
				}
				const tasks = { workorderId: id, ...value };
					return this.Collection.insert(tasks)
			})
			return Promise.all(promises)

		} catch (error) {
			throw error
		}		
	}

}

module.exports = new TasksService(schema, 'tasks');
