module.exports = (sequelize, DataTypes) => {
  const errorLogger = sequelize.define(
    "errorLogger",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message: {
        type: DataTypes.STRING,
      },
      meta: {
        type: DataTypes.TEXT,
      },
      method: {
        type: DataTypes.STRING(50),
      },
      baseUrl: {
        type: DataTypes.STRING(50),
      },
      userData: {
        type: DataTypes.STRING,
      },
      statusCode: {
        type: DataTypes.STRING(50),
      },
    },
    {
      tableName: "error_logger",
    }
  );

  return errorLogger;
};
