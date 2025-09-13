module.exports = async (req,res, next) => {
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

};