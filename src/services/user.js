/* eslint-disable max-len */
const {handleSuccess, getPagination} = require("../../utils/commonFunctions");
const { SuccessMesage, ErrorMessage } = require("../../utils/responseMessages");
const models = require("../models");
const { Op } = require("sequelize");
const { role_enums } = require("../../utils/enums");
const { findOne, create, findByPk, update, findAll, destroy } = require("../../utils/dbOperations");
const { throwIfDataFoundError, throwIfInternalServerError, throwIfNoDataFoundError, throwIfBadRequestError } = require("../../utils/customError");

exports.createUser = async ({email , password}) => {
  return await models.sequelize.transaction(async transaction => {

    const userRecord = await findOne({model: models.user , condition : {email: email} , transaction });
    throwIfDataFoundError({condition: userRecord , message: ErrorMessage.ALREADY_EXISTS("User With This Email")})

    const userCreatedRecord = await  create({model: models.user, body: {email, password} , transaction});
    throwIfInternalServerError({condition: !userCreatedRecord , message: ErrorMessage.SERVER_ERROR()});

    const adminRoleRecord = await findOne({ model: models.role, condition: { name: { [Op.iLike]: role_enums.admin, }, } , transaction });
    throwIfInternalServerError({condition: !adminRoleRecord , message: ErrorMessage.NOT_FOUND("Admin Role Record")});

    const userRole = await create({ model: models.userRole , body: {userId : userCreatedRecord.id , roleId : adminRoleRecord.id } , transaction});
    throwIfInternalServerError({condition: !userRole , message: ErrorMessage.SERVER_ERROR()});

    delete userCreatedRecord.dataValues.password ;
    delete userCreatedRecord.dataValues.deletedAt ;

    return handleSuccess({message: SuccessMesage.CREATED("User"), data: userCreatedRecord });
  })
};

exports.updateUser = async ({id, userData}) => {
  
  const userRecord = await findByPk({model: models.user , id});
  console.log(userRecord);
  // throw if user not found
  throwIfNoDataFoundError({condition : userRecord , message: ErrorMessage.INVALID("UserId")})

  const updatedUser = await update({model: models.user, condition: { id }, updatedBody: userData});
  throwIfInternalServerError({condition: !updatedUser[0] , message: ErrorMessage.SERVER_ERROR() });

  return handleSuccess({message: SuccessMesage.UPDATED("User")}) ;
}

exports.listUsers = async ({page = 1 , limit = 10 }) => {

  const userRecords = await findAll({
    model: models.user,
    attributes: { exclude: ["password", "updatedAt", "deletedAt"] },
    ...getPagination({ limit, page }),
  });
  
  // findAll returns an array — check length
  throwIfNoDataFoundError({condition: userRecords || userRecords.length === 0 , message: ErrorMessage.NOT_FOUND("Users")})

  return handleSuccess({message: SuccessMesage.FETCHED("Users") , data: userRecords})
}

exports.getUserById = async ({id})  => {
  const userRecord = await findByPk({
    model: models.user,
    id,
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