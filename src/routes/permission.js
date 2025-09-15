/* eslint-disable max-len */
const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/commonFunctions'); 

const {
  insertPermission, 
  retrievePermission, 
  retrievePermissionById, 
  modifyPermission, 
  removePermission, 
} = require('../controllers/permission'); 
const checkAuth = require("../middlewares/checkAuth"); 
const {validate} = require("../middlewares/validator");
const permission = require("../middlewares/checkPermission");
const  { addPermissionValidation, updatePermissionValidation, permissionIdValidation } = require("../validators/permission");
const { idValidation } = require('../validators/commonValidators');
const { validation_types_enums } = require('../../utils/enums');

// create
router.post('/',checkAuth, validate({schema: addPermissionValidation }), errorWrapper(insertPermission)); 

// read
router.get('/', checkAuth, permission, errorWrapper(retrievePermission)); 
router.get('/:id',checkAuth, permission, validate({schema: idValidation , type: validation_types_enums.params}),  errorWrapper(retrievePermissionById)); 

// update
router.put( "/:id", checkAuth, permission, validate({ schema: updatePermissionValidation, type: validation_types_enums.params_body, }), errorWrapper(modifyPermission)); 

// delete
router.delete('/:id', checkAuth, permission, validate({schema: idValidation , type: validation_types_enums.params}), errorWrapper(removePermission)); 

module.exports = router; 