const db = require("../models/index");
const response = require("../../utils/response");
const commonFunctions = require("../../utils/commonFunctions");

module.exports = async (req, res, next) => {
  next();

  // TODO: need to work on this logic properlly

  // const roleId = req.userData.role;

  // const userPermission = await commonFunctions.findOne(db.permission, {
  //   condition: {
  //     baseUrl: req.baseUrl,
  //     path: req.route.path,
  //     method: req.method,
  //   },
  // });
  // if (!userPermission) {
  //   return response.unauthorized(res, { message: "Permission not found" });
  // }

  // const rolerPermission = await commonFunctions.findOne(db.rolePermission, {
  //   condition: {
  //     roleId,
  //     permissionId: userPermission.id,
  //   },
  // });
  // if (!rolerPermission) {
  //   return response.forbidden(res, {
  //     message: "You don't have permission to access this",
  //   });
  // }
  // next();
};
