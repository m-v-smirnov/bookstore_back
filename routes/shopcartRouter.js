const express = require("express");
const shopcartController = require("../controllers/shopcartController");
const middlewares = require('../middlewares/index');

const shopcartRouter = express.Router();

shopcartRouter.patch("/",middlewares.checkUserToken,shopcartController.addBookToCart);
shopcartRouter.get("/",middlewares.checkUserToken,shopcartController.getBooksFromCart);
shopcartRouter.delete("/",middlewares.checkUserToken,shopcartController.deleteOneBookFromCart);
shopcartRouter.delete("/books",middlewares.checkUserToken,shopcartController.deleteBooksFromCart);
shopcartRouter.delete("/empty-cart",middlewares.checkUserToken,shopcartController.emptyCart);
module.exports = shopcartRouter;