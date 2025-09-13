const {
  createRolePermission,
  fetchRolePermissionDetails,
  fetchRolePermissionById,
  updateRolePermissionById,
  deleteRolePermissionById,
  bulkUpdateRolePermissions,
} = require('../services/rolePermission'); 
const response = require('../../utils/response'); 

exports.insertRolePermission = async(req, res) => { 
  const result = await createRolePermission(req.body); 
  return response.created(res, result); 
}; 

exports.retrieveRolePermission = async(req, res) => { 
  const result = await fetchRolePermissionDetails(req.query); 
  return response.ok(res, result); 
}; 

exports.retrieveRolePermissionById = async(req, res) => { 
  const { id } = req.params; 
  const result = await fetchRolePermissionById(id); 
  return response.ok(res, result); 
}; 

exports.modifyRolePermission = async(req, res) => { 
  const { id } = req.params; 
  const { roleId, permissionId } = req.body;
  const result = await updateRolePermissionById(id, { roleId, permissionId }); 
  return response.ok(res, result); 
}; 

exports.removeRolePermission = async(req, res) => { 
  const { id } = req.params; 
  const result = await deleteRolePermissionById(id); 
  return response.ok(res, result); 
}; 

exports.alterRolePermissions = async(req, res) => {
  let body = req.body;
  const result = await bulkUpdateRolePermissions(body);
  return response.ok(res, result);
};