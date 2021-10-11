const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileScheme = new Schema(
  {
    fileRef: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);

const File = mongoose.model("File",fileScheme);
module.exports = File;