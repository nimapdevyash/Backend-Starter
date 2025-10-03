 
/* eslint-disable max-len */ 
const { handleSuccess, getPagination } = require('../../utils/commonFunctions');
const { throwIfDataFoundError, throwIfInternalServerError, throwIfNoDataFoundError } = require('../../utils/customError');
const { create, findAll, findByPk, update, destroy } = require('../../utils/dbOperations');
const { ErrorMessage, SuccessMesage } = require('../../utils/responseMessages');
const models = require('../models');

exports.createRolePermission = async (rolePermissionData) => {
  // Check if record already exists
  const existingRecord = await findAll({
    model: models.rolePermission,
    condition: {
      roleId: rolePermissionData.roleId,
      permissionId: rolePermissionData.permissionId,
    },
  });

  throwIfDataFoundError({
    condition: existingRecord.length > 0,
    message: ErrorMessage.ALREADY_EXISTS('Role Permission'),
  });

  const addedRecord = await create({ model: models.rolePermission, body: rolePermissionData });
  throwIfInternalServerError({
    condition: !addedRecord,
    message: ErrorMessage.SERVER_ERROR(),
  });

  return handleSuccess({ message: SuccessMesage.CREATED('Role Permission') });
}; 

exports.fetchRolePermissionDetails = async ({ page = 1, limit = 10, fetchAll }) => {
  const options = fetchAll === 'true' ? {} : getPagination({ page, limit });

  const rolePermissionRecords = await findAll({
    model: models.rolePermission,
    ...options,
  });
  throwIfNoDataFoundError({
    condition: rolePermissionRecords || rolePermissionRecords.length === 0,
    message: ErrorMessage.NOT_FOUND('Role Permission Records'),
  });

  return handleSuccess({
    message: SuccessMesage.FETCHED('Role Permission'),
    data: rolePermissionRecords,
  });
}; 

exports.fetchRolePermissionById = async ({ id }) => {
  const record = await findByPk({ model: models.rolePermission, id });
  console.log(record);
  throwIfNoDataFoundError({
    condition: record,
    message: ErrorMessage.INVALID('Role Permission Id'),
  });
  console.log(record);
  return handleSuccess({ message: SuccessMesage.FETCHED('Role Permission'), data: record });
}; 

exports.updateRolePermissionById = async ({ id, updateData }) => {
  const existingRecord = await findByPk({ model: models.rolePermission, id });
  throwIfNoDataFoundError({
    condition: existingRecord,
    message: ErrorMessage.INVALID('Role Permission Id'),
  });

  const updatedRecord = await update({
    model: models.rolePermission,
    condition: { id },
    updatedBody: updateData,
    individualHooks: true,
  });

  throwIfInternalServerError({
    condition: !updatedRecord[0],
    message: ErrorMessage.SERVER_ERROR(),
  });

  return handleSuccess({ message: SuccessMesage.UPDATED('Role Permission') });
}; 

exports.deleteRolePermissionById = async ({ id }) => {
  const removedRecord = await destroy({ model: models.rolePermission, condition: { id } });
  throwIfNoDataFoundError({
    condition: removedRecord,
    message: ErrorMessage.INVALID('Role Permission Id'),
  });

  return handleSuccess({ message: SuccessMesage.DELETED('Role Permission') });
}; 

exports.bulkUpdateRolePermissions = async ({ roleId, permissionIds }) => {
  // Delete existing records
  await destroy({ model: models.rolePermission, condition: { roleId }, force: true });

  // Prepare new records
  const rolePermissionFields = permissionIds.map((permissionId) => ({
    roleId,
    permissionId,
  }));
 
  // Bulk create
  const createdRecords = await create({ model: models.rolePermission, body: rolePermissionFields, bulk: true });
  throwIfInternalServerError({
    condition: !createdRecords,
    message: ErrorMessage.SERVER_ERROR(),
  });

  return handleSuccess({ message: SuccessMesage.CREATED('Role Permission') });
};
