const {
  handleSuccess,
  populateTemplate,
  generateReferenceCode,
  generateSecureOTP
} = require("../../utils/commonFunctions");
const { ErrorMessage, SuccessMesage } = require("../../utils/responseMessages");
const models = require("../models")
const { Op } = require("sequelize");
const { generateToken, verifyToken } = require("../../utils/jwt");
const { CONSTANTS } = require("../../utils/constants");
const { findOne, create, update, destroy, findByPk, findAll } = require("../../utils/dbOperations");
const {throwIfNoDataFoundError, throwIfInternalServerError, throwIfValidationError, throwIfBadRequestError} = require("../../utils/customError");
const { enqueueEmail } = require("../../utils/emailService");
const { setUserTokenDetails } = require("../../utils/cacheHandler");

exports.logIn = async ({email, password}) => {
  const userRecord = await findOne({model: models.user,  condition: {email}, raw: false} );
  throwIfNoDataFoundError({ condition: userRecord, message: ErrorMessage.INVALID("Email"), });

  const isPasswordMatch = await userRecord.comparePassword(password);
  throwIfNoDataFoundError({ condition: isPasswordMatch, message: ErrorMessage.INVALID("Password")});

  const token = generateToken({ userId: userRecord.id });
  
  await create({model: models.userToken, body: { userId: userRecord.id, token }});
  setUserTokenDetails({userId: userRecord.id , data: token});

  return handleSuccess({
    message: "Logged In Successfully",
    data: {
      userId: userRecord.id,
      token,
    },
  });
};

exports.forgotPassword = async ({ email }) => {
 
  const userRecord = await findOne({ model: models.user, condition: { email }, raw: true });
  throwIfNoDataFoundError({ condition: userRecord, message: ErrorMessage.NOT_FOUND("User") });
 
  const emailTemplateRecord = await findOne({model: models.emailTemplate , condition: {name: CONSTANTS.EMAIL.TEMPLATE.FORGOT_PASSWORD} , raw: true});
 
  throwIfInternalServerError({condition: !emailTemplateRecord , message: ErrorMessage.NOT_FOUND("Otp Email Template")});
  
  // send otp
  const otp = generateSecureOTP();
  const otp_valid_time = CONSTANTS.OTP_VALID_TIME_MINUTES;
  enqueueEmail({
    to: email,
    subject: emailTemplateRecord.subject,
    html: populateTemplate({data: {...userRecord , otp,validTill:otp_valid_time} , templateString: emailTemplateRecord.html}) 
  });

  const referenceCode = generateReferenceCode();
  
  const validTill = new Date(Date.now() + otp_valid_time * 60 * 1000);

  await create({
    model: models.otp,
    body: {
      referenceCode,
      otp,
      validTill,
      userId: userRecord.id,
      recipientField: userRecord.email,
      actionType: CONSTANTS.ACTION_TYPES.PASSWORD.FORGOT,
    },
  });

  return handleSuccess({ message: SuccessMesage.SENT("OTP"), data: { referenceCode } });  
}

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
  throwIfValidationError({ condition: otpRecord.validTill.getTime() < Date.now(), message: "Otp Is Expired" })

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
    return handleSuccess({message: SuccessMesage.VERIFIED.message, data: { token }});
  }

  return handleSuccess({message: SuccessMesage.VERIFIED("OTP")});
};

exports.verifyEmail = async ({id}) => {
  const userRecord = await findByPk({model: models.user,id});
  throwIfBadRequestError({condition: !userRecord , message: ErrorMessage.INVALID("User Id")});
 
  const otpRecord = await findAll({
    model: models.otp,
    condition: {
      recipientField: userRecord.email,
      isVerified: true,
    },
    raw: true ,
  });

  throwIfBadRequestError({condition: otpRecord.count , message: "User with this email is already verified" })

  const referenceCode = generateReferenceCode();
  let otp = generateSecureOTP();

  const otp_valid_time = CONSTANTS.OTP_VALID_TIME_MINUTES;
  const validTill = new Date(Date.now() + otp_valid_time * 60 * 1000);

  await create({
    model: models.otp, 
    body: {
      referenceCode,
      otp,
      validTill,
      validTill,
      userId: userRecord.id,
      recipientField: userRecord.email,
      actionType: CONSTANTS.ACTION_TYPES.VERIFY.EMAIL,
    }
  });

  const  emailTemplateRecord = await findOne({model: models.emailTemplate , condition: {name: CONSTANTS.EMAIL.TEMPLATE.VERIFY_EMAIL } , raw: true});
  throwIfInternalServerError({condition: !emailTemplateRecord , message: ErrorMessage.NOT_FOUND("Otp Email Template")});

  // send otp
  enqueueEmail({
    to: userRecord.email,
    subject: emailTemplateRecord.subject,
    html: populateTemplate({data: {...userRecord , otp, validTill: validTill.toLocaleString() } , templateString: emailTemplateRecord.html}) 
  });

  return handleSuccess({message: SuccessMesage.SENT("OTP"), data:{ referenceCode }});
};


exports.changePassword = async ({userId , oldPassword, newPassword}) => {

  return await models.sequelize.transaction(async transaction => {

    const userRecord = await findByPk({model: models.user, id: userId,raw:false},);
    throwIfNoDataFoundError({ condition: userRecord, message: ErrorMessage.NOT_FOUND("User") });

    const invalidOldPassword = await userRecord.comparePassword(oldPassword);
    throwIfValidationError({ condition: !invalidOldPassword, message: ErrorMessage.INVALID("Old Password") });
    await update({
      model: models.user,
      condition: { id: userRecord.id },
      updatedBody: { password: newPassword },
    });

    return handleSuccess({message: SuccessMesage.UPDATED("Password")});
  })
};