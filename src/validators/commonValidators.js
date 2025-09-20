const Joi = require("joi");
const { CONSTANTS } = require("../../utils/constants");
// Reusable rules
const uuidRule = Joi.string()
  .guid({ version: "uuidv4" })
  .required()
  .messages({ "string.guid": "Invalid UUID" });

const emailRule = Joi.string().email().messages({
  "string.email": "Invalid email",
});

const passwordRule = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
  .required()
  .messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "string.pattern.base": "Password is too weak",
  });

// Validations
const idValidation = Joi.object({
  id: uuidRule,
}).options({ allowUnknown: false });

const nameValidation = Joi.object({
  name: Joi.string().min(1).max(100).required(),
}).options({ allowUnknown: false });

const emailEnqueValidation = Joi.object({
  to: Joi.alternatives()
    .try(
      Joi.string().email(),
      Joi.array().items(Joi.string().email()).min(1).max(10)
    )
    .required(),
  subject: Joi.string().required(),
  html: Joi.string().required(),
  filepath: Joi.string().optional().allow(null),
}).options({ allowUnknown: false });

const suspensionValidation = Joi.object({
  id: uuidRule,
  suspensionReason: Joi.string().trim().min(5).max(255).required(),
}).options({ allowUnknown: false });

const otpValidation = Joi.object({
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 digits",
    "any.required": "OTP is required",
  }),
  referenceCode: Joi.string().required().messages({
    "any.required": "Reference code is required",
  }),
  actionType: Joi.string()
    .valid(
      CONSTANTS.ACTION_TYPES.PASSWORD.FORGOT,
      CONSTANTS.ACTION_TYPES.VERIFY.EMAIL,
      CONSTANTS.ACTION_TYPES.VERIFY.MOBILE,
      CONSTANTS.ACTION_TYPES.PASSWORD.RESET
    )
    .required()
    .messages({
      "any.only": "Invalid action type",
      "any.required": "Action type is required",
    }),
}).options({ allowUnknown: false });

module.exports = {
  // rules
  uuidRule,
  emailRule,
  passwordRule,

  // validations
  idValidation,
  nameValidation,
  emailEnqueValidation,
  suspensionValidation,
  otpValidation,
}