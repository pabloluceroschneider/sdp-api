const Joi = require('@hapi/joi');

const schema = Joi.object({
	name: Joi.string().trim().required(),
	companyId: Joi.string().trim().required(),
});

module.exports = schema;