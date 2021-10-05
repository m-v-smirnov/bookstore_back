const express = require("express");
const bookController = require("../controllers/bookController");
const bookRouter = express.Router();
const middlewares = require('../middlewares/index');

bookRouter.post("/",middlewares.checkUserToken,bookController.addNewBook);
bookRouter.get("/genre",bookController.findBooksByGenre);


module.exports = bookRouter;