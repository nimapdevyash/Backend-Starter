const { idleTransactionsWatcher } = require("../config/connection");
const { syncModels } = require("./dbSync");
const { startBulkMailService } = require("./emailService");

const serviceMap = {
  bulkMailService: startBulkMailService,
  syncModelsService: syncModels,
  idleTransactionWatcherService: idleTransactionsWatcher,
};

exports.startServices = ({
  bulkMailService = false,
  syncModelsService = false,
  idleTransactionWatcherService = false,
}) =>
  setTimeout(() => {
    const config = {
      bulkMailService,
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
