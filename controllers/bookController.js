const db = require('../models/index');


exports.addNewBook = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const userId = req.userData._id.toString();
  const { title, description, author, genreId } = req.body;

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
      userId
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
  const fileData = req.file;
  console.log(fileData.filename);
  const body = {
    fileName : fileData.filename,
  };
  res.status(200).send(body);


};

exports.findBooks = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const { genreId, authorId, userId } = req.body;
  let includeOptions = {};

  // const includeOptions = createFitler(req.body);!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


  if (genreId) {
    includeOptions = { ...includeOptions, genreId }
  }
  if (authorId) {
    includeOptions = { ...includeOptions, authorId }
  }
  if (userId) {
    includeOptions = { ...includeOptions, userId }
  }


  try {
    const books = await db.book.find(includeOptions)
      .populate('genreId')
      .populate('authorId');
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