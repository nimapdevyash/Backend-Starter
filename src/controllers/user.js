/* eslint-disable max-len */
const userService = require("../services/user");
const response = require("../../utils/response");

exports.createUser = async (req, res) => {
  const result = await userService.createUser(req.body);
  return response.created(res, result);
};

exports.registerUser = async (req, res) => {
  const result = await userService.registerUser(req.body);
  return response.created(res, result);
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const userData = req.body;
  const result = await userService.updateUser({id, userData});
  return response.created(res, result);
};

exports.listUsers = async (req, res) => {
  const result = await userService.listUsers(req.query);
  return response.ok(res, result);
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;
  const result = await userService.getUserById({id});
  return response.ok(res, result);
};

exports.removeUser = async (req, res) => {
  const result = await userService.removeUser(req.params);
  return response.ok(res, result);
};