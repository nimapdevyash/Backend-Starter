const response = require("../../utils/response");
const {
  addEmailTemplate,
  getTemplateById,
  getTemplateByName,
  listEmailTemplates,
  removeTemplateById,
  updateTemplateById,
} = require("../services/emailTemplate");
exports.addEmailTemplate = async (req, res) => {
  const { html, name ,subject} = req.body;
  const result = await addEmailTemplate({html,name,subject, userId : req.userData.id});
  return response.created(res, result);
};

exports.listEmailTemplates = async (req, res) => {
  const result = await listEmailTemplates(req.query);
  return response.ok(res, result);
};

exports.getTemplateById = async (req, res) => {
  const {id} = req.params
  const result = await getTemplateById({id});
  return response.ok(res, result);
};

exports.getTemplateByName = async (req, res) => {
  const result = await getTemplateByName(req.params);
  return response.ok(res, result);
};

exports.updateTemplateById = async (req, res) => {
  const id = req.params.id;
  const result = await updateTemplateById({id, updateBody:{...req.body , updatedBy : req.userData.id}});
  return response.ok(res, result);
};

exports.removeTemplateById = async (req, res) => {
  const result = await removeTemplateById(req.params);
  return response.ok(res, result);
};