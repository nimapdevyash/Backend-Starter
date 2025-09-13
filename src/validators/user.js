const Joi = require("joi");

exports.createUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .required()
    .messages({ "string.pattern.base": "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.", }),
}).options({ allowUnknown: false });


exports.registerValidation = Joi.object({
  userId: Joi.number().min(1).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  languageId: Joi.number().min(1).required(),
  addressId: Joi.number().required(),
}).options({ allowUnknown: false });


exports.updateUserValidation = Joi.object({
  id: Joi.number().min(1).required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  languageId: Joi.number().min(1),
  email: Joi.string().email(),
  mobile: Joi.string().min(10).max(12),
  addressId: Joi.number(),
}).options({ allowUnknown: false });

exports.updateCustomerValidation = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  languageId: Joi.number().min(1),
  email: Joi.string().email(),
  mobile: Joi.string().min(10).max(12),
  addressId: Joi.number(),
}).options({ allowUnknown: false });