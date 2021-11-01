const express = require("express");
const authController = require("../controllers/authController");
const { emailPassIsValid } = require('../middlewares/validations');
const authRouter = express.Router();
// const middlewares = require('../middlewares/index');
const {checkUserToken} = require('../middlewares/checkUserToken');


authRouter.post("/registration", emailPassIsValid, authController.createUser);
authRouter.post("/login", authController.loginUser);
authRouter.get("/login-token", checkUserToken, authController.loginUserByToken);


module.exports = authRouter;