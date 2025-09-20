const router = require("express").Router();
const { errorWrapper } = require('../../utils/commonFunctions');
const { validate } = require("../middlewares/validator");
const checkAuth = require('../middlewares/checkAuth');
const checkPermission = require('../middlewares/checkPermission');
const {
  addEmailTemplate,
  getTemplateById,
  getTemplateByName,
  listEmailTemplates,
  removeTemplateById,
  updateTemplateById,
} = require("../controllers/emailTemplate");
const { createEmailTemplateValidation, updateEmailTemplateValidation } = require("../validators/emailTemplate");
const { nameValidation, idValidation } = require("../validators/commonValidators");


router.post('/' ,checkAuth,/* checkPermission,*/ validate(createEmailTemplateValidation), errorWrapper(addEmailTemplate));
router.get('/', checkAuth, /* checkPermission,*/ errorWrapper(listEmailTemplates));
router.get('/:id', checkAuth, /* checkPermission,*/ validate(idValidation) ,errorWrapper(getTemplateById));
router.get('/name/:name', checkAuth, /* checkPermission,*/ validate(nameValidation), errorWrapper(getTemplateByName));
router.put('/:id', checkAuth, /* checkPermission,*/ validate(updateEmailTemplateValidation), errorWrapper(updateTemplateById));
router.delete('/:id', checkAuth, /* checkPermission,*/ validate(idValidation), errorWrapper(removeTemplateById));

module.exports = router;