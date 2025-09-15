 
/* eslint-disable max-len */ 
const {handleSuccess} = require('../../utils/commonFunctions');
const { ErrorMessage, SuccessMesage } = require('../../utils/responseMessages');
const db = require('../models');

exports.createRolePermission = async(rolePermissionData) => { 
  const options = {};
  options.condition = {
    roleId: rolePermissionData.roleId,
    permissionId: rolePermissionData.permissionId,
  };

  const rolePermissionRecord = await commonFunctions.findOne(db.rolePermission, options);
  commonFunctions.dataAlreadyExists({data: rolePermissionRecord , message: ErrorMessage.GENERAL_ERROR.DATA_ALREADY_EXISTS.message  });

  const addRolePermission = await commonFunctions.create(db.rolePermission, rolePermissionData);
  commonFunctions.dataNotFound({data : addRolePermission , message: ErrorMessage.GENERAL_ERROR.SERVER_ERROR.message});
  return handleSuccess(SuccessMesage.CREATED("Role Permission")); 
}; 

exports.fetchRolePermissionDetails = async(query) => { 
  const { fetchAll } = query;
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  let options = {};
  
  options = {...options , ...commonFunctions.getPagination({limit , page})};

  if(fetchAll === 'true') {
    delete options.limit;
    delete options.offset;
  }
  const rolePermissionRecord = await commonFunctions.findAll(db.rolePermission, options);
  commonFunctions.dataNotFound({data: rolePermissionRecord , message: ErrorMessage.GENERAL_ERROR.DATA_NOT_FOUND.message});

  return handleSuccess( SuccessMesage.FETCHED("Role Permission"), rolePermissionRecord);
}; 

exports.fetchRolePermissionById = async(id) => { 
  const rolePermissionRecord = await commonFunctions.findOne(db.rolePermission, {condition: {id}});
  commonFunctions.dataNotFound({data: rolePermissionRecord , message: ErrorMessage.GENERAL_ERROR.DATA_NOT_FOUND.message});
  return handleSuccess(SuccessMesage.FETCHED("Role Permisson"), rolePermissionRecord); 
}; 

exports.updateRolePermissionById = async( id, updateBody) => { 
  const rolePermissionRecord = await commonFunctions.findOne(db.rolePermission, { id });
  commonFunctions.dataNotFound({data: rolePermissionRecord , message: ErrorMessage.GENERAL_ERROR.DATA_NOT_FOUND.message});

  const updateRolePermission = await commonFunctions.update(db.rolePermission, { id }, updateBody);
  commonFunctions.dataNotFound({data: updateRolePermission[0] , message: ErrorMessage.GENERAL_ERROR.SERVER_ERROR.message });
  return handleSuccess(SuccessMesage.UPDATED("Role Permission")); 
}; 

exports.deleteRolePermissionById = async(id) => { 
  const removedRolePermission = await commonFunctions.destroy(db.rolePermission, { id });
  commonFunctions.dataNotFound({data: removedRolePermission, message: ErrorMessage.GENERAL_ERROR.DATA_NOT_FOUND.message});

  return handleSuccess(SuccessMesage.DELETED("Role Permission"));
}; 

exports.bulkUpdateRolePermissions = async(body) => {
  const { roleId, permissionIds } = body;

  await commonFunctions.destroy(db.rolePermission, { roleId }, true);
  const rolePermissionFields = permissionIds.map((data) =>({
    roleId: roleId,
    permissionId: data,
  }));
 
  await commonFunctions.create(db.rolePermission, rolePermissionFields, true);
  return handleSuccess(SuccessMesage.CREATED("Role Permission"));
};