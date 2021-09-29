const Joi = require('@hapi/joi');

const schema = Joi.object({
	workorderId: Joi.string().trim().required(),
	name: Joi.string().trim().required(),
	quantity: Joi.number(),
	done: Joi.number().allow(null),
	assignedTo: Joi.string().trim(),
	status: Joi.string().default('NOT_STARTED'),
	observation: Joi.string().trim().allow(null).allow(""),
	operatorNotes: Joi.string().trim().allow(null).allow(""),
	duration: Joi.number(),
	estimate: Joi.number().allow(null),
	updateDate: Joi.date(),
	priority: Joi.number().allow(null),
});

module.exports = schema;