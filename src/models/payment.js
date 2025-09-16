const { payment_status_enums } = require("../../utils/enums");

module.exports = (sequelize, DataTypes) => {
  const payment = sequelize.define(
    "payment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invoiceNo: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      request: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      paymentMode: {
        type: DataTypes.ENUM("card"),
      },
      paymentGatewayRef: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(payment_status_enums)),
        defaultValue: payment_status_enums.initiated,
      }
    },
    {
      tableName: "payment",
    }
  );

  payment.associate = (models) => {
    payment.belongsTo(models.order, {
      foreignKey: "orderId",
      as: "order",
    });
  };
  return payment;
};
