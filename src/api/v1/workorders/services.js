const AbstractService = require('../abstract/AbstractService');
const schema = require('./model');

// services
const CompaniesService = require('../companies/services');
const ProductService = require('../products/services');
const TasksService = require('../tasks/services');
const CountersService = require('../counters/services');
// utils
const LocalDate = require('../../../util/LocalDate');


/**
 * 
 * WorkOrderService
 * 
 */
class WorkOrderService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

	findTasks = async ({ id }) => {
		try {
			const workorderTasks = await TasksService.find({ workorderId: id });
			return workorderTasks
		} catch (error) {
			throw error
		}
	}

	findByAssignedTo = async ({ assignedTo }) => {
		try {
			const workorderTasks = await this.Collection.find({ assignedTo });

			const companies = await CompaniesService.find();
			const companiesmapping = companies.reduce( (acc, it) => ({ ...acc, [it._id] : it.name }),{});

			return workorderTasks.map( workorder => {
				return {
					_id: workorder._id,
					batchNumber: workorder.batchNumber,
					company: {
						_id: workorder.product.companyId,
						name: companiesmapping[workorder.product.companyId]
					},
					product: {
						_id: workorder.product._id,
						name: workorder.product.name,
					},
					basePlan: workorder.basePlan,
					status: workorder.status,
					deliveryDate: workorder.deliveryDate,
				}
			})
		} catch (error) {
			throw error
		}
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
			// if (itemToInsert.deliveryDate){
			// 	itemToInsert.deliveryDate = new LocalDate(itemToInsert.deliveryDate).date
			// }
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
				if (restElement.deliveryDate){
					restElement.deliveryDate = new LocalDate(restElement.deliveryDate).date
				}
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
			const tasksToRemove = await TasksService.find({ workorderId: id });
			tasksToRemove.map((task) => TasksService.remove({ id: task._id }));
			return deletedCount;
		} catch (error) {
			throw error;
		}
	};

}

module.exports = new WorkOrderService(schema, 'workorders');
