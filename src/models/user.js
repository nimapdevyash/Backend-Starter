const bcrypt = require("bcrypt");
const { CONSTANTS } = require("../../utils/constants");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
    },
    lastName: {
      type: DataTypes.STRING(50),
    },
    mobile: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });

  // Associations
  User.associate = (models) => {
    User.hasMany(models.userRole, { foreignKey: "userId", as: "userRole" });
  };

  // Hooks
  User.addHook(CONSTANTS.HOOK_INSTANCES.BEFORE_CREATE, async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(CONSTANTS.SALT_ROUNDS);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.addHook(CONSTANTS.HOOK_INSTANCES.BEFORE_UPDATE, async (user) => {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(CONSTANTS.SALT_ROUNDS);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Instance methods
  User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
