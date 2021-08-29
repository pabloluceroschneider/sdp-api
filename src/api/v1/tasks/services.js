const AbstractService = require('../abstract/AbstractService');
const schema = require('./model');
const WorkOrdersService = require('../workorders/services');

class TasksService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

	findByUsername = async ({ username }) => {
		try {
			const workorders = await WorkOrdersService.findByAssignedTo({ assignedTo: username });
			const tasks = await this.Collection.find({
				assignedTo: username
			});

			const response = workorders.map( workorder => {
				const thisTasks = [];
				tasks.forEach( task => {
					if (workorder._id == task.workorderId) {
						thisTasks.push(task)
					} 
				})
				return {...workorder, tasks: thisTasks}
			})

			return response
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
