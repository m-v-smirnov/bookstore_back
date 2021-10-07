const express = require("express");
const bookController = require("../controllers/bookController");
const bookRouter = express.Router();
const middlewares = require('../middlewares/index');

bookRouter.post("/", middlewares.checkUserToken, bookController.addNewBook);
bookRouter.get("/", bookController.findBooks);
bookRouter.get("/genres",bookController.getGenres);
bookRouter.get("/authors",bookController.getAuthors);

module.exports = bookRouter;