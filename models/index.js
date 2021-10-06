const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const User = require('./user');
const mongoose = require("mongoose");

let db = {};

mongoose.connect("mongodb://localhost:27017/bookstoreDb", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}, function (err) {
  if (err) return console.log(err);
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0)
      && (file !== basename)
      && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))
    db[file.slice(0, -3)] = model;
  });

// console.log(db)
// db.user.create({
//   "fullname": "user5",
//   "email": "user5@mail.ru",
//   "password": "need update",
//   "dob": "1990-06-26",
//   "createdAt": Date.now(),
//   "updatedAt": Date.now()
// });


module.exports = db;
