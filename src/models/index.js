"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const sequelize = require("../../config/sequelize");

const basename = path.basename(__filename);
const models = {};

// Read all model files in this directory
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // skip hidden files
      file !== basename && // skip index.js
      file.slice(-3) === ".js" && // only .js files
      !file.endsWith(".test.js") // skip test files
    );
  })
  .forEach((fileName) => {
    try {
      const model = require(path.join(__dirname, fileName))(
        sequelize,
        Sequelize.DataTypes
      );

      if (!model.name) {
        throw new Error(`Model in ${fileName} has no name defined`);
      }

      models[model.name] = model;
    } catch (err) {
      console.error(`❌ Failed to load model file: ${fileName}`, err);
    }
  });

// Run associations if defined
Object.keys(models).forEach((modelName) => {
  if (typeof models[modelName].associate === "function") {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

console.log("✅ Loaded models:", Object.keys(models).join(", "));

module.exports = models;
