const AbstractService = require('../abstract/AbstractService');
const schema = require('./model');

const differenceInMinutes = require('date-fns/differenceInMinutes');
const { LocalDate } = require('../../../util/LocalDate');


class HistoryService extends AbstractService {
	constructor(model, collection) {
		super(model, collection);
	}
	findByTask = async ({ id }) => {
		try {
			const items = await this.find({ refId: id, duration: { $gt: 0 } });
			return items.reverse();
		} catch (error) {
			throw error;
		}
	};

	bulkTasks = async ({ body }) => {
		try {
			const itemsArray = Object.entries(body);
			const results = itemsArray.map( async ([id, values]) => {
				return values.map( async body => {
					return await this.addHistorialRegister({ id, body });
				})
			})
			return { bulked : results.length }
		} catch (error) {
			throw error;
		}
	};

	addHistorialRegister = async ({ id, body }) => {
		const { timeStart, timeEnd, ...values } = body;
		const duration = differenceInMinutes(
      new Date(LocalDate(timeEnd)),
      new Date(LocalDate(timeStart)),
    );
		const add_historial = {
			refId: id,
			collection: 'tasks',
			values,
			timeStart,
			duration,
		};
		return await this.create({ body : add_historial});
	}
}

module.exports = new HistoryService(schema, 'history');
