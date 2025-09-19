const db = require("../src/models");
const { db_sync_options } = require("./constants");
const { db_sync_options_enums } = require("./enums");

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
        ...(syncType === db_sync_options_enums.alter && { alter: true }),
        ...(syncType === db_sync_options_enums.force && { force: true }),
      });

      if (syncType !== db_sync_options_enums.none)
        console.log(`${model.tableName} is Synced with Type: ${syncType}`);
      else
        console.log(`${model.tableName} is Synced`);
    })
  );

  console.log(`⚠️⚠️ NOTE: The Syncing for DB of type ${syncType} is Active for models : ${modelNames}`);
};
