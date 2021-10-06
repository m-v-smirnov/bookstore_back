const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Author);
      this.belongsTo(models.User);
      this.belongsToMany(models.File,{through: models.BookFiles});
      this.belongsTo(models.Genre);
      this.hasMany(models.Review);
    }
  };
  Book.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    AuthorId: DataTypes.INTEGER,
    GenreId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};