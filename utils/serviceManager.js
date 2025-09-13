const { idleTransactionsWatcher } = require("../config/connection");
const { updatePropertyListing } = require("./cron/propertyListing");
const { syncModels } = require("./dbSync");
const { startBulkMailService } = require("./sendBulkMail");

const serviceMap = {
  bulkMailService: startBulkMailService,
  updatePropertyListingService: updatePropertyListing,
  syncModelsService: syncModels,
  idleTransactionWatcherService: idleTransactionsWatcher,
};

exports.startServices = ({
  bulkMailService = false,
  updatePropertyListingService = false,
  syncModelsService = false,
  idleTransactionWatcherService = false,
}) =>
  setTimeout(() => {
    const config = {
      bulkMailService,
      updatePropertyListingService,
      syncModelsService,
      idleTransactionWatcherService,
    };

    Object.entries(config).forEach(([key, value]) => {
      if (value && typeof serviceMap[key] === "function") {
        console.log(`🚀 Started ${key}...`);
        value !== true ? serviceMap[key](value) : serviceMap[key]();
      }
    });
  }, 5000 ); 
