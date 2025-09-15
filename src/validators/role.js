const Joi = require("joi");
const { uuidRule } = require("./commonValidators");

exports.addRoleValidation = Joi.object({
  name: Joi.string().trim().required().messages({ "string.empty": "Role name is required" }),
  description: Joi.string().trim().required().messages({ "string.empty": "Description is required" }),
}).options({ allowUnknown: false });

exports.updateRoleValidation = Joi.object({
  id: uuidRule,
  name: Joi.string().trim(),
  description: Joi.string().trim(),
}).options({ allowUnknown: false });
