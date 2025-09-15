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
  userIdValidation,
  changePasswordValidation,
  mobileVerification,
} = require("../validators/auth");

//ADMIN
router.post('/login', validate(logInUserValidation), errorWrapper(authController.login));
router.post('/forgot-password', validate(emailValidation),  errorWrapper(authController.forgotPassword));
router.post('/verify-email', validate(userIdValidation),  errorWrapper(authController.verifyEmail));
router.post('/verify-mobile', validate(mobileVerification),  errorWrapper(authController.verifyMobile));
router.post('/verify-otp', validate(otpvalidation),  errorWrapper(authController.verifyOtp));
router.put('/reset-password', validate(resetPasswordValidation), errorWrapper(authController.resetPassword));
router.put('/change-password', checkAuth, validate(changePasswordValidation), errorWrapper(authController.changePassword));

module.exports = router;
