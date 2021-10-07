
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorScheme = new Schema(
  {
    name: String,
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);

const Author = mongoose.model("Author",authorScheme);
module.exports = Author;