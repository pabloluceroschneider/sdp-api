const Joi = require('@hapi/joi');

const schema = Joi.object({
	workorderId: Joi.string().trim().required(),
	name: Joi.string().trim().required(),
	quantity: Joi.number(),
	done: Joi.number(),
	assignedTo: Joi.string().trim(),
	status: Joi.string().default('NOT_STARTED'),
	observation: Joi.string().trim(),
	startDate: Joi.string().trim(),
	lastUpdateDate: Joi.string().trim(),
	priority: Joi.number(),
	operatorNotes: Joi.string().allow(null).allow("")
});

module.exports = schema;