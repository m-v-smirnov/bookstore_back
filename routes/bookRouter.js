const express = require("express");

const bookController = require("../controllers/bookController");
const bookRouter = express.Router();
const middlewares = require('../middlewares/index');

const multer = require('multer')
const upload = multer({ dest: 'public/images/' })

bookRouter.get("/",bookController.getBooks);
bookRouter.get("/genres", bookController.getGenres);
bookRouter.get("/authors", bookController.getAuthors);
bookRouter.get("/my-books",middlewares.checkUserToken,bookController.getMyBooks);
bookRouter.get("/:bookId",bookController.getBookById);
bookRouter.get("/:bookId/get-rating", bookController.getBookRating);
bookRouter.get("/:bookId/reviews",bookController.getBookReviews);

bookRouter.use("/",middlewares.checkUserToken)

bookRouter.post("/",bookController.addNewBook);
bookRouter.post("/:bookId/add-to-favorites",bookController.addToFavorites);
bookRouter.post("/:bookId/rate-the-book",bookController.addBookRating);
bookRouter.post("/:bookId/review",bookController.addBookReview);
bookRouter.post("/cover", upload.single('cover'), bookController.uploadAvatar);

module.exports = bookRouter;

// users
/**
 
 POST /users -> create
 GET /users -> all
 GET /users/:id - get one
 PUT/PATCH /users/:id - update one
 DELETE /users/:id - delete one
 */

// GET /users?name=Mi&sortField=date&sortDir=asc
// GET /users/1u6234162

// // GET /users/:id/review
// // GET /users/:id/review/:reviewId

// get /books/:bookId/reviews