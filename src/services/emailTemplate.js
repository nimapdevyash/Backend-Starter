const {handleSuccess} = require("../../utils/commonFunctions");
const models = require("../models");
const { InternalServerError, BadRequestError, throwIfDataFoundError } = require('../../utils/customError');
const {ErrorMessage, SuccessMesage} = require("../../utils/responseMessages");
const { findOne, create, findAll } = require("../../utils/dbOperations");

const message = "Email Template";


exports.addEmailTemplate = async ({ name, subject, html, userId }) => {
  const templateRecord = await findOne({model: models.emailTemplate, condition: { name } });
  throwIfDataFoundError({ condition: templateRecord, message: ErrorMessage.ALREADY_EXISTS("Name")});

  const templateAdded = await create({ model:models.emailTemplate, body: { createdBy: userId, updatedBy: userId, html, name, subject }});

  if (!templateAdded)  throw new InternalServerError() ;

  return handleSuccess(SuccessMesage.CREATED(message));
};

exports.listEmailTemplates = async (query) => {
  
    let page = Number(query.page) || 1;
    let limit = Number(query.limit) || 10; 

  const templateRecord = await findAll(models.emailTemplate, {
    ...commonFunctions.getPagination({
      page,
      limit,
    }),
  }); 
  commonFunctions.dataNotFound({ data: templateRecord, message: ErrorMessage.GENERAL_ERROR.DATA_NOT_FOUND.message });

  return handleSuccess( SuccessMesage.FETCHED(message), templateRecord);
};

exports.getTemplateById = async ({ id }) => {
  const templateRecord = await commonFunctions.findByPk(models.emailTemplate, id);
  commonFunctions.dataNotFound({ data: templateRecord, message: ErrorMessage.GENERAL_ERROR.DATA_NOT_FOUND.message });

  return handleSuccess(SuccessMesage.FETCHED(message), templateRecord);
};

exports.getTemplateByName = async ({ name }) => {
  const templateRecord = await commonFunctions.findOne(models.emailTemplate, {name});
  commonFunctions.dataNotFound({ data: templateRecord, message: ErrorMessage.GENERAL_ERROR.DATA_NOT_FOUND.message });

  return handleSuccess(SuccessMesage.FETCHED(message), templateRecord);
};

exports.updateTemplateById = async (id, updateBody) => {
  const updatedTemplate = await commonFunctions.update(models.emailTemplate, { id }, updateBody);

  if(!updatedTemplate[0]) throw new BadRequestError(`Email Template with id ${id} not found`);
  return handleSuccess(SuccessMesage.UPDATED(message));
};

exports.removeTemplateById = async ({id}) => {
  const removedTemplate = await commonFunctions.destroy(models.emailTemplate, { id, });
  commonFunctions.dataNotFound({ data: removedTemplate, message: ErrorMessage.GENERAL_ERROR.DATA_NOT_FOUND.message });

  return handleSuccess(SuccessMesage.DELETED(message));
};