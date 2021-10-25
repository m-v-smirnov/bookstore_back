const db = require('../models/index');

exports.addBookToCart = async function (req, res) {
  const userId = req.userData._id.toString();
  const { bookId } = req.body;
  let book;
  console.log(`>>> bookId:${bookId}`);
  try {
    book = await db.cart.findOne({ userId, bookId });
  } catch (error) {
    console.log("hi there");
    return res.status(400).json({
      message: `${error}`
    });
  }

  if (book) {
    try {
      await db.cart.updateOne({ userId, bookId },{ amount: book.amount + 1});
      res.status(200).json({
        message: `Book added to cart`
      });
    }
    catch (error) {
      return res.status(400).json({
        message: `${error}`
      });
    }
  }
  else {

    try {
      console.log(`>>> bookId:${bookId}`);
      await db.cart.create({ userId, bookId, amount: 1 });
      res.status(200).json({
        message: `New book added to cart`,
      })
    } catch (error) {
      return res.status(400).json({
        message: `${error}`
      });
    }
  }
};