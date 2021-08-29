const Joi = require('@hapi/joi');

const schema = Joi.object({
	name: Joi.string().trim().required(),
	productId: Joi.string().trim().required(),
	tasks: Joi.array().items(
		Joi.object({
			name: Joi.string().trim().required(),
			observation: Joi.string().allow(null).allow(""),
		})
	),
});

module.exports = schema;