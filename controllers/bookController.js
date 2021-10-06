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

exports.findBooks = function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const { GenreId, AuthorId, UserId } = req.body;
  let includeOptions = [];
  
  if (GenreId) {
    includeOptions = [...includeOptions,{
      model: db.Genre,
      where: {
        id: GenreId
      }
    }];
  }
  if (AuthorId) {
    includeOptions = [...includeOptions,{
      model: db.Author,
      where: {
        id: AuthorId
      }
    }];
  }
  if (UserId) {
    includeOptions = [...includeOptions,{
      model: db.User,
      where: {
        id: UserId
      }
    }];
  }

console.log(`options ${includeOptions}`);
  db.Book.findAll({
    include: includeOptions
  })
    .then(books => {
      if (books.length === 0) {
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