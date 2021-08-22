const AbstractService = require('../abstract/AbstractService');
const schema = require('./model');
const WorkOrdersService = require('../workorders/services');

class TasksService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

	findByWorkOrderAndUsername = async ({ workorder, username }) => {
		try {
			const [ w ] = await WorkOrdersService.find({ _id: workorder });
			const tasks = await this.Collection.find({
				workorderId: workorder,
				assignedTo: username
			})
			return { workorder: w, tasks }
		} catch (error) {
			throw error
		}
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
				const tasks = { workorderId: id, ...value };
				return this.Collection.update({ _id }, { $set: tasks}, { upsert: true })
			})
			return Promise.all(promises)
			
		} catch (error) {
			throw error
		}		
	}

}

module.exports = new TasksService(schema, 'tasks');
