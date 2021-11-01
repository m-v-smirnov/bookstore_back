const express = require("express");
const shopcartController = require("../controllers/shopcartController");
const {checkUserToken} = require('../middlewares/checkUserToken');

const shopcartRouter = express.Router();

shopcartRouter.use("/",checkUserToken);
shopcartRouter.patch("/",shopcartController.addBookToCart);
shopcartRouter.get("/",shopcartController.getBooksFromCart);
shopcartRouter.delete("/",shopcartController.deleteOneBookFromCart);
shopcartRouter.delete("/books",shopcartController.deleteBooksFromCart);
shopcartRouter.delete("/empty-cart",shopcartController.emptyCart);
module.exports = shopcartRouter;