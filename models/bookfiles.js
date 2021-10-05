const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BookFiles.init({
    comment: DataTypes.STRING,
    BookId: DataTypes.INTEGER,
    FileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BookFiles',
  });
  return BookFiles;
};