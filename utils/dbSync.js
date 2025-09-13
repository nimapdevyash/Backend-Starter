const db = require("../src/models");
const { db_sync_options } = require("./constants");

exports.syncModels = async ({
  modelNames = [],
  syncType = db_sync_options.none,
}) => {
  if (!modelNames.length) return;

  await Promise.all(
    modelNames.map(async (modelName) => {
      const model = db[modelName];
      if (!model) {
        console.warn(`⚠️ Model "${modelName}" not found in db.`);
        return;
      }

      await model.sync({
        ...(syncType === db_sync_options.alter && { alter: true }),
        ...(syncType === db_sync_options.force && { force: true }),
      });

      if (syncType !== db_sync_options.none)
        console.log(`${model.tableName} is Synced with Type: ${syncType}`);
      else
        console.log(`${model.tableName} is Synced`);
    })
  );

  console.log(`⚠️⚠️ NOTE: The Syncing for DB of type ${syncType} is Active for models : ${modelNames}`);
};
