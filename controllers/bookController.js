var mongoose = require('mongoose');
const db = require('../models/index');


exports.addNewBook = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const userId = req.userData._id.toString();
  const { title, description, author, genreId, cover, price, amount, sale } = req.body;
  let coverRefId = '';

  try {
    coverRefId = await db.file.findOne({ fileRef: cover });
  } catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }

  try {
    const book = await db.book.findOne({ title, author });
    if (book) {
      throw new Error("That book already exists");
    }

  } catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }

  try {
    const book = await db.book.create({
      title,
      description,
      author,
      genreId,
      userId,
      coverRefId,
      price,
      amount,
      sale,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    res.status(200).json({
      message: `Book added`
    });
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
};

exports.uploadAvatar = async function (req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "Uploading error" });
  }
  const fileRef = req.file.filename;
  try {
    await db.file.create({ fileRef });
  } catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }

  const body = {
    fileName: fileRef,
  };
  return res.status(200).send(body);


};

exports.getMyBooks = async function (req, res) {

  const userId = req.userData._id.toString();

  try {
    const books = await db.book.find({ userId })
      .populate("coverRefId")
    if (books.length === 0) {
      throw new Error("No such books");
    }
    const body = {
      books
    }
    res.status(200).send(body);
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
};

exports.getBooks = async function (req, res) {
  const { page, genreId, sortingString } = req.query;
  let { priceMin, priceMax } = req.query;
  const limit = Number(process.env.BOOKS_LIMIT);
  let filterOptions = {};
  let sortingOptions;

  if (genreId) {
    filterOptions = { ...filterOptions, genreId };
  }
  if (!priceMin) {
    priceMin = 0;
  }
  if (!priceMax) {
    priceMax = 999999999;
  }

  filterOptions = { ...filterOptions, price: {$gte: priceMin, $lte: priceMax} };

  switch (sortingString) {
    case 'default': { sortingOptions = {} }
      break;
    case 'olderFirst': { sortingOptions = { createdAt: -1 } }
      break;
    case 'youngerFirst': { sortingOptions = { createdAt: 1 } }
      break;
    case 'expensiveFirst': { sortingOptions = { price: -1 } }
      break;
    case 'cheapFirst': { sortingOptions = { price: 1 } }
      break;

    default: { sortingOptions = {} }
      break;
  }

  try {
    const allBooks = await db.book.find(filterOptions)
      .where('price').gt(priceMin).lt(priceMax)

    const books = await db.book.find(filterOptions)
      .sort(sortingOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("coverRefId")
      .populate("genreId")
    if (books.length === 0) {
      throw new Error("No such books");
    }

    const totalDocs = allBooks.length;
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = (Number(page) < totalPages);
    const hasPrevPage = (Number(page) > 1);
    const nextPage = hasNextPage ? (+page + 1) : null;
    const prevPage = hasPrevPage ? (+page - 1) : null;
    const pagingCounter = (page - 1) * limit;

    const pagination = {
      totalDocs,
      totalPages,
      page,
      limit,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
      pagingCounter
    };

    const body = {
      books,
      pagination
    }
    res.status(200).send(body);
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }

};

exports.getBookById = async function (req, res) {
  const { bookId } = req.query;
 // console.log(`>>>${bookId}`);
  try {
    const book = await db.book.findOne({ _id: bookId })
      .populate("coverRefId")
      .populate("genreId")
    const body = {
      book,
    }
    res.status(200).send(body);
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
}

exports.getGenres = async function (req, res) {
  try {
    const genres = await db.genre.find();
    if (genres.length === 0) {
      throw new Error("List of genres is empty");
    }
    const body = {
      genres
    }
    res.status(200).send(body);
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
};


exports.getAuthors = async function (req, res) {
  try {
    const authors = await db.author.find();
    if (authors.length === 0) {
      throw new Error("List of authors is empty");
    }
    const body = {
      authors
    }
    res.status(200).send(body);
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
};

exports.addToFavorites = async function (req, res) {
  if (!req.body.bookId) return res.status(400).json({ message: "No book ID" });
  const userId = req.userData._id.toString();
  const { bookId } = req.body;

  try {
    const favoriteBook = await db.favorites.find({ bookId, userId });
    if (favoriteBook.length > 0) {
      console.log(favoriteBook);
      return res.status(400).json({ message: "This book already in favorites" });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    await db.favorites.create({
      bookId,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    res.status(200).json({
      message: `Book added to favorites`
    });
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }

}

exports.addBookRating = async function (req, res) {
  if (!req.body.bookId) return res.status(400).json({ message: "No book ID" });
  const userId = req.userData._id.toString();
  const { rating , bookId } = req.body;
  console.log(`>>>   ${rating}    ${bookId}`);
  try {
    const bookWithRating = await db.ratings.find({ bookId, userId });
    if (bookWithRating.length > 0) {
      console.log(bookWithRating);
      return res.status(400).json({ message: "You already send rating" });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    await db.ratings.create({
      rating,
      bookId,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    res.status(200).json({
      message: `Book rated`
    });
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
}

exports.getBookRating = async function (req,res) {
  if (!req.query.bookId) {
    return res.status(400).json({ message: "No book ID" });
  }
  const { bookId } = req.query;

  try {
    const rates = await db.ratings.find({bookId})
    let sum=0;
    rates.map((item) => { sum += item.rating });

    const body = {
      rating: sum/rates.length
    };
    res.status(200).send(body);
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }

}

exports.addBookReview = async function (req,res) {
  if (!req.body.review) {
    return res.status(400).json({ message: "Review should not be empty" });
  }
  const userId = req.userData._id.toString();
  const { bookId, review } = req.body;

  try {
    const reviewsResponse = await db.review.findOne({bookId,userId});
    if (reviewsResponse) {
      return res.status(400).json({ message: "You have already written a review" });
    }  
  } catch (error) {
    console.log(error);
  }


  try {
    await db.review.create({
      _id: (new mongoose.mongo.ObjectId()).toString(),
      review,
      bookId,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });  
    res.status(200).json({
      message: `Review created`
    });
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
}

exports.getBookReviews = async function (req,res) {
  if (!req.query.bookId) {
    return res.status(400).json({ message: "No book ID" });
  }
  const { bookId } = req.query;

  try {
    const reviewsResponse = await db.review.find({bookId})
    .populate('userId')

    if(reviewsResponse.length === 0) {
      return res.status(400).json({ message: "Reviews list is empty" });
    }

    const body = {
      reviews : reviewsResponse
    }
    res.status(200).send(body);
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
}
