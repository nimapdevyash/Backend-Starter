const Joi = require('joi');

exports.addRoleValidation = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
});

exports.updateRoleValidation = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().trim(),
  description: Joi.string().trim(),
});
