const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoritesScheme = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);

const Favorites = mongoose.model("Favorites",favoritesScheme);
module.exports = Favorites;