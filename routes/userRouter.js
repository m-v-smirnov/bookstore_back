const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();
const { passIsValid } = require('../middlewares/index');
const middlewares = require('../middlewares/index');

userRouter.patch("/",middlewares.checkUserToken, passIsValid, userController.editUser);
//userRouter.patch("/",middlewares.checkUserToken, userController.editUser);
userRouter.delete("/",middlewares.checkUserToken, userController.deleteUser);

module.exports = userRouter;