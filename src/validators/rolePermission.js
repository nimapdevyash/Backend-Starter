const Joi = require("joi");
const { uuidRule } = require("./commonValidators");

exports.addRolePermissionValidation = Joi.object({
  roleId: uuidRule.messages({ "any.required": "Role ID is required" }),
  permissionId: uuidRule.messages({ "any.required": "Permission ID is required" }),
}).options({ allowUnknown: false });

exports.updateRolePermissionValidation = Joi.object({
  id: uuidRule.messages({ "any.required": "ID is required" }),
  roleId: uuidRule,
  permissionId: uuidRule,
}).options({ allowUnknown: false });

exports.bulkUpdateRolePermissionsValidation = Joi.object({
  roleId: uuidRule.messages({ "any.required": "Role ID is required" }),
  permissionIds: Joi.array()
    .items(uuidRule)
    .min(1)
    .required()
    .messages({
      "array.base": "Permission IDs must be an array",
      "array.min": "At least one permission ID is required",
    }),
}).options({ allowUnknown: false });
