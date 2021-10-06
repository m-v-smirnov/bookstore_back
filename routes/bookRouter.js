const express = require("express");
const bookController = require("../controllers/bookController");
const bookRouter = express.Router();
const middlewares = require('../middlewares/index');

bookRouter.post("/",middlewares.checkUserToken,bookController.addNewBook);
bookRouter.get("/",bookController.findBooks);


module.exports = bookRouter;