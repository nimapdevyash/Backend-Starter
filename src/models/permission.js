const { httpMethod_enums } = require("../../utils/enums");

module.exports = (sequelize, DataTypes) => {
  const permission = sequelize.define("permission", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    actionName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    baseUrl: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM(...Object.values(httpMethod_enums)),
      allowNull: false,
    },
  });

  permission.associate = (models) => {
    permission.belongsToMany(models.role, {
      through: models.rolePermission,
      foreignKey: "permissionId",
      otherkey: "roleId",
      as: "permitedRoles",
    });
  };

  return permission;
};
