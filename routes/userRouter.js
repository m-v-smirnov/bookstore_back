const express = require("express");
const userController = require("../controllers/userController");
const { passIsValid } = require('../middlewares/index');
const middlewares = require('../middlewares/index');

const userRouter = express.Router();

userRouter.use("/", middlewares.checkUserToken);
userRouter.patch("/", passIsValid, userController.editUser);
userRouter.delete("/", userController.deleteUser);
userRouter.get("/", userController.getUserByID);

module.exports = userRouter;