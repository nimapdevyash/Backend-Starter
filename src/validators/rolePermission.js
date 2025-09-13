const Joi = require('joi');

exports.addRolePermissionValidation = Joi.object({
  roleId: Joi.number().required(),
  permissionId: Joi.number().required(),
});

exports.updateRolePermissionValidation = Joi.object({
  id: Joi.number().required(),
  roleId: Joi.number(),
  permissionId: Joi.number(),
});

exports.bulkUpdateRolePermissionsValidation = Joi.object({
  roleId: Joi.number().required(),
  permissionIds: Joi.array().items(Joi.number().required()).min(1).required(),
});