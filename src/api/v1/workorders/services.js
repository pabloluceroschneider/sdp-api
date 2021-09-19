const AbstractService = require('../abstract/AbstractService');
const BasePlanService = require('../baseplans/services');
const ProductService = require('../products/services');
const TasksService = require('../tasks/services');
const CountersService = require('../counters/services');
const schema = require('./model');
const { LocalDate } = require('../../../util/LocalDate');

class WorkOrderService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

	find = async (query = {}) => {
		try {
			const items = await this.Collection.find(query, { sort: { batchNumber: -1 } });
			return items;
		} catch (error) {
			throw error;
		}
	};

	create = async ({ body }) => {
		try {
			const { tasks, productId, ...bodyRest } = body;
			const product = await ProductService.findOne({ id: productId });
			const { batchNumber } = await CountersService.findOneAndUpdate({ field: 'batchNumber' });
			const itemToInsert = {
				product: { ...product, _id: `${product._id}` },
				batchNumber,
				...bodyRest,
				deliveryDate: bodyRest.deliveryDate ? LocalDate(bodyRest.deliveryDate) : null
			};
			const validate = await this.Schema.validateAsync(itemToInsert);
			const createdWorkOrder = await this.Collection.insert(validate);
			const promiseTasks = tasks.map((t) =>
				TasksService.create({
					body: {
						workorderId: `${createdWorkOrder._id}`,
						...t
					}
				})
			);
			const createdTasks = await Promise.all(promiseTasks);
			return { ...createdWorkOrder, tasks: createdTasks };
		} catch (error) {
			throw error;
		}
	};

	onFinishedWorkOrder = async ({ id, values, element }) => {
		if (values.status !== 'FINISHED') return null;
		const [baseplan] = await BasePlanService.find({ name: element.basePlan })
		
		const { tasks } = baseplan;
		const promises = tasks.map(async task => {
			const set = await TasksService.find({ name: task.name, status: 'FINISHED' }, { sort: { duration: 1 },  limit: 10 });
			if (!set.length) return task;
			const estimate = set.reduce((acc, item) => acc + item.duration, 0) / set.length;
			task.estimate = estimate.toFixed(2);
			return task;
		})
		const newTasks = await Promise.all(promises);
		return await BasePlanService.update({ id: baseplan._id, values: { tasks: newTasks } });
	};

	update = async ({ id, values }) => {
		try {
			const element = await this.Collection.findOne({ _id: id });
			if (!element) return;
			this.onFinishedWorkOrder({ id, values, element });

			const mappingElement = Object.entries({ ...element, ...values }).reduce(
				(acc, [ key, value ]) => ({
					...acc,
					[key]: values[key] || value
				}),
				{}
			);
			const { _id, ...restElement } = mappingElement;
			const value = await this.Schema.validateAsync(restElement);
			await this.Collection.update({ _id: id }, { $set: value });
			return { _id, ...value };
		} catch (error) {
			throw error;
		}
	};

	remove = async ({ id }) => {
		try {
			const deletedCount = await this.Collection.remove({ _id: id });
			const tasksToRemove = await TasksService.find({ workorderId: id });
			tasksToRemove.map((task) => TasksService.remove({ id: task._id }));
			return deletedCount;
		} catch (error) {
			throw error;
		}
	};
}

module.exports = new WorkOrderService(schema, 'workorders');
