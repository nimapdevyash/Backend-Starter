const { Sequelize } = require('sequelize');
const DB = require('./config');

  
const sequelize = new Sequelize({
  host: DB.HOST,
  database: DB.DATABASE,
  username: DB.USERNAME,
  password: DB.PASSWORD,
  port: DB.PORT,
  dialect: DB.DIALECT,
  define: {
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    paranoid: true,
  },
  logging: DB.LOGGING
});

module.exports = sequelize;