module.exports = (sequelize, DataTypes) => {
  const rolePermission = sequelize.define(
    "rolePermission",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "role_permission",
    }
  );

  return rolePermission;
};
