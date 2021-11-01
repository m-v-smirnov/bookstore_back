const express = require("express");

const bookController = require("../controllers/bookController");
const bookRouter = express.Router();
const {checkUserToken} = require('../middlewares/checkUserToken');

const multer = require('multer')
const upload = multer({ dest: 'public/images/' })

bookRouter.get("/",bookController.getBooks);
bookRouter.get("/genres", bookController.getGenres);
bookRouter.get("/authors", bookController.getAuthors);
bookRouter.get("/my-books",checkUserToken,bookController.getMyBooks);
bookRouter.get("/:bookId",bookController.getBookById);
bookRouter.get("/:bookId/get-rating", bookController.getBookRating);
bookRouter.get("/:bookId/reviews",bookController.getBookReviews);

bookRouter.use("/",checkUserToken)

bookRouter.post("/",bookController.addNewBook);
bookRouter.post("/:bookId/add-to-favorites",bookController.addToFavorites);
bookRouter.post("/:bookId/rate-the-book",bookController.addBookRating);
bookRouter.post("/:bookId/review",bookController.addBookReview);
bookRouter.post("/cover", upload.single('cover'), bookController.uploadAvatar);

module.exports = bookRouter;