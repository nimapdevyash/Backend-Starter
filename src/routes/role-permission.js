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
const { validation_types_enums } = require("../../utils/enums");

// create
router.post( "/", checkAuth, permission, validate({schema: addRolePermissionValidation}), errorWrapper(insertRolePermission));
router.post("/bulk-change", checkAuth, validate({schema: bulkUpdateRolePermissionsValidation}), errorWrapper(alterRolePermissions));

// read
router.get("/", checkAuth, permission, errorWrapper(retrieveRolePermission));
router.get( "/:id", checkAuth, permission,validate({schema: idValidation , type: validation_types_enums.params}), errorWrapper(retrieveRolePermissionById));

// update
router.put( "/:id", checkAuth, permission, validate({schema: updateRolePermissionValidation , type: validation_types_enums.params_body}), errorWrapper(modifyRolePermission));

// delete
router.delete( "/:id", checkAuth, permission ,validate({schema: idValidation , type: validation_types_enums.params}), errorWrapper(removeRolePermission));

module.exports = router;
