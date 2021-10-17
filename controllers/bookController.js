const db = require('../models/index');


exports.addNewBook = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const userId = req.userData._id.toString();
  const { title, description, author, genreId, cover, price, amount, sale} = req.body;
  let coverRefId='';
  
  try {
    coverRefId = await db.file.findOne({fileRef : cover});
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

exports.uploadAvatar = async function (req,res) {
  if(!req.file) {
    return res.status(400).json({ message: "Uploading error" });
  }
  const fileRef = req.file.filename;
  try {
    await db.file.create({fileRef});
  } catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }

  const body = {
    fileName : fileRef,
  };
  return res.status(200).send(body);


};

exports.getMyBooks = async function (req, res) {
  
  const userId = req.userData._id.toString();

  try {
    const books = await db.book.find({userId})
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

exports.getBooks = async function (req,res) {
  const { page, genreId } = req.query;
  const limit = Number(process.env.BOOKS_LIMIT);
  let options = {};
  
  if(genreId) {
    options = {...options, genreId};
  }
  console.log(`>>> options: ${options.genreId}`);
  // console.log(`limit : ${limit},    page# : ${page}`);

  try {
    const allBooks = await db.book.find(options)

    const books = await db.book.find(options)
    .skip((page -1) * limit)
    .limit(limit)
    .populate("coverRefId")
    .populate("genreId")
    if (books.length === 0) {
      throw new Error("No such books");
    }

    const totalDocs = allBooks.length;
    const totalPages = Math.ceil(totalDocs/limit);
    const hasNextPage = (Number(page) < totalPages);
    const hasPrevPage = (Number(page) > 1);
    const nextPage = hasNextPage ? (+page +1) : null;
    const prevPage = hasPrevPage ? (+page -1) : null;
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