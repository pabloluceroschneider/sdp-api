const AbstractService = require('../abstract/AbstractService');
const ProductService = require('../products/services');
const TasksService = require('../tasks/services');
const CountersService = require('../counters/services');
const schema = require('./model');

class WorkOrderService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

	create = async ({ body }) => {
		try {
			const { tasks, productId, ...bodyRest } = body;
			const product = await ProductService.findOne({ id: productId });
			const { batchNumber } = await CountersService.findOneAndUpdate({ field: 'batchNumber' });
			const itemToInsert = {
				product: { ...product, _id: `${product._id}` },
				batchNumber,
				...bodyRest,
			}
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
