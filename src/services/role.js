 
/* eslint-disable max-len */
const { Op } = require('sequelize');
const { InternalServerError, throwIfInternalServerError, throwIfNoDataFoundError, throwIfBadRequestError } = require('../../utils/customError'); 
const {handleSuccess, getPagination} = require('../../utils/commonFunctions');
const { ErrorMessage, SuccessMesage } = require('../../utils/responseMessages');
const { create, findAll, findOne, findByPk, update, destroy } = require('../../utils/dbOperations');
const models = require('../models');

exports.createRole = async(roleData) => { 
  const roleCreated = await create({model: models.role, body: roleData});
  throwIfInternalServerError({condition: !roleCreated , message: ErrorMessage.SERVER_ERROR()});
  return handleSuccess({message: SuccessMesage.CREATED("Role") , data: roleCreated});
}; 

exports.fetchRoleDetails = async({page = 1 , limit = 10 , search}) => { 
  
  let condition = { 
    ...(search && {
      [Op.or] : [
        { name : { [Op.iLike]: `%${search}%` } },
        { description : { [Op.iLike]: `%${search}%` } },
      ],
    }),
  };

  const roleRecords = await findAll({model: models.role, condition , ...getPagination({limit, page})});
  throwIfNoDataFoundError({condition: roleRecords.count , message: ErrorMessage.NOT_FOUND("Roles")});
  return handleSuccess({ message: SuccessMesage.FETCHED("Role"), data: roleRecords}); 
}; 

exports.fetchRoleById = async({id}) => { 

  const roleDetails = await findByPk({
    model: models.role,
    id,
    include: [
      { model: models.permission,
        as: "permissions",
        through: { attributes: [] } 
      },
    ],
  });
  throwIfBadRequestError({condition: !roleDetails , message: ErrorMessage.INVALID("Role Id")});

  return handleSuccess({message: SuccessMesage.FETCHED("Role"), data: roleDetails});
}; 

exports.updateRoleById = async({id, updatedBody}) => { 
  const roleRecord = await findByPk({model: models.role, id});
  throwIfBadRequestError({condition: !roleRecord , message: ErrorMessage.INVALID("Role Id")});

  const updatedRoleRecord = await update({model: models.role, condition: { id }, updatedBody, individualHooks: true , returning: true}); 
  throwIfInternalServerError({condition: !updatedRoleRecord[0] , message: ErrorMessage.SERVER_ERROR()});

  return handleSuccess({message: SuccessMesage.UPDATED("Role"), data: updatedRoleRecord});
}; 

exports.deleteRoleById = async ({ id }) => {
  const removedRole = await destroy({ model: models.role, condition: { id } });
  throwIfBadRequestError({ condition: !removedRole, message: ErrorMessage.INVALID("Role Id") });

  return handleSuccess({message: SuccessMesage.DELETED("Role")});
}; 
