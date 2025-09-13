const handleSuccess = require("../../utils/successHandler");
const commonFunctions = require("../../utils/commonFunctions");
const { ErrorMessage, SuccessMesage } = require("../../utils/responseMessages");
const db = require("../models");
const { Op } = require("sequelize");
const {
  ValidationError,
  BadRequestError,
  InternalServerError,
} = require("../../utils/customError");
const { verifyEmailTemplate } = require("../../utils/emailTemplates");
const sendEmail = require("../../utils/emailService");
const { v4: uuidv4 } = require("uuid");
const { generateToken, verifyToken } = require("../../utils/jwt");
const constants = require("../../utils/constants");
const { subscription_status_enums } = require("../../utils/enums");

exports.logIn = async (userData) => {
  const userRecord = await commonFunctions.findOne(db.user, {
    condition: { email: userData.email },
  });
  commonFunctions.dataNotFound({
    data: userRecord,
    message: "User With THis Email Does Not Exists",
  });

  const isPasswordMatch = await userRecord.comparePassword(userData.password);
  commonFunctions.dataNotFound({
    data: isPasswordMatch,
    message: "Invlaid Password",
  });

  const token = generateToken({ userId: userRecord.id });
  await commonFunctions.create(db.userToken, { userId: userRecord.id, token });

  return handleSuccess(SuccessMesage.USER.LOGGEDIN.message, {
    userId: userRecord.id,
    token,
  });
};

exports.forgotPassword = async ({ email }) => {
  const userRecord = await commonFunctions.findOne(db.user, {
    condition: { email },
    raw: true,
  });
  commonFunctions.dataNotFound({
    data: userRecord,
    message: ErrorMessage.USER_ERROR.NOT_FOUND.message,
  });

  // send otp
  const otp = commonFunctions.generateSecureOTP();
  sendEmail({
    to: email,
    subject: constants.EMAIL.SUBJECT.VERIFY,
    html: verifyEmailTemplate({ otp, name: userRecord.firstName }),
  });

  const referenceCode = commonFunctions.generateReferenceCode();
  const otp_valid_time =
    (await commonFunctions.findOne(db.appSettings, {
      condition: { name: constants.APP_CONFIG.OTP_VALID_TIME },
    })) || constants.OTP_VALID_TIME_MINUTES;
  const validTil = new Date(Date.now() + otp_valid_time * 60 * 1000);

  await commonFunctions.create({
    model: models.otp,
    body: {
      referenceCode,
      otp,
      validTil,
      userId: userRecord.id,
      recipientField: userRecord.email,
      actionType: constants.ACTION_TYPES.PASSWORD.FORGOT,
    },
  });

  return handleSuccess(SuccessMesage.SENT("OTP"), { referenceCode });
};

exports.resetPassword = async (data) => {
  const { password, token } = data;
  const { userId } = verifyToken(token);

  const tokenRecord = await commonFunctions.findOne(db.userToken, {
    condition: { token },
  });
  commonFunctions.dataNotFound({
    data: tokenRecord,
    message: ErrorMessage.ACCESS_TOKEN.INVALID.message,
  });

  await commonFunctions.update(
    db.user,
    { id: userId },
    { password },
    { individualHooks: true }
  );
  await commonFunctions.destroy(db.userToken, { token });
  return handleSuccess(SuccessMesage.UPDATED("Password"));
};

exports.verifyOTP = async (data) => {
  const { otp, referenceCode, actionType } = data;

  const otpRecord = await commonFunctions.findOne(db.otp, {
    condition: {
      referenceCode,
      otp,
      actionType,
      isVerified: { [Op.ne]: true },
    },
    raw: true,
  });
  commonFunctions.dataNotFound({
    data: otpRecord,
    message: ErrorMessage.OTP_ERROR.INVALID_OTP.message,
  });

  if (otpRecord.validTil.getTime() < Date.now()) {
    throw new ValidationError(ErrorMessage.OTP_ERROR.EXPIRED_OTP.message);
  }

  await commonFunctions.update(
    db.otp,
    { referenceCode, otp },
    { isVerified: true }
  );

  if (otpRecord.actionType == constants.ACTION_TYPES.PASSWORD.FORGOT) {
    const token = generateToken({ userId: otpRecord.userId });
    await commonFunctions.create(db.userToken, {
      token,
      userId: otpRecord.userId,
    });
    return handleSuccess(SuccessMesage.OTP.VERIFIED.message, { token });
  }

  return handleSuccess(SuccessMesage.VERIFIED("OTP"));
};

