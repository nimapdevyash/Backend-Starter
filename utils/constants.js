require("dotenv").config();
const { toBool } = require("./commonFunctions");

let CONSTANTS = {

  PORT: process.env.PORT,
  CRON: process.env.SUBSCRIPTION_PROPERTY_CRON || "0 0 * * *", // runs everyday at 12 am

  JWT: {
    SECRET: process.env.JWT_SECRET || "qwertyuiopasdfghjklzxcvbnm",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "12h",
    ALGORITH: process.env.JWT_ALGORITHM || "HS256",
  },

  OTP_VALID_TIME_MINUTES: Number(process.env.OTP_VALID_TIME_MINUTES || 5),
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS || 10),

  FILE: {
    ALLOWED_FILE_TYPES: [".png", ".jpg", ".jpeg", ".pdf"],
    MAX_ALLOWED_FILE_SIZE: Number(process.env.MAX_ALLOWED_FILE_SIZE || 2),
  },

  EMAIL: {
    TEMPLATE: {
      OTP: "otp"
    },
    USER: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PASSWORD,
    HOST: process.env.EMAIL_HOST,
    PORT: 587,
    ISSECURE: false,
  },

  email_templates: {
    aggrement: "AGREEMENT",
    expired_subscription: "EXPIRED_SUBSCRIPTION_EMAIL",
    soon_to_expire_subscription: "SOON_TO_EXPIRE_SUBSCRIPTION",
  },

  ACTION_TYPES: {
    VERIFY: {
      EMAIL: "EMAIL_VERIFICATION",
      MOBILE: "MOBILE_VERIFICATION",
    },
    PASSWORD: {
      FORGOT: "FORGOT_PASSWORD",
      RESET: "RESET_PASSWORD",
    },
  },
  HOOK_INSTANCES: {
    BEFORE_VALIDATE: "beforeValidate",
    AFTER_VALIDATE: "afterValidate",
    BEFORE_CREATE: "beforeCreate",
    AFTER_CREATE: "afterCreate",
    BEFORE_DESTROY: "beforeDestroy",
    AFTER_DESTROY: "afterDestroy",
    BEFORE_UPDATE: "beforeUpdate",
    AFTER_UPDATE: "afterUpdate",
    BEFORE_SAVE: "beforeSave",
    AFTER_SAVE: "afterSave",
    BEFORE_BULK_CREATE: "beforeBulkCreate",
    AFTER_BULK_CREATE: "afterBulkCreate",
    BEFORE_BULK_UPDATE: "beforeBulkUpdate",
    AFTER_BULK_UPDATE: "afterBulkUpdate",
    BEFORE_BULK_DESTROY: "beforeBulkDestroy",
    AFTER_BULK_DESTROY: "afterBulkDestroy",
    BEFORE_FIND: "beforeFind",
    AFTER_FIND: "afterFind",
    BEFORE_COUNT: "beforeCount",
    BEFORE_SYNC: "beforeSync",
    AFTER_SYNC: "afterSync",
    BEFORE_DEFINE: "beforeDefine",
    AFTER_DEFINE: "afterDefine",
    BEFORE_UPSERT: "beforeUpsert",
    AFTER_UPSERT: "afterUpsert",
  },

  DB: {
    DIALECTS: {
      postgres: "postgres",
      mysql: "mysql",
    },
  },

  APP_CONFIG: {
    MAX_ALLOWED_FILE_SIZE: "MAX_ALLOWED_FILE_SIZE",
    OTP_VALID_TIME: "OTP_VALID_TIME",
    ALLOWED_FILE_TYPES: "ALLOWED_FILE_TYPE",
  },

  ENVIROMENTS: {
    development: "DEVELOPMENT",
    test: "TEST",
    production: "PRODUCTION",
  },

  REDIS: {
    HOST: process.env.REDIS_HOST || "127.0.0.1",
    PORT: Number(process.env.REDIS_PORT || 6379),
    PASSWORD: process.env.REDIS_PASSWORD,
    ENABLED: toBool(process.env.REDIS_ENABLED || "true"), // toggle Redis usage
    RETRIES: Number(process.env.REDIS_MAX_RETRIES || 10), // max reconnect attempts
    DELAY: Number(process.env.REDIS_RETRY_DELAY || 3000), // max retry delay in ms
  },
};

module.exports = { CONSTANTS };