const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/commonFunctions'); 
const { 
  insertRole, 
  retrieveRole, 
  retrieveRoleById, 
  modifyRole, 
  removeRole, 
} = require('../controllers/role'); 
const checkAuth = require('../middlewares/checkAuth'); 
const checkPermission = require('../middlewares/checkPermission'); 
const { addRoleValidation , updateRoleValidation } = require("../validators/role")
const { validate } = require("../middlewares/validator");
const { idValidation } = require('../validators/commonValidators');
const { validation_types_enums } = require('../../utils/enums');
 
// create
router.post('/', checkAuth, checkPermission, validate({schema: addRoleValidation}), errorWrapper(insertRole));

// read
router.get('/', checkAuth, checkPermission, errorWrapper(retrieveRole)); 
router.get('/:id', checkAuth, checkPermission, validate({schema: idValidation , type: validation_types_enums.params}), errorWrapper(retrieveRoleById)); 

// update
router.put('/:id', checkAuth, checkPermission, validate({schema: updateRoleValidation, type: validation_types_enums.params_body}), errorWrapper(modifyRole)); 

// delete
router.delete('/:id', checkAuth, checkPermission, validate({schema: idValidation, type: validation_types_enums.params}), errorWrapper(removeRole)); 

module.exports = router; 
