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
bookRouter.post("/rate-the-book",middlewares.checkUserToken,bookController.addBookRating);
bookRouter.get("/get-rating", bookController.getBookRating);
bookRouter.post("/reviews",middlewares.checkUserToken,bookController.addBookReview);
bookRouter.get("/reviews",bookController.getBookReviews);

bookRouter.get("/genres", bookController.getGenres);
bookRouter.get("/authors", bookController.getAuthors);
bookRouter.post("/cover",
  middlewares.checkUserToken,
  upload.single('cover'),
  bookController.uploadAvatar);

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