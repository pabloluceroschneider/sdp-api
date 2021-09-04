const AbstractService = require('../abstract/AbstractService');
const schema = require('./model');

const ProductsService = require('../products/services');
const CompaniesService = require('../companies/services');
const TasksService = require('../tasks/services');
const WorkOrderService = require('../workorders/services');

class UsersService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}

	find = async () => {
		const users = await this.Collection.find({ type: { $ne: 'system' } });
		return users.map(({ _id, fullname, username, permissions }) => (
      { _id, fullname, username, permissions }
    ));
	};

	findTasks = async ({ username }) => {
		const tasks = await TasksService.find(
			{ 
				assignedTo: username,
				status: { $ne: 'FINISHED' },
			}, 
			{ 
				sort: { priority: 1 },
			})
		
		const products = await ProductsService.find();
		const productsmapping = products.reduce( (acc, it) => ({ ...acc, [it._id] : it.name }),{})

		const companies = await CompaniesService.find();
		const companiesmapping = companies.reduce( (acc, it) => ({ ...acc, [it._id] : it.name }),{})
		
		const workorders = await WorkOrderService.find();
		const mapping = workorders.reduce( (acc, it) => ({...acc, [it._id]: { 
			product: productsmapping[it.product._id],
			company: companiesmapping[it.product.companyId], 
			batchNumber: it.batchNumber
		 } }),{})

		const response = tasks.map( t => ({
			...t,
			...mapping[t.workorderId],
		}))
		return response
	}

}

module.exports = new UsersService(schema, 'users');
