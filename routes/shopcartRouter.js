const express = require("express");
const shopcartController = require("../controllers/shopcartController");
const middlewares = require('../middlewares/index');

const shopcartRouter = express.Router();

shopcartRouter.patch("/",middlewares.checkUserToken,shopcartController.addBookToCart);
module.exports = shopcartRouter;