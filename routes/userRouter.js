const express = require("express");
const userController = require("../controllers/userController");
const { passIsValid } = require('../middlewares/validations');
const {checkUserToken} = require('../middlewares/checkUserToken');

const userRouter = express.Router();

userRouter.use("/",checkUserToken);
userRouter.patch("/", passIsValid, userController.editUser);
userRouter.delete("/", userController.deleteUser);
userRouter.get("/", userController.getUserByID);

module.exports = userRouter;