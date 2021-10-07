const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewScheme = new Schema(
  {
    text: String,
    BookId: { type: Schema.Types.ObjectId, ref: 'Book' },
    UserId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);

const Review = mongoose.model("Review",reviewScheme);
module.exports = Review;