exports.verifyEmail = async (userData) => {
  const { userId } = userData;
  const userRecord = await commonFunctions.findByPk(db.user, userId, {
    raw: true,
  });
  if (!userRecord) {
    throw new BadRequestError(`User with id ${userId} not found`);
  }

  if (userRecord.isVerified === true) {
    throw new BadRequestError(
      `User with email ${userRecord.email} already verified`
    );
  }

  // check if email is already verified
  const options = {};
  options.condition = {
    recipientField: userRecord.email,
    isVerified: true,
  };
  options.raw = true;
  const otpRecord = await commonFunctions.findAll(db.otp, options);
  if (otpRecord.count) {
    throw new BadRequestError(
      `User with email ${userRecord.email} already verified`
    );
  }

  const referenceCode = commonFunctions.generateReferenceCode();
  const otp = commonFunctions.generateSecureOTP();

  const otp_valid_time =
    (await commonFunctions.findOne(db.appSettings, {
      condition: { name: constants.APP_CONFIG.OTP_VALID_TIME },
    })) || constants.OTP_VALID_TIME_MINUTES;
  const validTil = new Date(Date.now() + otp_valid_time * 60 * 1000);

  const otpBody = {
    referenceCode,
    otp,
    validTil,
    userId: userRecord.id,
    recipientField: userRecord.email,
    actionType: constants.ACTION_TYPES.VERIFY.EMAIL,
  };

  await commonFunctions.create(db.otp, otpBody);

  await sendEmail({
    to: userRecord.email,
    subject: constants.EMAIL.SUBJECT.VERIFY,
    html: verifyEmailTemplate({ otp }),
  });

  return handleSuccess(SuccessMesage.SENT("OTP"), { referenceCode });
};

exports.verifyMobile = async (userData) => {
  const userRecord = await commonFunctions.findOne(db.user, {
    condition: { id: userData.userId },
    raw: true,
  });
  commonFunctions.dataNotFound({
    data: userRecord,
    message: ErrorMessage.USER_ERROR.NOT_FOUND.message,
  });
  commonFunctions.dataAlreadyExists({
    data: userRecord.isVerified,
    message: ErrorMessage.USER_ERROR.ALREADY_VERIFIED.message,
  });

  const otpRecord = await commonFunctions.findOne(db.otp, {
    condition: { recipientField: userData.mobile, isVerified: true },
    raw: true,
  });
  commonFunctions.dataAlreadyExists({
    data: otpRecord,
    message: ErrorMessage.MOBILE.ALREADY_VERIFIED.message,
  });

  const updatedUser = await commonFunctions.update(
    db.user,
    { id: userData.userId },
    { mobile: userData.mobile },
    { returning: true }
  );

  if (!updatedUser) {
    throw new InternalServerError(
      ErrorMessage.GENERAL_ERROR.SERVER_ERROR.message
    );
  }

  const referenceCode = commonFunctions.generateReferenceCode();
  const otp = commonFunctions.generateSecureOTP();

  const otp_valid_time =
    (await commonFunctions.findOne(db.appSettings, {
      condition: { name: constants.APP_CONFIG.OTP_VALID_TIME },
    })) || constants.OTP_VALID_TIME_MINUTES;
  const validTil = new Date(Date.now() + otp_valid_time * 60 * 1000);

  await commonFunctions.create({
    model: models.otp,
    body: {
      referenceCode,
      otp,
      validTil,
      userId: userRecord.id,
      recipientField: userRecord.mobile,
      actionType: constants.ACTION_TYPES.VERIFY.MOBILE,
    },
  });

  //TODO: use sms service to send the sms

  return handleSuccess(SuccessMesage.OTP.SENT.message, { referenceCode, otp });
};

exports.changePassword = async (userData) => {
  const userRecord = await commonFunctions.findByPk(db.user, userData.userId);
  commonFunctions.dataNotFound({
    data: userRecord,
    message: ErrorMessage.USER_ERROR.NOT_FOUND.message,
  });

  userRecord.comparePassword(userData.oldPassword);
  await commonFunctions.update(
    db.user,
    { id: userRecord.id },
    { password: userData.newPassword }
  );

  return handleSuccess(SuccessMesage.UPDATED("Password"));
};

