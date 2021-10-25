const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartScheme = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);

const Cart = mongoose.model("Cart",cartScheme);
module.exports = Cart;