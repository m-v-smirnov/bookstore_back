const express = require("express");

const bookController = require("../controllers/bookController");
const bookRouter = express.Router();
const middlewares = require('../middlewares/index');

const multer  = require('multer')
const upload = multer({ dest: 'images/' })

bookRouter.post("/", middlewares.checkUserToken, upload.single('cover'), bookController.addNewBook);
bookRouter.get("/", bookController.findBooks);
bookRouter.get("/genres",bookController.getGenres);
bookRouter.get("/authors",bookController.getAuthors);

module.exports = bookRouter;