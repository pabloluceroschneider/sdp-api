const monk = require('monk');
const db = monk(process.env.MONGO_URI);
const differenceInMinutes = require('date-fns/differenceInMinutes');
const AbstractService = require('../abstract/AbstractService');
const Schema = require('./model');
const HistoryService = require('../historic/services');
const { LocalDate } = require('../../../util/LocalDate');
const { calculateTaskDuration } = require('./utils');

class TasksService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

	setPriority = async ({ tasks }) => {
		try {
			const promises = tasks.map(({ id, priority }) =>
				this.Collection.update({ _id: id }, { $set: { priority } })
			);
			return Promise.all(promises);
		} catch (error) {
			throw error;
		}
	};

	record = async ({ name }) => {
		try {
			const set = await this.find({ name, status: 'FINISHED', duration: { $gt: 0 } }, { sort: { duration: 1 },  limit: 10 });
			return set;
		} catch (error) {
			throw error;
		}
	};

	stampDurationInPlanBase = async ({id, body, element}) => {
		//
		const workoderCollection = db.get('workorders');
		const workorder = await workoderCollection.findOne({ _id: element.workorderId });
		//
		const basePlanCollection = db.get('baseplans');
		const basePlan = await basePlanCollection.findOne({ name: workorder.basePlan });
		//
		const tasks = basePlan.tasks;
		const set = await this.find({ name: element.name, status: 'FINISHED' }, { sort: { duration: 1 },  limit: 10 });
		let calculated = set.reduce((acc, item) => acc + item.duration, 0) / set.length;
		calculated = calculated.toFixed(2);
		tasks.forEach( task => {
			if (task.name === element.name){
				task.calculated = calculated;
			}
		})
		//
		await basePlanCollection.update({ _id: basePlan._id }, { $set: { tasks: tasks } });
	}

	calculateTimestamps = async ({ id, body, element }) => {
		if (body.status !== 'FINISHED') return null;
		const set = await HistoryService.find({ refId: id, 'values.name': body.name });
		const duration = await calculateTaskDuration({ set });
		const updatedTask = await this.update({
			id,
			values: { duration, priority: null }
		});
		await this.stampDurationInPlanBase({id, body, element});
		return updatedTask;
	};

	addHistorialRegister = async ({ id, body }) => {
		const { timeStart, timeEnd, ...values } = body;
		if (!timeStart) return;
		const duration = differenceInMinutes(new Date(LocalDate(timeEnd)), new Date(LocalDate(timeStart)));
		const add_historial = {
			refId: id,
			collection: 'tasks',
			values,
			timeStart,
			duration: (duration / (body.done || 1)).toFixed(2),
		};
		return await HistoryService.create({ body: add_historial });
	};

	validateDoneQuantity = ({ body, element, accumulateDone }) => {
		let newDone = body.done;
		if (accumulateDone) {
			newDone += Number(element.done)
		}
		if (newDone > element.quantity){
			return true;
		}
		return false;
	}

	updateTask = async ({ id, body, offline, accumulateDone }) => {
		try {

			const element = await this.Collection.findOne({ _id: id });
			if (this.validateDoneQuantity({ body, element, accumulateDone })){
				throw Error(`Se superó la cantidad de tareas`);
			}

			let newElement = {
				...element,
				...body,
			}

			if (accumulateDone && body.done > 0) {
				newElement.done += Number(element.done)
			}

			const { _id, timeStart, timeEnd, ...restElement } = newElement;
			const value = await this.Schema.validateAsync(restElement);
			await this.Collection.update({ _id: id }, { $set: value });

			const online = Boolean(!offline);
			if (online) {
				await this.addHistorialRegister({ id, body, element });
				await this.calculateTimestamps({ id, body, element });
			}

			return { _id, ...value };
		} catch (error) {
			console.log(`error`, error)
			throw error;
		}
	};

	mapUpdateTasks = ({ id, tasks }) => {
		return tasks.map(({ _id, tableData, newTaskOrder, ...value }) => {
			if (_id) {
				const tasks = { workorderId: id, ...value };
				return this.Collection.update({ _id }, { $set: tasks }, { upsert: true, multi: true });
			}
			const tasks = { workorderId: id, ...value };
			return this.Collection.insert(tasks);
		});
	};

	upsert = async ({ id, tasks }) => {
		try {
			const promises = this.mapUpdateTasks({ id, tasks });

			return Promise.all(promises);
		} catch (error) {
			throw error;
		}
	};

	remove = async ({ id }) => {
		try {
			// TODO: Eliminar registro de historiales al eliminar la tarea...
			// const historyToRemove = await HistoryService.findByTask({ id });
			// historyToRemove.map( async (h) => await HistoryService.remove({ id: h._id }));
			const deletedTask = await this.Collection.remove({ _id: id });
			return deletedTask;
		} catch (error) {
			throw error;
		}
	};
}

module.exports = new TasksService(Schema, 'tasks');
