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
 
router.post('/', checkAuth, checkPermission, validate(addRoleValidation), errorWrapper(insertRole));
router.get('/', checkAuth, checkPermission, errorWrapper(retrieveRole)); 
router.get('/:id', checkAuth, checkPermission, validate(idValidation), errorWrapper(retrieveRoleById)); 
router.put('/:id', checkAuth, checkPermission, validate(updateRoleValidation), errorWrapper(modifyRole)); 
router.delete('/:id', checkAuth, checkPermission, validate(idValidation), errorWrapper(removeRole)); 

module.exports = router; 
