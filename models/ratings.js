const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingsScheme = new Schema(
  {
    rating: Number,
    bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);

const Ratings = mongoose.model("Ratings",ratingsScheme);
module.exports = Ratings;