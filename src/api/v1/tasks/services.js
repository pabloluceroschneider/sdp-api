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
			const set = await this.find({ name, status: 'FINISHED' }, { sort: { duration: 1 },  limit: 10 });
			return set;
		} catch (error) {
			throw error;
		}
	};

	calculateTimestamps = async ({ id, body }) => {
		if (body.status !== 'FINISHED') return null;
		const set = await HistoryService.find({ refId: id, 'values.name': body.name });
		const duration = await calculateTaskDuration({ set });
		const updatedTask = await this.update({
			id,
			values: { duration, priority: null }
		});
		return updatedTask;
	};

	addHistorialRegister = async ({ id, body }) => {
		const { timeStart, timeEnd, ...values } = body;
		const duration = differenceInMinutes(new Date(LocalDate(timeEnd)), new Date(LocalDate(timeStart)));
		const add_historial = {
			refId: id,
			collection: 'tasks',
			values,
			timeStart,
			duration: duration / (body.done || 1),
		};
		return await HistoryService.create({ body: add_historial });
	};

	validateDoneQuantity = ({ body, element, accumulateDone }) => {
		const newDone = body.done;
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

			const newElement = {
				...element,
				...body,
			}

			if (accumulateDone) {
				newElement.done += Number(element.done)
			}

			const { _id, timeStart, timeEnd, ...restElement } = newElement;
			const value = await this.Schema.validateAsync(restElement);
			await this.Collection.update({ _id: id }, { $set: value });

			const online = Boolean(!offline);
			if (online) {
				await this.addHistorialRegister({ id, body });
				await this.calculateTimestamps({ id, body });
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
