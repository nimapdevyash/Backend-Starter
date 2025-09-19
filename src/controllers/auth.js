/* eslint-disable max-len */
const authService = require('../services/auth'); 
const response = require('../../utils/response'); 

exports.login = async(req, res) => { 
  const loggedInUser = await authService.logIn(req.body);
  return response.ok(res, loggedInUser); 
}; 

exports.forgotPassword = async(req, res) => {
  const result = await authService.forgotPassword(req.body);
  return response.ok(res, result);
};


exports.verifyEmail = async(req, res) => {
  const { userId } = req.body
  const result = await authService.verifyEmail({userId});
  return response.ok(res, result);
};

exports.verifyMobile = async(req, res) => {
  const result = await authService.verifyMobile(req.body);
  return response.ok(res, result);
};
exports.verifyOtp = async(req, res) => {
  const result = await authService.verifyOTP(req.body);
  return response.ok(res, result);
};

exports.resetPassword = async(req, res) => {
  const result = await authService.resetPassword(req.body);
  return response.ok(res, result);
};

exports.changePassword = async(req, res) => {
  const result = await authService.changePassword({...req.body , userId : req.userData.id});
  return response.ok(res, result);
};

exports.customerLogin = async(req, res) => { 
  const loggedInUser = await authService.customerLogin(req.body);
  return response.ok(res, loggedInUser); 
}; 

exports.customerForgotPassword = async(req, res) => {
  const result = await authService.customerForgotPassword(req.body);
  return response.ok(res, result);
};

exports.customerVerifyEmail = async(req, res) => {
  const result = await authService.customerVerifyEmail(req.body);
  return response.ok(res, result);
};

exports.customerVerifyMobile = async(req, res) => {
  const result = await authService.customerVerifyMobile(req.body);
  return response.ok(res, result);
};
exports.customerVerifyOtp = async(req, res) => {
  const result = await authService.customerVerifyOTP(req.body);
  return response.ok(res, result);
};

exports.customerResetPassword = async(req, res) => {
  const result = await authService.customerResetPassword(req.body);
  return response.ok(res, result);
};

exports.customerChangePassword = async(req, res) => {
  const result = await authService.customerChangePassword({...req.body , userId : req.userData.id});
  return response.ok(res, result);
};