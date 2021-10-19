const express = require("express");

const bookController = require("../controllers/bookController");
const bookRouter = express.Router();
const middlewares = require('../middlewares/index');

const multer = require('multer')
const upload = multer({ dest: 'public/images/' })

bookRouter.post("/", middlewares.checkUserToken, bookController.addNewBook);
bookRouter.get("/my-books", middlewares.checkUserToken, bookController.getMyBooks);
bookRouter.get("/",bookController.getBooks);
bookRouter.post("/add-to-favorites",middlewares.checkUserToken,bookController.addToFavorites);
bookRouter.get("/book",bookController.getBookById);

bookRouter.get("/genres", bookController.getGenres);
bookRouter.get("/authors", bookController.getAuthors);
bookRouter.post("/cover",
  middlewares.checkUserToken,
  upload.single('cover'),
  bookController.uploadAvatar);

module.exports = bookRouter;