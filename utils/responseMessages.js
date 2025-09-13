/* eslint-disable max-len */
const message = "Records";

exports.ErrorMessage = {
  FAILED: (name = "Operation") => `${name} Failed`,
  EXPIRED: (name = message) => `${name} Is Expired`,
  BLOCKED: (name = message) => `${name} Is Blocked`,
  NOT_FOUND: (name = message) => `${name} Not Found`,
  INACTIVE: (name = message) => `${name} Is Inactive`,
  UNAUTHORIZED: () => "Unauthorized Action",
  SERVER_ERROR: () => "Internal Server Error",
  ALREADY_EXISTS: (name = message) => `${name} Already Exists`,
  LIMIT_EXCEEDED: (name = message) => `${name} Limit Exceeded`,
  ALREADY_VERIFIED: (name = message) => `${name} Already Verified`,
  ALREADY_PROCESSED: (name = message) => `${name} Already Processed`,
  INVALID: (name = "Credentials") => `Invalid ${name}`,
};

exports.SuccessMesage = {
  SENT: (name = message) => `${name} Sent Successfully`,
  CREATED: (name = message) => `${name} Created Successfully`,
  ADDED: (name = message) => `${name} Added Successfully`,
  UPDATED: (name = message) => `${name} Updated Successfully`,
  FETCHED: (name = message) => `${name} Fetched Successfully`,
  DELETED: (name = message) => `${name} Deleted Successfully`,
  VERIFIED: (name = message) => `${name} Verified Successfully`,
  UPLOADED: (name = message) => `${name} Uploaded Successfully`,
  LOGGEDIN: (name ) => ` ${name} Logged In Sucessfully`,
};
