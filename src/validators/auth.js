const Joi = require("joi");

const { CONSTANTS } = require("../../utils/constants");

exports.logInUserValidation = Joi.object({

  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
    }),
}).options({ allowUnknown: false });

exports.emailValidation = Joi.object({
  email: Joi.string().email().required(),
}).options({ allowUnknown: false });

exports.otpvalidation = Joi.object({
  otp: Joi.string().length(6).required(),
  referenceCode: Joi.string().required(),// ---> UUID Removed Integration
  actionType: Joi.string().valid(
    CONSTANTS.ACTION_TYPES.VERIFY.EMAIL,
    CONSTANTS.ACTION_TYPES.VERIFY.MOBILE,
    CONSTANTS.ACTION_TYPES.PASSWORD.FORGOT,
    CONSTANTS.ACTION_TYPES.PASSWORD.RESET,
  ),
});

exports.userIdValidation = Joi.object({
  userId : Joi.number().min(1).required()
}).options({allowUnknown: false});

exports.mobileVerification = Joi.object({
  userId : Joi.number().min(1).required(),
  mobile : Joi.string().min(10).max(12).required()
}).options({allowUnknown: false});

exports.resetPasswordValidation = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
    }),
    token : Joi.string().required()
})

exports.changePasswordValidation = Joi.object({
  oldPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
    })
});