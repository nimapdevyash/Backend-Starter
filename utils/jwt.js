const jwt = require('jsonwebtoken');
const constants = require('./constants');

exports.generateToken = (payload) => jwt.sign(payload, constants.JWT.SECRET, {
  algorithm: constants.JWT.ALGORITH,
  expiresIn: constants.JWT.EXPIRES_IN
});

exports.verifyToken = (token) => jwt.verify(token, constants.JWT.SECRET);