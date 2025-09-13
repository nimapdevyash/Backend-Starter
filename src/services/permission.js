 
/* eslint-disable max-len */
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');
const { Op } = require('sequelize');
const models = require('../models');
const { ErrorMessage, SuccessMesage } = require('../../utils/responseMessages');
const { serverError, dataNotFoundError, badRequestError } = require('../../utils/errorHandlers');
const { badRequest } = require('../../utils/response');

exports.createPermission = async(permissionData) => { 
  const addedPermission = await commonFunctions.create({model: models.permission, body: permissionData});
  serverError({condition: addedPermission , message: ErrorMessage.SERVER_ERROR()});
  
  return handleSuccess(SuccessMesage.CREATED("Permission")); 
}; 

exports.fetchPermissionDetails = async (query) => {
  let {
    page = Number(query.page) || 1,
    limit = Number(query.limit) || 10,
    actionName,
    description,
    method,
  } = query;

  const permissionRecords = await commonFunctions.findAll({
    model: models.permission,
    condition: {
        [Op.or]: [
          actionName && { actionName: { [Op.iLike]: `%${actionName}%` } },
          description && { description: { [Op.iLike]: `%${description}%` } },
          method && { method: { [Op.iLike]: `%${method}%` } },
        ],
    },
    attributes: [ "id", "actionName", "description", "baseUrl", "path", "method", "createdAt", "updatedAt" ],
    ...commonFunctions.getPagination({ page, limit }),
  });
  dataNotFoundError({ condition: permissionRecords.count, message: ErrorMessage.NOT_FOUND("Permission Records") });

  return handleSuccess(SuccessMesage.FETCHED("Permission"), permissionRecords);
}; 

exports.fetchPermissionById = async(id) => { 
  const permissionRecord = await commonFunctions.findByPk({ model: models.permission, id });
  badRequestError({condition: !permissionRecord , message: ErrorMessage.INVALID("Permission Id")});
  return handleSuccess(SuccessMesage.FETCHED("Permissioin"), permissionRecord); 
}; 

exports.updatePermissionById = async( id, updateData ) => { 
  const permissionRecord = await commonFunctions.findByPk({model: models.permission, id});
  badRequestError({condition: !permissionRecord , message: ErrorMessage.INVALID("Permission Id")});

  const updatedRecord = await commonFunctions.update({model: models.permission, condition: { id }, updatedBody: updateData , options: {individualHooks: true}});
  serverError({condition: !updatedRecord[0] , message: ErrorMessage.SERVER_ERROR()});

  return handleSuccess(SuccessMesage.UPDATED("Permission")); 
}; 

exports.deletePermissionById = async(id) => { 
  const removedPermission = await commonFunctions.destroy({model: models.permission, condition: { id }});  
  badRequestError({condition: !removedPermission , message: ErrorMessage.INVALID("Permission Id") });
  return handleSuccess(SuccessMesage.DELETED("Permission")); 
}; 
