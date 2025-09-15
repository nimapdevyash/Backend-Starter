/* eslint-disable max-len */
const {handleSuccess, getPagination} = require("../../utils/commonFunctions");
const { SuccessMesage, ErrorMessage } = require("../../utils/responseMessages");
const models = require("../models");
const { Op } = require("sequelize");
const { role_enums } = require("../../utils/enums");
const { findOne, create, findByPk, update, findAll, destroy } = require("../../utils/dbOperations");
const { throwIfDataFoundError, throwIfInternalServerError, throwIfNoDataFoundError, throwIfBadRequestError } = require("../../utils/customError");

exports.createUser = async ({email , password}) => {
  const userRecord = await findOne({model: models.user , condition : {email: email} });
  throwIfDataFoundError({condition: userRecord , message: ErrorMessage.ALREADY_EXISTS("User With This Email")})

  const userCreatedRecord = await  create({model: models.user, body: {email, password}});
  throwIfInternalServerError({condition: !userCreatedRecord , message: ErrorMessage.SERVER_ERROR()});

  const adminRoleRecord = await findOne({ model: models.userRole, condition: { name: { [Op.iLike]: role_enums.admin, }, } });
  throwIfInternalServerError({condition: !adminRoleRecord , message: ErrorMessage.NOT_FOUND("Admin Role Record")});

  const userRole = await create({ model: models.userRole , body: {userId : userCreatedRecord.id , roleId : adminRoleRecord.id }});
  throwIfInternalServerError({condition: !userRole , message: ErrorMessage.SERVER_ERROR()});

  return handleSuccess({message: SuccessMesage.CREATED("User"), data: userCreatedRecord });
};

exports.updateUser = async ({id, userData}) => {
  const userRecord = await findByPk({model: models.user , id});
  throwIfDataFoundError({condition : userRecord , message: ErrorMessage.INVALID("UserId")})

  if(userData.languageId){
    const languageRecord = await findByPk({model: models.language,id:  userData.languageId});
    throwIfDataFoundError({condition: languageRecord , message: ErrorMessage.INVALID("Language Id")});
  }
  const updatedUser = await update({model: models.user, condition: { id }, updatedBody: userData});
  throwIfInternalServerError({condition: !updatedUser[0] , message: ErrorMessage.SERVER_ERROR() });

  return handleSuccess({message: SuccessMesage.UPDATED("User")}) ;
}

exports.listUsers = async ({page = 1 , limit = 10 }) => {

  const userRecords = await findAll({
    model: models.user,
    attributes: { exclude: ["password", "updatedAt", "deletedAt"] },
    include: [{ model: db.language, attributes: ["name"] }],
    ...getPagination({ limit, page }),
  });
  throwIfNoDataFoundError({condition: userRecords.count , message: ErrorMessage.NOT_FOUND("Users")})

  return handleSuccess({message: SuccessMesage.FETCHED("Users") , data: userRecords})
}

exports.getUserById = async ({id})  => {

  const userRecord = await findByPk({
    model: models.user,
    id,
    include: [ { model: db.language, attributes: ["name"], } ],
    attributes: { exclude: ["password", "updatedAt", "deletedAt"] },
  });
  throwIfBadRequestError({condition: !userRecord , message: ErrorMessage.INVALID("User Id")});
  return handleSuccess({message: SuccessMesage.FETCHED.message , data: userRecord});
}

exports.removeUser = async ({id}) => {
  const deleteUser = await destroy({model: models.user, condition: { id }});
  throwIfBadRequestError({condition: !deleteUser , message: ErrorMessage.INVALID("User Id")});
  return handleSuccess({message: SuccessMesage.DELETED("User")});
}