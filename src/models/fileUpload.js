module.exports = (sequelize, DataTypes) => {
  const fileUpload = sequelize.define(
    "fileUpload",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING(255),
      },
      mimeType: {
        type: DataTypes.STRING(50),
      },
      extension: {
        type: DataTypes.STRING(50),
      },
    },
    {
      tableName: "file_upload",
    }
  );

  return fileUpload;
};
