/* eslint-disable max-len */
const router = require("express").Router();
const { errorWrapper } = require("../../utils/commonFunctions");
const authController = require("../controllers/auth");
const checkAuth = require("../middlewares/checkAuth");
const { validate } = require("../middlewares/validator");
const {
  logInUserValidation,
  emailValidation,
  resetPasswordValidation,
  otpvalidation,
  idValidation,
  changePasswordValidation,
  mobileVerification,
} = require("../validators/auth");

// create
router.post('/login', validate({schema: logInUserValidation}), errorWrapper(authController.login));
router.post('/forgot-password', validate({schema: emailValidation}),  errorWrapper(authController.forgotPassword));
router.post('/verify-email', validate({schema: idValidation}),  errorWrapper(authController.verifyEmail));
router.post('/verify-mobile', validate({schema: mobileVerification}),  errorWrapper(authController.verifyMobile));
router.post('/verify-otp', validate({schema: otpvalidation}),  errorWrapper(authController.verifyOtp));

// update
router.put('/reset-password', validate({schema: resetPasswordValidation}), errorWrapper(authController.resetPassword));
router.put('/change-password', checkAuth, validate({schema: changePasswordValidation}), errorWrapper(authController.changePassword));

module.exports = router;
