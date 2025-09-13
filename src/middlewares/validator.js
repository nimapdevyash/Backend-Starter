const httpStatus = require("http-status");

exports.validate =
  ({ schema, obj }) =>
  async (req, res, next) => {
    try {
      console.log("Object to verrify : ", obj);
      await schema.validateAsync(obj);
      next();
    } catch (error) {
      return res.status(httpStatus.status.BAD_REQUEST).json({
        message: error.message,
        statusCode: httpStatus.status.BAD_REQUEST,
      });
    }
  };
