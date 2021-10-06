const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema(
  {
    fullname: String,
    email: String,
    password: String,
    dob: Date,
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);

const User = mongoose.model("User",userScheme);
module.exports = User;