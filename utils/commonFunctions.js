const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

// -------- common utility functions --------

exports.generateSecureOTP = () => crypto.randomInt(100000, 1000000).toString();
exports.generateReferenceCode = () => uuidv4() ;
exports.toBool = (val) => ["true", "1", "yes"].includes(String(val).toLowerCase());

exports.populateTemplate = ({ templateString, data }) => {
  return templateString.replace(/<<([^>]+)>>/g, (_, key) => {
    return key in data ? data[key] : "";
  });
};

// -------- request response common functions --------

exports.getPagination = ({ page = 1, limit = 10 }) => {
  const offset = (Number(page, 10) - 1) * Number(limit);
  return { offset, limit: Number(limit) };
};

exports.paginateResponse = ({ page, limit, response }) => {
  return {
    page: Number(page),
    limit: Number(limit),
    totalCount: response.count,
    totalPages: Math.ceil(response.count / Number(limit)),
    response: response.rows,
  };
};

exports.handleSuccess = ({ message, data = {} }) => {
  const response = {
    success: true,
    message: message,
    data,
  };
  return response;
}; 

exports.errorWrapper =
  (fn) =>
  (...args) =>
    fn(...args).catch(args[2]);