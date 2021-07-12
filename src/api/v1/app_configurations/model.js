const Joi = require('@hapi/joi');

const schema = Joi.object({
	permissions: Joi.string().trim(),
	status: Joi.string().trim(),
});

module.exports = schema;