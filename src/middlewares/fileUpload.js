const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../models/index");
const response = require("../../utils/response");
const commonFunctions = require("../../utils/commonFunctions");
const constants = require("../../utils/constants");

const folderPath = path.join("public", "uploads");
const allowedMaxSize = constants.FILE.MAX_ALLOWED_FILE_SIZE;
const allowedFileTypes = constants.FILE.ALLOWED_FILE_TYPES.map((ext) =>
  ext.toLowerCase()
);

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, folderPath),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${extension}`);
  },
});

function checkFileType(file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  allowedFileTypes.includes(ext)
    ? cb(null, true)
    : cb( new Error( "Invalid file type. Allowed types: " + allowedFileTypes.join(", ")));
}

exports.generateUploadMiddleware =
  (fieldConfig = [{ name: "files", maxCount: 10 }]) =>
  (req, res, next) => {

    const upload = multer({
      storage,
      limits: { fileSize: allowedMaxSize * 1024 * 1024 },
      fileFilter: (req, file, cb) => checkFileType(file, cb),
    }).fields(fieldConfig);

    upload(req, res, async (err) => {
      if (err) return response.badRequest(res, { message: err.message });

      if (!req.files || Object.keys(req.files).length === 0) {
        req.uploadedFiles = null;
        return next();
      }

      const filesData = {};

      for (const fieldname in req.files) {
        for (const file of req.files[fieldname]) {
          const extension = path.extname(file.originalname).slice(1);
          const filePath = file.path.replace("public", "").replace(/\\/g, "/");

          if (!filesData[fieldname]) filesData[fieldname] = [];

          filesData[fieldname].push({
            url: filePath,
            mimeType: file.mimetype,
            extension,
          });
        }
      }

      try {
        const uploadedFiles = {};

        for (const fieldname of Object.keys(filesData)) {
          uploadedFiles[fieldname] = await commonFunctions.create(
            db.fileUpload,
            filesData[fieldname],
            true
          );
        }

        req.uploadedFiles = {};

        for (const fieldname of Object.keys(uploadedFiles)) {
          req.uploadedFiles[fieldname] = uploadedFiles[fieldname].map(
            (file) => file.id
          );
        }

        return next();
      } catch (error) {
        return response.badRequest(res, { error: error.message });
      }
    });
  };
