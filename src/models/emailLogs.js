module.exports = (sequelize, DataTypes) => {
  const emailLogs = sequelize.define(
    "emailLogs",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      to: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      stackTrace: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "email_logs",
    }
  );

  return emailLogs;
};
