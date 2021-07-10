const Joi = require('@hapi/joi');

const schema = Joi.object({
	username: Joi.string().trim().required(),
  password: Joi.string().trim().required()
});

module.exports = schema;