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

	calculateTimestamps = async ({ id, body }) => {
		if (body.status !== 'FINISHED') return null;
		const set = await HistoryService.find({ refId: id });
		const duration = await calculateTaskDuration({ set });
		const updatedTask = await this.update({
			id,
			values: { duration, priority: null }
		});
		return updatedTask;
	};

	addHistorialRegister = async ({ id, body }) => {
		const { timeStart, timeEnd, ...values } = body;
		const [ task ] = await this.find({ _id: id });
		const duration = differenceInMinutes(new Date(LocalDate(timeEnd)), new Date(LocalDate(timeStart)));
		const add_historial = {
			refId: id,
			collection: 'tasks',
			values,
			timeStart,
			duration: duration / task.quantity
		};
		return await HistoryService.create({ body: add_historial });
	};

	updateTask = async ({ id, body, offline }) => {
		try {
			const { timeStart, timeEnd, ...values } = body;
			const updatedTask = await this.update({ id, values });

			const online = Boolean(!offline);
			if (online) {
				await this.addHistorialRegister({ id, body });
				await this.calculateTimestamps({ id, body });
			}

			return updatedTask;
		} catch (error) {
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
