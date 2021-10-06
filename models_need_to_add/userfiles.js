const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserFiles.init({
    comment: DataTypes.STRING,
    FileId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserFiles',
  });
  return UserFiles;
};