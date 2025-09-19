const httpStatus = require("http-status-codes");
const { validation_types_enums } = require("../../utils/enums");
const { throwIfUnprocessableEntityError } = require("../../utils/customError");
const { ErrorMessage } = require("../../utils/responseMessages");

exports.validate =
  ({ schema, type = validation_types_enums.body }) =>
  async (req, res, next) => {
    try {
      throwIfUnprocessableEntityError({
        condition: !Object.values(validation_types_enums).includes(type),
        message: ErrorMessage.INVALID("Validation Type"),
      });

      await schema.validateAsync(
        type === validation_types_enums.all
          ? { ...req.query, ...req.body, ...req.params }
          : type == validation_types_enums.params_body
          ? { ...req.params, ...req.body }
          : req[type],
        { abortEarly: false } // returns all validation errors at once
      );

      next();
    } catch (error) {
   
      return res.status(httpStatus.BAD_REQUEST).json({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation Error",
        details: error.details
          ? error.details.map((d) => d.message)
          : error.message,
      });
    }
  };
