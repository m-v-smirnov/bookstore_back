const db = require('../models/index');

exports.addBookToCart = async function (req, res) {
  const userId = req.userData._id.toString();
  const { bookId } = req.body;
  let book;

  try {
    book = await db.cart.findOne({ userId, bookId });
  } catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }
  if (book) {
    try {
      await db.cart.updateOne({ userId, bookId }, { amount: book.amount + 1 });
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

exports.deleteOneBookFromCart = async function (req, res) {
  const userId = req.userData._id.toString();
  const { bookId } = req.query;
  let book;
  try {
    book = await db.cart.findOne({ userId, bookId })
  } catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }
  if (!book) {
    return res.status(400).json({
      message: `No such book`
    });
  }
  if (book.amount > 1) {
    try {
      await db.cart.updateOne({ userId, bookId }, { amount: book.amount - 1 });
      res.status(200).json({
        message: `Book amount decreased `
      });
    } catch (error) {
      return res.status(400).json({
        message: `${error}`
      });
    }
  }
  else {
    try {
      await db.cart.deleteOne({ userId, bookId })
      res.status(200).json({
        message: `Book deleted`
      });
    } catch (error) {
      return res.status(400).json({
        message: `${error}`
      });
    }
  }
}

exports.deleteBooksFromCart = async function (req, res) {
  const userId = req.userData._id.toString();
  const { bookId } = req.query;

  try {
    const book = await db.cart.findOne({ userId, bookId })
    if (!book) {
      return res.status(400).json({
        message: `No such book`
      });
    }
  }
  catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }
  try {
    await db.cart.deleteOne({ userId, bookId })
    res.status(200).json({
      message: `Book deleted`
    });
  } catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }
}

exports.emptyCart = async function (req, res) {
  const userId = req.userData._id.toString();

  try {
    const book = await db.cart.findOne({ userId })
    if (!book) {
      return res.status(400).json({
        message: `No one book in a list`
      });
    }
  }
  catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }

  try {
    await db.cart.deleteMany({userId})
    res.status(200).json({
      message: `Cart is empty`
    });
  } catch (error) {
    
  }
}

exports.getBooksFromCart = async function (req,res) {
  const userId = req.userData._id.toString();
  let books = [];
  try {
    const book = await db.cart.findOne({ userId })
    if (!book) {
      const body = {bookCart: books};
      return res.status(200).send(body);
    }
  }
  catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }

  try {
    const books = await db.cart.find({userId})
    .populate({
      path: 'bookId',
      populate: {path: 'coverRefId'}
    })
    const body = {bookCart: books};
    res.status(200).send(body);
  } catch (error) {
    
  }
}
