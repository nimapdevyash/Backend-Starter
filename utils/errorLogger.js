const commonFunctions = require("./commonFunctions");
const db = require("../src/models");
const { create } = require("./dbOperations");
const models = require("../src/models");

exports.insertIntoErrorLogger = async ({
  message,
  stack,
  originalUrl,
  method,
  userData,
}) => {
  try {
    await create({
      model: models.errorLogger, 
      body: {
      message,
      method,
      baseUrl: originalUrl,
      userData: typeof userData === 'object' ? JSON.stringify(userData) : userData,
      meta: stack,
    }});
  } catch (error) {
    console.log(
      "Error While inserting Error Information in Error Logger => ",
      error
    );
  }
};
