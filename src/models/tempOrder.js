module.exports = (sequelize, DataTypes) => {
  const tempOrder = sequelize.define(
    "tempOrder",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("subscription","service"),
        allowNull: false,
      },
      serviceInterestId: {
        type: DataTypes.INTEGER,
      },
      subscriptionPlanId: {
        type: DataTypes.INTEGER,
      },
      taxAmount: {
        type: DataTypes.DECIMAL(10,2),
      },
      amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('initiated','paid','failed','pending'),
        defaultValue: 'initiated',
      }
    },
    {
      tableName: "temp_order",
    }
  );

  tempOrder.associate = (models) => {
    tempOrder.belongsTo(models.customer, {
      foreignKey: "buyerId",
      as: "buyer",
    });
    tempOrder.belongsTo(models.subscriptionPlan, {
      foreignKey: "subscriptionPlanId",
      as: "subscriptionPlan",
    });
    tempOrder.belongsTo(models.serviceInterest, {
      foreignKey: "serviceInterestId",
      as: "serviceInterest"
    });
  };
  return tempOrder;
};
