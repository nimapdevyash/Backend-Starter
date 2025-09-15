/* eslint-disable max-len */
const router = require("express").Router();
const { errorWrapper } = require('../../utils/commonFunctions');
const checkAuth = require('../middlewares/checkAuth'); 
const checkPermission = require('../middlewares/checkPermission'); 
const { validate } = require("../middlewares/validator");
const { createUserValidation, updateUserValidation} = require("../validators/user");
const {
    createUser, 
    updateUser, 
    listUsers, 
    removeUser, 
    getUserById,
} = require('../controllers/user');
const { validation_types_enums } = require("../../utils/enums");


router.post( "/", validate({ schema: createUserValidation, type: validation_types_enums.body }), errorWrapper(createUser));

router.put( "/:id", checkAuth, checkPermission, validate({ schema: updateUserValidation, type: validation_types_enums.params_body }), errorWrapper(updateUser));

router.get('/', checkAuth, checkPermission, errorWrapper(listUsers));
router.get('/:id', checkAuth, checkPermission, errorWrapper(getUserById));

router.delete('/:id', checkAuth, checkPermission, errorWrapper(removeUser));

module.exports = router;
