const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const bookScheme = new Schema(
  {
    title: String,
    description: String,
    author: String,
    genreId: { type: Schema.Types.ObjectId, ref: 'Genre' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    coverRefId: { type: Schema.Types.ObjectId, ref: 'File' },
    price: Number,
    amount: Number,
    sale: Boolean,
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);

bookScheme.plugin(mongoosePaginate);

const Book = mongoose.model("Book",bookScheme);
module.exports = Book;