exports.customerLogin = async (userData) => {
  const customerRecord = await commonFunctions.findOne(db.customer, {
    condition: { email: userData.email, isVerified: true },
  });
  commonFunctions.dataNotFound({
    data: customerRecord,
    message: "User With This email is not found",
  });

  const isPasswordMatch = await customerRecord.comparePassword(
    userData.password
  );
  commonFunctions.dataNotFound({
    data: isPasswordMatch,
    message: "Invalid Password",
  });

  const token = generateToken({
    userId: customerRecord.id,
    userType: "customer",
  });
  await commonFunctions.create(db.customerToken, {
    customerId: customerRecord.id,
    token,
  });

  const subscriptionData = await commonFunctions.findAll(db.subscription, {
    condition: {
      subscriberId: customerRecord.id,
      status: subscription_status_enums.active,
    },
    include: [
      {
        model: db.subscriptionPlan,
        as: "subscriptionPlan",
        attributes: ["id","type","name"],
      },
    ],
    attributes: ["startDate","endDate"],
  });
  return handleSuccess(SuccessMesage.USER.LOGGEDIN.message, {
    userId: customerRecord.id,
    token,
    subscriptionData: subscriptionData.rows,
  });
};

exports.customerForgotPassword = async ({ email }) => {
  const userRecord = await commonFunctions.findOne(db.customer, {
    condition: { email },
    raw: true,
  });
  commonFunctions.dataNotFound({
    data: userRecord,
    message: ErrorMessage.USER_ERROR.NOT_FOUND.message,
  });

  // send otp
  const otp = commonFunctions.generateSecureOTP();
  sendEmail({
    to: email,
    subject: constants.EMAIL.SUBJECT.VERIFY,
    html: verifyEmailTemplate({ otp, name: userRecord.firstName }),
  });

  const referenceCode = uuidv4();
  const otp_valid_time =
    (await commonFunctions.findOne(db.appSettings, {
      condition: { name: constants.APP_CONFIG.OTP_VALID_TIME },
    })) || constants.OTP_VALID_TIME_MINUTES;
  const validTill = new Date(Date.now() + otp_valid_time * 60 * 1000);

  await commonFunctions.create(db.otp, {
    referenceCode,
    otp,
    validTill,
    customerId: userRecord.id,
    recipientField: userRecord.email,
    actionType: constants.ACTION_TYPES.PASSWORD.FORGOT,
  });

  return handleSuccess(SuccessMesage.OTP.SENT.message, { referenceCode });
};

exports.customerResetPassword = async (data) => {
  const { password, token } = data;
  const { userId } = verifyToken(token);

  const tokenRecord = await commonFunctions.findOne(db.customerToken, {
    condition: { token },
  });
  commonFunctions.dataNotFound({
    data: tokenRecord,
    message: ErrorMessage.ACCESS_TOKEN.INVALID.message,
  });

  await commonFunctions.update(
    db.customer,
    { id: userId },
    { password },
    { individualHooks: true }
  );
  await commonFunctions.destroy(db.customerToken, { token });
  return handleSuccess(SuccessMesage.UPDATED("Password"));
};

exports.customerVerifyOTP = async (data) => {
  const { otp, referenceCode } = data;

  const otpRecord = await commonFunctions.findOne(db.otp, {
    condition: {
      referenceCode,
      otp,
      isVerified: { [Op.ne]: true },
    },
    raw: true,
  });

  if(!otpRecord){
    throw new BadRequestError(ErrorMessage.OTP_ERROR.INVALID_OTP.message)
  }
  if (otpRecord.validTill.getTime() < Date.now()) {
    throw new ValidationError(ErrorMessage.OTP_ERROR.EXPIRED_OTP.message);
  }

  await commonFunctions.update(
    db.otp,
    { referenceCode, otp },
    { isVerified: true }
  );

  if (otpRecord.actionType == constants.ACTION_TYPES.PASSWORD.FORGOT) {
    const token = generateToken({ userId: otpRecord.customerId });
    await commonFunctions.create(db.customerToken, {
      token,
      customerId: otpRecord.customerId,
    });
    return handleSuccess(SuccessMesage.OTP.VERIFIED.message, { token });
  }

  if (otpRecord.actionType === constants.ACTION_TYPES.VERIFY.EMAIL) {
    await commonFunctions.update(
      db.customer,
      { id: otpRecord.customerId },
      { emailVerified: true }
    );
  }

  if (otpRecord.actionType === constants.ACTION_TYPES.VERIFY.MOBILE) {
    await commonFunctions.update(
      db.customer,
      { id: otpRecord.customerId },
      { mobileVerified: true }
    );
  }

  const updatedUser = await commonFunctions.findByPk(
    db.customer,
    otpRecord.customerId,
    { raw: true }
  );

  if (
    updatedUser.emailVerified &&
    updatedUser.mobileVerified &&
    !updatedUser.isVerified
  ) {
    await commonFunctions.update(
      db.customer,
      { id: updatedUser.id },
      { isVerified: true }
    );
  }

  return handleSuccess(SuccessMesage.OTP.VERIFIED.message);
};

