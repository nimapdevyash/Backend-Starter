/* eslint-disable max-len */
const handleSuccess = require("../../utils/successHandler");
const commonFunctions = require("../../utils/commonFunctions");
const { SuccessMesage, ErrorMessage } = require("../../utils/responseMessages");
const models = require("../models");
const { ValidationError, InternalServerError, BadRequestError, NoDataFoundError } = require("../../utils/customError");
const { Op } = require("sequelize");
const { role_enums } = require("../../utils/enums");

exports.createUser = async (userData) => {
  const userRecord = await commonFunctions.findOne({model: models.user , condition : {email: userData.email} });
  dataNotFoundError({condition: userRecord , message: ErrorMessage.ALREADY_EXISTS("User With This Email")})

  const userCreated = await commonFunctions.create( db.user, { email: userData.email, password: userData.password });
  if(!userCreated){
    throw new InternalServerError();
  }

  const adminRoleRecord = await commonFunctions.findOne(db.userRole , {condition: { name : {
    [Op.iLike] : role_enums.admin
  }}})
  if(!adminRoleRecord) {
    throw new InternalServerError("Admin Role Record Not Found")
  }
  const userRole = await commonFunctions.create(db.userRole , {userId : userCreated.id , roleId : adminRoleRecord.id });
  if(!userRole) {
    throw new InternalServerError();
  }

  return handleSuccess(SuccessMesage.CREATED("User"), userCreated);
};

exports.updateUser = async (id, userData) => {
  const userRecord = await commonFunctions.findByPk({model: models.user , id});
  dataNotFoundError({condition : !userRecord , message: ErrorMessage.INVALID("UserId")})

  if(userData.languageId){
    const languageRecord = await commonFunctions.findByPk({model: models.language,id:  userData.languageId});
    dataNotFoundError({condition: languageRecord , message: ErrorMessage.INVALID("Language Id")});
  }
  const updatedUser = await commonFunctions.update({model: models.user, condition: { id }, updatedBody: userData});
  serverError({condition: updatedUser[0] !== 1 , message: ErrorMessage.SERVER_ERROR() });

  return handleSuccess(SuccessMesage.UPDATED("User")) ;
}

exports.listUsers = async (query) => {
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const options = {};

  options.include = [
    {
      model: db.language,
      attributes: ["name"]
    }
  ]
  options.attributes = { exclude: ["password", "updatedAt", "deletedAt"] };
  options.offset = offset;
  options.limit = limit;
  const userRecords = await commonFunctions.findAll( db.user, options);
  if(userRecords.rows.length === 0){
    throw new NoDataFoundError("No users found");
  }

  return handleSuccess(SuccessMesage.FETCHED("Users") , userRecords)
}

exports.getUserById = async (id)  => {
  const options = {};

  options.include = [
    {
      model: db.language,
      attributes: ["name"]
    }
  ]
  options.attributes = { exclude: ["password", "updatedAt", "deletedAt"] };
  const userRecord = await commonFunctions.findByPk(db.user, id, options);
  if(!userRecord){
    throw new BadRequestError(`User with id ${id} not exist`);
  }
  return handleSuccess(SuccessMesage.FETCHED.message , userRecord);
}

exports.removeUser = async (id) => {
  const deleteUser = await commonFunctions.destroy(db.user, { id });
  if(!deleteUser){
    throw new BadRequestError(`User with id ${id} not exist`);
  }
  return handleSuccess(SuccessMesage.DELETED("User"));
}