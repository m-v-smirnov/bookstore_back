
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);


let db = {};

mongoose.connect(process.env.DATABASE_URL, {
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


// db.author.create({
//   "name": "author5",
//   "createdAt": Date.now(),
//   "updatedAt": Date.now()
// });


module.exports = db;
