"use strict";
require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser')



const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const bookRouter = require("./routes/bookRouter");
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/books", bookRouter);

// app.post('/test', upload.single('cover'), (req, res) => {
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
  
// })

app.listen(process.env.PORT, function (error) {
  if (error) {
    console.log('Server is not started', error.message)
    process.exit(1)
  }
  console.log("Server started...");
});