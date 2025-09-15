const constants = require("../../utils/constants");

module.exports = (sequelize, DataTypes) => {
  const userToken = sequelize.define(
    "userToken",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
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
    userToken.belongsTo(model.user, { foreignKey: "userId" });
  };

  return userToken;
};
