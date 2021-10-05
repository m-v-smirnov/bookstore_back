"use strict";
require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser')
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const bookRouter = require("./routes/bookRouter");
const db = require('./models/index');


const app = express();

// db.sequelize.sync().then(() => {
  app.listen(3010, function (err) {
    if (err) {
      console.log('Server is not started', err.message)
      process.exit(1)
    }
    console.log("Server started...");
  });
// }).catch(err => {
//   console.log(`Server starting error: ${err}`);
// });

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/books", bookRouter);