module.exports = (sequelize, DataTypes) => {
  const rolePermission = sequelize.define(
    "rolePermission",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "role_permission",
    }
  );

  return rolePermission;
};
