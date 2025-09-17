const Joi = require("joi");
const { validation_types_enums } = require("../../utils/enums");

exports.createEmailTemplateValidation = {
  schema: Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    subject: Joi.string().trim().min(3).max(200).required(),
    html: Joi.string().min(1).required(), // Can be HTML or plain text
  }),
  type: validation_types_enums.body,
};

exports.updateEmailTemplateValidation = Joi.object({
  id: Joi.number().integer().positive().min(1).required(),
  html: Joi.string().min(1).required(),
  name: Joi.string().max(50).required(),
}).options({allowUnknown: false});