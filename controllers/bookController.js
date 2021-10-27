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
    priceMax = Infinity;
  }

  filterOptions = { ...filterOptions, price: { $gte: priceMin, $lte: priceMax } };

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

  const options = {
    sort: sortingOptions,
    limit,
    lean: true,
    page,
    populate: ["coverRefId", "genreId"],
  }

  try {
    const { totalDocs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
      pagingCounter, 
      docs } = await db.book.paginate(filterOptions, options);

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
      books: docs,
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
  const { bookId } = req.params;

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
  if (!req.params.bookId) return res.status(400).json({ message: "No book ID" });
  const userId = req.userData._id.toString();
  const { bookId } = req.params;

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
  if (!req.params.bookId) return res.status(400).json({ message: "No book ID" });
  const userId = req.userData._id.toString();
  const { rating } = req.body;
  const { bookId } = req.params;
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

exports.getBookRating = async function (req, res) {
  if (!req.params) {
    return res.status(400).json({ message: "No book ID" });
  }
  const { bookId } = req.params;
  console.log(`>>>${bookId}`);
  try {
    const rates = await db.ratings.find({ bookId })
    // ----- reduce
    // let sum=0;
    // rates.map((item) => { sum += item.rating });
    // const rating = sum/rates.length
    const rating = (rates.length > 0) 
    ? (rates.reduce((sum, current) => sum += current.rating, 0) / rates.length) : 0;

    // ----
    const body = {
      rating
    };
    res.status(200).send(body);
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }

}

exports.addBookReview = async function (req, res) {
  if (!req.body.review) {
    return res.status(400).json({ message: "Review should not be empty" });
  }
  const userId = req.userData._id.toString();
  const { review } = req.body;
  const { bookId } = req.params;

  try {
    const reviewsResponse = await db.review.findOne({ bookId, userId });
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

exports.getBookReviews = async function (req, res) {
  if (!req.params.bookId) {
    return res.status(400).json({ message: "No book ID" });
  }
  const { bookId } = req.params;

  try {
    const reviewsResponse = await db.review.find({ bookId })
      .populate({
        path: 'userId',
        select: 'fullName avatarRefId',
        populate: { path: 'avatarRefId' }
      })

    if (reviewsResponse.length === 0) {
      return res.status(400).json({ message: "Reviews list is empty" });
    }

    const body = {
      reviews: reviewsResponse
    }
    res.status(200).send(body);
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
}
