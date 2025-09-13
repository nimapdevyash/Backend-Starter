 
/* eslint-disable max-len */
const db = require('../models'); 
const { Op } = require('sequelize');
const { InternalServerError } = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');
const { ErrorMessage, SuccessMesage } = require('../../utils/responseMessages');

exports.createRole = async(roleData) => { 
  const roleCreated = await commonFunctions.create(db.role, roleData);
  commonFunctions.dataNotFound({data: roleCreated , message: ErrorMessage.GENERAL_ERROR.SERVER_ERROR.message})
  return handleSuccess(SuccessMesage.CREATED("Role") , {roleCreated});
}; 

exports.fetchRoleDetails = async(query) => { 
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const search = query.search || '';
  let options = {};
  
  options.condition = { 
    ...(search && {
      [Op.or] : [
        { name : { [Op.iLike]: `%${search}%` } },
        { description : { [Op.iLike]: `%${search}%` } },
      ],
    }),
  };

  options = {...options , ...commonFunctions.getPagination({page , limit})};

  const roleRecords = await commonFunctions.findAll(db.role, options);
  commonFunctions.dataNotFound({data: roleRecords.count , message: ErrorMessage.GENERAL_ERROR.DATA_NOT_FOUND.message});
  return handleSuccess(SuccessMesage.FETCHED("Role"), roleRecords); 
}; 

exports.fetchRoleById = async(id) => { 

  const options = {};
  options.condition = { id: id, deletedAt: null };
  options.include = [{ model: db.permission, as: "permissions", through: { attributes: [] } }];

  const roleDetails = await commonFunctions.findOne(db.role, options);
  commonFunctions.dataNotFound({data: roleDetails , message: ErrorMessage.ROLE_ERROR.NOT_FOUND.message});

  return handleSuccess(SuccessMesage.FETCHED("Role"), roleDetails);
}; 

exports.updateRoleById = async(id, updateBody) => { 
  const roleFound = await commonFunctions.findOne(db.role, { id });
  commonFunctions.dataNotFound({data: roleFound , message: ErrorMessage.GENERAL_ERROR.SERVER_ERROR.message})

  const updateRole = await commonFunctions.update(db.role, { id }, updateBody, {individualHooks: true}); 

  if (updateRole[0] !== 1) { 
    throw new InternalServerError(ErrorMessage.GENERAL_ERROR.SERVER_ERROR.message); 
  } 
  return handleSuccess(SuccessMesage.UPDATED("Role"));
}; 

exports.deleteRoleById = async(id) => { 
  
  const removedRole = await commonFunctions.destroy(db.role, { id });
  commonFunctions.dataNotFound({data: removedRole , message: ErrorMessage.ROLE_ERROR.NOT_FOUND.message});

  return handleSuccess(SuccessMesage.DELETED("Role"));
}; 
