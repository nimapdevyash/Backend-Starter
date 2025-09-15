const Joi = require("joi");
const { CONSTANTS } = require("../utils/constants");
const { toBool } = require("../utils/commonFunctions");
require("dotenv").config();
const env = process.env.NODE_ENV;

const DB = {
  USERNAME: env == CONSTANTS.ENVIROMENTS.test ? "root" : process.env.DB_USERNAME,
  PASSWORD: env == CONSTANTS.ENVIROMENTS.test ? "root" : process.env.DB_PASSWORD,
  DATABASE: env == CONSTANTS.ENVIROMENTS.test ? "greenland_test_db" : process.env.DB_DATABASE_NAME,
  HOST: env == CONSTANTS.ENVIROMENTS.test ? "127.0.0.1" : process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  DIALECT: env == CONSTANTS.ENVIROMENTS.test ? "postgres" : process.env.DB_DIALECT,
  POOL: {
    MAX: parseInt(process.env.DB_POOL_MAX) || 20,
    MIN: parseInt(process.env.DB_POOL_MIN) || 5,
    ACQUIRE: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
    IDLE: parseInt(process.env.DB_POOL_IDLE) || 10000,
  },
  RETRY: {
    MAX: parseInt(process.env.DB_RETRY) || 3,
  },
  LOGGING: toBool(process.env.DB_LOGGING),
};

const verifyDB = () => {
  Joi.object({
    USERNAME: Joi.string().required(),
    PASSWORD: Joi.string().required(),
    DATABASE: Joi.string().required(),
    HOST: Joi.string().required(),
    PORT: Joi.string().required(),
    DIALECT: Joi.string().valid(...Object.values(CONSTANTS.DB.DIALECTS)),
    POOL: {
      MAX: Joi.number(),
      MIN: Joi.number(),
      ACQUIRE: Joi.number(),
      IDLE: Joi.number(),
    },
    RETRY: {
      MAX: Joi.number(),
    },
    LOGGING: Joi.boolean().required()
  })
    .validateAsync(DB)
    .then(() => console.log("Running Envirenment => ", env))
    .catch((error) => {
      throw new Error("wrong values for DB Connection => " + error.message);
    });
};

verifyDB();

module.exports = DB;
