const Joi = require("joi");
const { uuidRule, emailRule } = require("./commonValidators");

// CREATE USER
exports.createUserValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .required()
    .messages({
      "string.pattern.base": "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
    }),
}).options({ allowUnknown: false });

// REGISTER
exports.registerValidation = Joi.object({
  userId: uuidRule.messages({ "any.required": "User ID is required" }),
  firstName: Joi.string().required().messages({ "string.empty": "First name is required" }),
  lastName: Joi.string().required().messages({ "string.empty": "Last name is required" }),
  languageId: uuidRule.messages({ "any.required": "Language ID is required" }),
  addressId: uuidRule.messages({ "any.required": "Address ID is required" }),
}).options({ allowUnknown: false });

// UPDATE USER
exports.updateUserValidation = Joi.object({
  id: uuidRule.messages({ "any.required": "User ID is required" }),
  firstName: Joi.string(),
  lastName: Joi.string(),
  languageId: uuidRule,
  email: emailRule,
  mobile: Joi.string().min(10).max(12),
}).options({ allowUnknown: false });

// UPDATE CUSTOMER
exports.updateCustomerValidation = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  languageId: uuidRule,
  email: Joi.string().email(),
  mobile: Joi.string().min(10).max(12),
  addressId: uuidRule,
}).options({ allowUnknown: false });
