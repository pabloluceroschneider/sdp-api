const Joi = require('@hapi/joi');
const { LocalDate } = require('../../../util/LocalDate')

const schema = Joi.object({
	basePlan: Joi.string().trim().required(),
	product: Joi.object({
		_id: Joi.any(),
		name: Joi.string(),
		companyId: Joi.string(),
	}),
	quantity: Joi.number().required(),
	tasks: Joi.array().items(Joi.object()), 
	batchNumber: Joi.number(),
	status: Joi.string().trim().default('NOT_STARTED'),
	observation: Joi.string().trim(),
	assignedTo: Joi.string().trim(),
	purchaseOrder: Joi.string().trim(),
	creationDate: Joi.date().default(LocalDate()),
	deliveryDate: Joi.date().allow(null),
});

module.exports = schema;