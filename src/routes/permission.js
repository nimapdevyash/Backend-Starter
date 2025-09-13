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

router.post('/',checkAuth, validate(addPermissionValidation), errorWrapper(insertPermission)); 
router.get('/', checkAuth, permission, errorWrapper(retrievePermission)); 
router.get('/:id',checkAuth, permission, validate(idValidation),  errorWrapper(retrievePermissionById)); 
router.put('/:id', checkAuth, permission, validate(updatePermissionValidation), errorWrapper(modifyPermission)); 
router.delete('/:id', checkAuth, permission, validate(idValidation), errorWrapper(removePermission)); 

module.exports = router; 