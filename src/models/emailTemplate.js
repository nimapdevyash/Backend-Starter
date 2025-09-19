module.exports = (sequelize, DataTypes) => {
  const emailTemplate = sequelize.define(
    "emailTemplate",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      html: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      createdBy:{
        type: DataTypes.UUID,
        allowNull: false,
      }
    },
    {
      tableName: "email_template",
    }
  );

  emailTemplate.associate = (models) => {
    emailTemplate.belongsTo(models.user, {
      foreignKey: "updatedBy",
    });
  };
  return emailTemplate;
};
