const Joi = require("joi");
const { CONSTANTS } = require("../../utils/constants");
const {passwordRule, emailRule, uuidRule} = require("./commonValidators");

// LOGIN
exports.logInUserValidation = Joi.object({
  email: emailRule,
  password: passwordRule,
}).options({ allowUnknown: false });

// EMAIL ONLY
exports.emailValidation = Joi.object({
  email: emailRule,
}).options({ allowUnknown: false });

// OTP
exports.otpValidation = Joi.object({
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 digits",
    "any.required": "OTP is required",
  }),
  referenceCode: Joi.string().required().messages({
    "any.required": "Reference code is required",
  }),
  actionType: Joi.string()
    .valid(
      CONSTANTS.ACTION_TYPES.VERIFY.EMAIL,
      CONSTANTS.ACTION_TYPES.VERIFY.MOBILE,
      CONSTANTS.ACTION_TYPES.PASSWORD.FORGOT,
      CONSTANTS.ACTION_TYPES.PASSWORD.RESET,
    )
    .required()
    .messages({
      "any.only": "Invalid action type",
      "any.required": "Action type is required",
    }),
}).options({ allowUnknown: false });

// MOBILE VERIFICATION
exports.mobileVerification = Joi.object({
  userId: uuidRule,
  mobile: Joi.string().min(10).max(12).required().messages({
    "string.min": "Mobile must be at least 10 digits",
    "string.max": "Mobile must not exceed 12 digits",
    "any.required": "Mobile is required",
  }),
}).options({ allowUnknown: false });

// RESET PASSWORD
exports.resetPasswordValidation = Joi.object({
  password: passwordRule,
  token: Joi.string().required().messages({
    "any.required": "Token is required",
  }),
}).options({ allowUnknown: false });

// CHANGE PASSWORD
exports.changePasswordValidation = Joi.object({
  oldPassword: passwordRule.messages({
    "any.required": "Old password is required",
  }),
  newPassword: passwordRule.messages({
    "any.required": "New password is required",
  }),
}).options({ allowUnknown: false });
