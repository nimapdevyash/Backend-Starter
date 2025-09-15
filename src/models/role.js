module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define("role", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
    },
  });

  role.associate = (models) => {
    role.belongsToMany(models.permission, {
      through: models.rolePermission,
      foreignKey: "roleId",
      otherKey: "permissionId",
      as: "permissions",
    });
  };

  return role;
};
