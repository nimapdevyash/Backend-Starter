module.exports = (sequelize, DataTypes) => {
  const otp = sequelize.define("otp", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId : {
      type: DataTypes.INTEGER,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recipientField: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    referenceCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    validTill: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actionType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  otp.associate = (models) => {
    otp.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user"
    });
  };

  return otp;
};
