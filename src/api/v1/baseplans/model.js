const Joi = require('@hapi/joi');

const schema = Joi.object({
	name: Joi.string().trim().required(),
	productId: Joi.string().trim().required(),
	tasks: Joi.array().items(
		Joi.object({
			name: Joi.string().trim().required(),
			observation: Joi.string().trim().allow(null).allow(""),
			estimate: Joi.number().allow(null).allow(""),
			calculated: Joi.number().allow(null),
		})
	),
});

module.exports = schema;