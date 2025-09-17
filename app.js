require('dotenv').config();
require("./config/connection"); 

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { CustomError } = require('./utils/customError');
const fs = require('fs')
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./docs/swaggerSpec");
const indexRouter = require('./src/routes/index');
const { insertIntoErrorLogger } = require('./utils/errorLogger');
const { startServices } = require('./utils/serviceManager');
const { db_sync_options_enums } = require('./utils/enums');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(async function(err, req, res, next) {
  console.log(err)
  if (err.status === 500 || !(err instanceof CustomError)) {
    await insertIntoErrorLogger({
      message: err.message,
      stack: err.stack,
      originalUrl: req.originalUrl, 
      method: req.method, 
      userData: req.userData,
    }
    );
  }
  // set locals, only providing error in development
  res.locals.message = err.message;

  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ statusCode: err.statusCode, error: err.message });
  }
  // render the error page
  res.status(err.status || 500).send({
    statusCode: err.statusCode,
    error: err.name,
    keyValue: JSON.stringify(err.keyValue),
    message: err.message,
  });
});


// create public directory if not exist
const publicDir = "public/uploads";
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive:true });
}

/**
 * NOTE: this is a serviceManager Service that manages all the services in a centralized manner 
 * - pass the exact paramters to pass it directlly to the service if needed else just true will do
 * - It waits 5 seconds before starting the services, db and redis will be connected at that point and the applicatioin will be ready to work on this services.
 */

startServices({
  redis: true,
  bulkMailService: true,
  idleTransactionWatcherService: true,
  updatePropertyListingService: true,
  // syncModelsService: { modelNames: ["emailLogs"], syncType: db_sync_options_enums.alter },
});

module.exports = app;
