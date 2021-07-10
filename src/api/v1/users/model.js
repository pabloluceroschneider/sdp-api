const Joi = require('@hapi/joi');

const schema = Joi.object({
	fullname: Joi.string().trim(),
	username: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
  type: Joi.string().trim(),
	permissions: Joi.array().items(Joi.string()).default([])
});

module.exports = schema;