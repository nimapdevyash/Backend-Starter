const {
  handleSuccess,
  getPagination,
  paginateResponse,
  populateTemplate
} = require("../../utils/commonFunctions");
const { ErrorMessage, SuccessMesage } = require("../../utils/responseMessages");
const models = require("../models")
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { generateToken, verifyToken } = require("../../utils/jwt");
const { CONSTANTS } = require("../../utils/constants");
const { findOne, create, update, destroy, findByPk, findAll } = require("../../utils/dbOperations");
const {throwIfNoDataFoundError, throwIfInternalServerError, throwIfValidationError, throwIfBadRequestError} = require("../../utils/customError");
const { enqueueEmail } = require("../../utils/emailService");

exports.logIn = async (userData) => {
  const userRecord = await findOne({model: models.user,  condition: { email: userData.email },} );
  throwIfNoDataFoundError({ condition: userRecord, message: "User With THis Email Does Not Exists", });

  const isPasswordMatch = await userRecord.comparePassword(userData.password);
  throwIfNoDataFoundError({ condition: isPasswordMatch, message: "Invlaid Password" });

  const token = generateToken({ userId: userRecord.id });
  await create({model: models.userToken, body: { userId: userRecord.id, token }});

  return handleSuccess({
    message: SuccessMesage.USER.LOGGEDIN.message,
    data: {
      userId: userRecord.id,
      token,
    },
  });
};

exports.forgotPassword = async ({ email }) => {
  const userRecord = await findOne({ model: models.user, condition: { email }, raw: true, });
  throwIfNoDataFoundError({ condition: userRecord, message: ErrorMessage.NOT_FOUND("User") });

  const emailTemplateRecord = await findOne({model: models.emailTemplate , condition: {name: CONSTANTS.EMAIL.TEMPLATE.OTP } , raw: true});
  throwIfInternalServerError({condition: emailTemplateRecord , message: ErrorMessage.NOT_FOUND("Otp Email Template")});

  // send otp
  const otp = commonFunctions.generateSecureOTP();
  enqueueEmail({
    to: email,
    subject: emailTemplateRecord.subject,
    html: populateTemplate({data: {...userRecord , otp} , templateString: emailTemplateRecord.html}) 
  });

  const referenceCode = commonFunctions.generateReferenceCode();
  const otp_valid_time = CONSTANTS.OTP_VALID_TIME_MINUTES;
  const validTil = new Date(Date.now() + otp_valid_time * 60 * 1000);

  await create({
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

exports.resetPassword = async ({ password, token }) => {
  const { userId } = verifyToken(token);

  const tokenRecord = await findOne({ model: models.userToken, condition: { token } });
  throwIfNoDataFoundError({ condition: tokenRecord, message: ErrorMessage.INVALID("Access Token") });

  await update({
    model: models.user,
    condition: { id: userId },
    updatedBody: { password },
    individualHooks: true,
  });
  await destroy({model: models.userToken, condition: { token }});
  return handleSuccess({ message: SuccessMesage.UPDATED("Password") });
};

exports.verifyOTP = async ({ otp, referenceCode, actionType }) => {

  const otpRecord = await findOne({
    model: models.otp,
    condition: { referenceCode, otp, actionType, isVerified: { [Op.ne]: true } },
    raw: true,
  });
  throwIfNoDataFoundError({ condition: otpRecord, message: ErrorMessage.INVALID("Otp"), });
  throwIfValidationError({ condition: otpRecord.validTil.getTime() < Date.now(), message: "Otp Is Expired" })

  await update({
    model: models.otp,
    condition: { referenceCode, otp },
    updatedBody: { isVerified: true },
  });

  if (otpRecord.actionType == CONSTANTS.ACTION_TYPES.PASSWORD.FORGOT) {
    const token = generateToken({ userId: otpRecord.userId });
    await create({
      model: models.userToken,
      body: {
        token,
        userId: otpRecord.userId,
      },
    });
    return handleSuccess({message: SuccessMesage.OTP.VERIFIED.message, data: { token }});
  }

  return handleSuccess({message: SuccessMesage.VERIFIED("OTP")});
};

exports.verifyEmail = async ({userId}) => {
  const userRecord = await findByPk({model: models.user,id: userId});
  throwIfBadRequestError({condition: userRecord , message: ErrorMessage.INVALID("User Id")});

  const otpRecord = await findAll({
    model: models.otp,
    condition: {
      recipientField: userRecord.email,
      isVerified: true,
    },
    raw: true ,
  });
  throwIfBadRequestError({condition: otpRecord.count , message: "User with this email is already verified" })

  const referenceCode = commonFunctions.generateReferenceCode();
  let otp = commonFunctions.generateSecureOTP();

  const otp_valid_time = CONSTANTS.OTP_VALID_TIME_MINUTES;
  const validTil = new Date(Date.now() + otp_valid_time * 60 * 1000);

  await create({
    model: models.otp, 
    body: {
      referenceCode,
      otp,
      validTil,
      userId: userRecord.id,
      recipientField: userRecord.email,
      actionType: CONSTANTS.ACTION_TYPES.VERIFY.EMAIL,
    }
  });

  const  emailTemplateRecord = await findOne({model: models.emailTemplate , condition: {name: CONSTANTS.EMAIL.TEMPLATE.OTP } , raw: true});
  throwIfInternalServerError({condition: emailTemplateRecord , message: ErrorMessage.NOT_FOUND("Otp Email Template")});

  // send otp
  enqueueEmail({
    to: email,
    subject: emailTemplateRecord.subject,
    html: populateTemplate({data: {...userRecord , otp} , templateString: emailTemplateRecord.html}) 
  });

  return handleSuccess(SuccessMesage.SENT("OTP"), { referenceCode });
};


exports.changePassword = async ({userId , oldPassword, newPassword}) => {
  const userRecord = await findByPk({model: models.user, id: userId});
  throwIfNoDataFoundError({ condition: userRecord, message: ErrorMessage.NOT_FOUND("User") });

  userRecord.comparePassword( oldPassword);
  await update({
    model: models.user,
    condition: { id: userRecord.id },
    updatedBody: { password: newPassword },
  });

  return handleSuccess({message: SuccessMesage.UPDATED("Password")});
};