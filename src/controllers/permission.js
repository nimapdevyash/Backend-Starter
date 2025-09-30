const { 
  createPermission, 
  fetchPermissionDetails, 
  fetchPermissionById, 
  updatePermissionById, 
  deletePermissionById, 
} = require('../services/permission'); 
const response = require('../../utils/response'); 

exports.insertPermission = async(req, res) => { 
  const result = await createPermission(req.body); 
  return response.created(res, result); 
}; 

exports.retrievePermission = async(req, res) => { 
  const result = await fetchPermissionDetails(req.query); 
  return response.ok(res, result); 
}; 

exports.retrievePermissionById = async(req, res) => { 
  const { id } = req.params; 
const result = await fetchPermissionById({id}); 
  return response.ok(res, result); 
}; 

exports.modifyPermission = async(req, res) => { 
  const { id } = req.params; 
  const result = await updatePermissionById({id, updateData:req.body}); 
  return response.ok(res, result); 
}; 

exports.removePermission = async(req, res) => { 
  const { id } = req.params; 
  const result = await deletePermissionById({id}); 
  return response.ok(res, result); 
}; 
