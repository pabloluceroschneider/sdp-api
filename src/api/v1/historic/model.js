const Joi = require('@hapi/joi');

const schema = Joi.object({
	refId: Joi.string().trim().required(),
	collection: Joi.string().trim().required(),
	values: Joi.any(),
	duration: Joi.number(),
});

module.exports = schema;