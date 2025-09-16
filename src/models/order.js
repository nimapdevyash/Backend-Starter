const { payment_status_enums } = require("../../utils/enums");

module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tempOrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderNumber: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("subscription","service"),
        allowNull: false,
      },
      subscriptionPlanId: {
        type: DataTypes.INTEGER,
      },
      serviceInterestId: {
        type: DataTypes.INTEGER
      },
      taxAmount: {
        type: DataTypes.DECIMAL(10,2),
      },
      amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM(...Object.values(payment_status_enums)),
        defaultValue: payment_status_enums.initiated,
      }
    },
    {
      tableName: "order",
    }
  );

  order.associate = (models) => {
    order.belongsTo(models.customer, {
      foreignKey: "buyerId",
      as: "buyer",
    });
    order.belongsTo(models.subscriptionPlan, {
      foreignKey: "subscriptionPlanId",
      as: "subscriptionPlan",
    });
    order.belongsTo(models.tempOrder, {
      foreignKey: "tempOrderId",
      as: "tempOrder"
    });
    order.hasOne(models.payment, {
      foreignKey: "orderId",
      as: "orderDetail"
    });
    order.belongsTo(models.serviceInterest, {
      foreignKey: "serviceInterestId",
      as: "serviceInterest"
    })

  };
  return order;
};
