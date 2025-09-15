const jwt = require('jsonwebtoken');
const {CONSTANTS} = require('./constants');

exports.generateToken = (payload) => jwt.sign(payload, CONSTANTS.JWT.SECRET, {
  algorithm: CONSTANTS.JWT.ALGORITH,
  expiresIn: CONSTANTS.JWT.EXPIRES_IN
});

exports.verifyToken = (token) => jwt.verify(token, CONSTANTS.JWT.SECRET);