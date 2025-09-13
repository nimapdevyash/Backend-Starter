/* eslint-disable max-len */
const router = require("express").Router();
const { errorWrapper } = require("../../utils/commonFunctions");

const {
  insertRolePermission,
  retrieveRolePermission,
  retrieveRolePermissionById,
  modifyRolePermission,
  removeRolePermission,
  alterRolePermissions,
} = require("../controllers/rolePermission");
const checkAuth = require("../middlewares/checkAuth");
const permission = require("../middlewares/checkPermission");
const {addRolePermissionValidation , updateRolePermissionValidation, bulkUpdateRolePermissionsValidation} = require("../validators/rolePermission")
const {validate} = require("../middlewares/validator");
const { idValidation } = require("../validators/commonValidators");

router.post( "/", checkAuth, permission, validate(addRolePermissionValidation), errorWrapper(insertRolePermission));
router.get("/", checkAuth, permission, errorWrapper(retrieveRolePermission));
router.get( "/:id", checkAuth, permission,validate(idValidation), errorWrapper(retrieveRolePermissionById));
router.put( "/:id", checkAuth, permission, validate(updateRolePermissionValidation), errorWrapper(modifyRolePermission));
router.delete( "/:id", checkAuth, permission ,validate(idValidation), errorWrapper(removeRolePermission));
router.post("/bulk-change", checkAuth, validate(bulkUpdateRolePermissionsValidation), errorWrapper(alterRolePermissions));

module.exports = router;
