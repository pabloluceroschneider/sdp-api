const Joi = require('@hapi/joi');

const schema = Joi.object({
	batchNumber: Joi.number()
});

module.exports = schema;