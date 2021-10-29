"use strict";
require('dotenv').config();
const express = require("express");
const cors = require('cors');

const {requestsDataLogger} = require("./middlewares/requestDataLogger");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const bookRouter = require("./routes/bookRouter");
const shopcartRouter = require("./routes/shopcartRouter");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/",requestsDataLogger);

app.use('/static',express.static(__dirname + '/public'));
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/books", bookRouter);
app.use("/shopcart", shopcartRouter);

app.listen(process.env.PORT, function (error) {
  if (error) {
    console.log('Server is not started', error.message)
    process.exit(1)
  }
  console.log("Server started...");
});