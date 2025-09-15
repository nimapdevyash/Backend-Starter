module.exports = (sequelize, DataTypes) => {
  const userRole = sequelize.define(
    "userRole",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "user_role",
    }
  );

  userRole.associate = (models) => {
    userRole.belongsTo(models.user, { foreignKey: "userId", as: "user" });
    userRole.belongsTo(models.role, { foreignKey: "roleId", as: "role" });
  };

  return userRole;
};
