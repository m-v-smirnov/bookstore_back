const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const genreScheme = new Schema(
  {
    name: String,
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);

const Genre = mongoose.model("Genre",genreScheme);
module.exports = Genre;