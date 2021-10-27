const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewScheme = new Schema(
  {
   // _id: String,
    review: String,
    bookId: String,
    userId: String,
    // bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
    // userId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);

const Review = mongoose.model("Review",reviewScheme);
module.exports = Review;