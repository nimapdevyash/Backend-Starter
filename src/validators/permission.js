const Joi = require('joi');

exports.addPermissionValidation = Joi.object({
  actionName: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  method: Joi.string().trim().required(),
  baseUrl: Joi.string().trim().required(),
  path: Joi.string().trim().required(),
});

exports.updatePermissionValidation = Joi.object({
  id: Joi.number().required(),
  actionName: Joi.string().trim(),
  description: Joi.string().trim(),
  method: Joi.string().trim(),
  baseUrl: Joi.string().trim(),
  path: Joi.string().trim(),
});
