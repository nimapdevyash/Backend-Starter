const {
  createRole,
  fetchRoleDetails,
  fetchRoleById,
  updateRoleById,
  deleteRoleById,
} = require('../services/role'); 
const response = require('../../utils/response'); 

exports.insertRole = async(req, res) => { 
  const result = await createRole(req.body); 
  return response.created(res, result); 
}; 

exports.retrieveRole = async(req, res) => { 
  const result = await fetchRoleDetails(req.query); 
  return response.ok(res, result); 
}; 

exports.retrieveRoleById = async(req, res) => { 
  const { id } = req.params; 
  const result = await fetchRoleById({id}); 
  return response.ok(res, result); 
}; 

exports.modifyRole = async(req, res) => { 
  const { id } = req.params; 
  const updatedBody = req.body;
  const result = await updateRoleById({id, updatedBody}); 
  return response.ok(res, result); 
}; 

exports.removeRole = async(req, res) => { 
  const { id } = req.params; 
  const result = await deleteRoleById({id}); 
  return response.ok(res, result); 
}; 
