/* eslint-disable max-len */
const router = require("express").Router();
const { errorWrapper } = require("../../utils/commonFunctions");
const { validation_types_enums } = require("../../utils/enums");
const authController = require("../controllers/auth");
const checkAuth = require("../middlewares/checkAuth");
const { validate } = require("../middlewares/validator");
const {
  logInUserValidation,
  emailValidation,
  resetPasswordValidation,
  
  changePasswordValidation,
  mobileVerification,

} = require("../validators/auth");
const { idValidation ,otpValidation} = require("../validators/commonValidators");

// create
router.post('/login', validate({schema: logInUserValidation}), errorWrapper(authController.login));
router.post('/forgot-password', validate({schema: emailValidation}),  errorWrapper(authController.forgotPassword));
router.post('/verify-email',checkAuth, errorWrapper(authController.verifyEmail));
router.post('/verify-mobile', validate({schema: mobileVerification}),  errorWrapper(authController.verifyMobile));
router.post('/verify-otp', validate({schema: otpValidation}),  errorWrapper(authController.verifyOtp));

// update
router.put('/reset-password/:token', validate({schema: resetPasswordValidation , type: validation_types_enums.params_body}), errorWrapper(authController.resetPassword));
router.put('/change-password', checkAuth, validate({schema: changePasswordValidation}), errorWrapper(authController.changePassword));

module.exports = router;