exports.customerVerifyEmail = async (userData) => {
  const { userId } = userData;
  const userRecord = await commonFunctions.findByPk(db.customer, userId, {
    raw: true,
  });
  if (!userRecord) {
    throw new BadRequestError(`User with id ${userId} not found`);
  }

  if (userRecord.isVerified === true) {
    throw new BadRequestError(
      `User with email ${userRecord.email} already verified`
    );
  }

  // check if email is already verified
  const options = {};
  options.condition = {
    recipientField: userRecord.email,
    isVerified: true,
  };
  options.raw = true;
  const otpRecord = await commonFunctions.findAll(db.otp, options);
  if (otpRecord.count) {
    throw new BadRequestError(
      `User with email ${userRecord.email} already verified`
    );
  }

  const referenceCode = uuidv4();

  const otp = commonFunctions.generateSecureOTP();
  const otp_valid_time =
    (await commonFunctions.findOne(db.appSettings, {
      condition: { name: constants.APP_CONFIG.OTP_VALID_TIME },
    })) || constants.OTP_VALID_TIME_MINUTES;
  const validTill = new Date(Date.now() + otp_valid_time * 60 * 1000);

  const otpBody = {
    referenceCode,
    otp,
    validTill,
    customerId: userRecord.id,
    recipientField: userRecord.email,
    actionType: constants.ACTION_TYPES.VERIFY.EMAIL,
  };

  await commonFunctions.create(db.otp, otpBody);

  sendEmail({
    to: userRecord.email,
    subject: constants.EMAIL.SUBJECT.VERIFY,
    html: verifyEmailTemplate({ otp }),
  });

  return handleSuccess(SuccessMesage.OTP.SENT.message, { referenceCode });
};

exports.customerVerifyMobile = async (userData) => {
  const userRecord = await commonFunctions.findOne(db.customer, {
    condition: { id: userData.userId },
    raw: true,
  });
  commonFunctions.dataNotFound({
    data: userRecord,
    message: ErrorMessage.USER_ERROR.NOT_FOUND.message,
  });
  commonFunctions.dataAlreadyExists({
    data: userRecord.isVerified,
    message: ErrorMessage.USER_ERROR.ALREADY_VERIFIED.message,
  });

  const otpRecord = await commonFunctions.findOne(db.otp, {
    condition: { recipientField: userData.mobile, isVerified: true },
    raw: true,
  });
  commonFunctions.dataAlreadyExists({
    data: otpRecord,
    message: ErrorMessage.MOBILE.ALREADY_VERIFIED.message,
  });

  const updatedUser = await commonFunctions.update(
    db.customer,
    { id: userData.userId },
    { mobile: userData.mobile },
    { returning: true }
  );

  if (!updatedUser) {
    throw new InternalServerError(
      ErrorMessage.GENERAL_ERROR.SERVER_ERROR.message
    );
  }

  const referenceCode = uuidv4();

  const otp = commonFunctions.generateSecureOTP();
  const otp_valid_time =
    (await commonFunctions.findOne(db.appSettings, {
      condition: { name: constants.APP_CONFIG.OTP_VALID_TIME },
    })) || constants.OTP_VALID_TIME_MINUTES;
  const validTill = new Date(Date.now() + otp_valid_time * 60 * 1000);

  await commonFunctions.create(db.otp, {
    referenceCode,
    otp,
    validTill,
    customerId: userRecord.id,
    recipientField: userData.mobile,
    actionType: constants.ACTION_TYPES.VERIFY.MOBILE,
  });

  // use sms service to send the sms

  return handleSuccess(SuccessMesage.OTP.SENT.message, { referenceCode, otp });
};

exports.customerChangePassword = async (userData) => {
  const userRecord = await commonFunctions.findByPk(
    db.customer,
    userData.userId
  );
  commonFunctions.dataNotFound({
    data: userRecord,
    message: ErrorMessage.USER_ERROR.NOT_FOUND.message,
  });

  const isValidPassword = userRecord.comparePassword(userData.oldPassword);
  if (!isValidPassword) {
    throw new BadRequestError("Incorrect Password");
  }
  await commonFunctions.update(
    db.customer,
    { id: userRecord.id },
    { password: userData.newPassword }
  );

  return handleSuccess(SuccessMesage.UPDATED("Password"));
};
