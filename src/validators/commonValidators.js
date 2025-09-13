const Joi = require("joi");

exports.idValidation = Joi.object({
  id: Joi.number().min(1).required()
}).options({allowUnknown: false});

exports.nameValidation = Joi.object({
  name: Joi.string().min(1).required()
}).options({allowUnknown: false});

exports.emailEnqueValidation = Joi.object({
  to: Joi.array().items(Joi.string().email()).min(1).max(10).required(),
  subject: Joi.string().required(),
  html: Joi.string().required(),
  filepath: Joi.string().optional().allow(null),
}).options({ allowUnknown: false });

exports.suspensionValidation = Joi.object({
  id: Joi.number().min(1).required(),
  suspensionReason: Joi.string().trim().min(5).required(),
}).options({allowUnknown: false});