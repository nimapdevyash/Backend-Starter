const Joi = require("joi");
const { uuidRule } = require("./commonValidators");

exports.addPermissionValidation = Joi.object({
  actionName: Joi.string().trim().required().messages({ "string.empty": "Action name is required" }),
  description: Joi.string().trim().required().messages({ "string.empty": "Description is required" }),
  method: Joi.string().trim().required().messages({ "string.empty": "Method is required" }),
  baseUrl: Joi.string().trim().required().messages({ "string.empty": "Base URL is required" }),
  path: Joi.string().trim().required().messages({ "string.empty": "Path is required" }),
}).options({ allowUnknown: false });

exports.updatePermissionValidation = Joi.object({
  id: uuidRule,
  actionName: Joi.string().trim(),
  description: Joi.string().trim(),
  method: Joi.string().trim(),
  baseUrl: Joi.string().trim(),
  path: Joi.string().trim(),
}).options({ allowUnknown: false });
