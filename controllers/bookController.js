const db = require('../models/index');
const { Op } = require("sequelize");

exports.addNewBook = function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const UserId = req.userId;
  const { title, description, AuthorId, GenreId } = req.body;
  db.Book.findOne({ where: { title, AuthorId } })
    .then(book => {
      if (book) {
        throw new Error("That book already exists");
      }
      return db.Book.create({
        title,
        description,
        AuthorId,
        GenreId,
        UserId
      })
    })
    .then(() => {
      res.status(200).json({
        message: `Book added`
      });
    })
    .catch(error => {
      res.status(400).json({
        message: `${error}`
      });
    });
};

exports.findBooksByGenre = function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const { GenreId } = req.body;

  db.Genre.findByPk(GenreId)
    .then(genre => {
      if (!genre) {
        throw new Error("No such genre at list");
      }
      return genre.getBooks()
    })
    .then(books => {
      if (!books) {
        throw new Error("No such books");
      }
      const body = {
        books
      }
      res.status(200).send(body);
    })
    .catch(error => {
      res.status(400).json({
        message: `${error}`
      });
    });


};