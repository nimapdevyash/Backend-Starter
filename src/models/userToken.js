const constants = require("../../utils/constants");

module.exports = (sequelize, DataTypes) => {
  const userToken = sequelize.define(
    "userToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "user_token",
    }
  );
  userToken.associate = (model) => {
    userToken.belongsTo(model.user, { foreignKey: "userId", });
  };

  return userToken;
};
