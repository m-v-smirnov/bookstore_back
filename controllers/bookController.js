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
      sale
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

exports.findBooks = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const { genreId, author, getMyBooks} = req.body;
  if (getMyBooks) { const userId = req.userData._id.toString(); }
  let includeOptions = {};

  // const includeOptions = createFitler(req.body);!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


  if (genreId) {
    includeOptions = { ...includeOptions, genreId }
  }
  if (author) {
    includeOptions = { ...includeOptions, author }
    // includeOptions['author'] = author
  }
   if (getMyBooks) {
     includeOptions = { ...includeOptions, userId }
   }


  try {
    const books = await db.book.find(includeOptions)
      .populate('genreId')
      .populate('coverRefId')
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