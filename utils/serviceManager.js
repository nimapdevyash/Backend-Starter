const { idleTransactionsWatcher } = require("../config/connection");
const { syncModels } = require("./dbSync");
const { startBulkMailService } = require("./emailService");
const getRedisClient = require("./redis");

const serviceMap = {
  bulkMailService: startBulkMailService,
  syncModelsService: syncModels,
  idleTransactionWatcherService: idleTransactionsWatcher,
  redis: getRedisClient
};

exports.startServices = ({
  bulkMailService = false,
  syncModelsService = false,
  idleTransactionWatcherService = false,
  redis = true
}) =>
  setTimeout(() => {
    const config = {
      bulkMailService,
      syncModelsService,
      idleTransactionWatcherService,
      redis
    };

    Object.entries(config).forEach(([key, value]) => {
      if (value && typeof serviceMap[key] === "function") {
        console.log(`🚀 Started ${key}...`);
        value !== true ? serviceMap[key](value) : serviceMap[key]();
      }
    });
  }, 5000 ); 
