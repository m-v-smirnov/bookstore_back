const db = require('../models/index');
const { createHash } = require("crypto");
const jwt = require("jsonwebtoken");
const { log } = require('console');
const secretKey = process.env.SECRET_KEY;

function tokenSign(id, email) {

  return new Promise((res, rej) => {
    jwt.sign({
      id,
      email
    },
      secretKey,
      { expiresIn: 1000 },
      function (err, token) {
        if (err) {
          rej('Error')
        }
        console.log('new token:', token);
        res(token);
      }
    );
  })
  // return jwt.sign({ id, email }, secretKey, { expiresIn: 1000 });
}

exports.createUser = async function (req, res) {

  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const { fullName, email, dob, password } = req.body;
  const hashPassword = createHash('sha256').update(password).digest('hex');
  let sendUser = {};

  try {
    const user = await db.user.findOne({ email });
    if (user) {
      throw new Error("User with that email already exists");
    }
  } catch (error) {
    return res.status(403).json({
      message: `${error}`
    });
  }

  try {
    const user = await db.user.create({
      fullName,
      email,
      dob,
      password: hashPassword,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    sendUser = {
      name: user.fullName,
      email: user.email,
      dob: user.dob,
      id: user.id
    };
    const token = await tokenSign(user.id, user.email);
    const body = {
      token,
      user: sendUser
    }
    res.status(200).send(body);
  } catch (error) {
    res.status(403).json({ message: `${err}` });
  }
}

exports.loginUser = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const { email, password } = req.body;
  const hashPassword = createHash('sha256').update(password).digest('hex');
  let sendUser = {};

  try {
    const user = await db.user.findOne({ email });
    if (!user) {
      throw new Error("This user does not exist");
    };
    if (hashPassword !== user.password) {
      throw new Error("Invalid password");
    }
    sendUser = {
      name: user.fullName,
      email: user.email,
      dob: user.dob,
      id: user.id
    };
    const token = await tokenSign(user.id, user.email);
    const body = {
      token,
      user: sendUser
    }
    res.status(200).send(body);
  } catch (error) {
    res.status(403).json({ message: `${error}` });
  }
};

exports.loginUserByToken = async function (req, res) {

  const id = req.userId;
  let sendUser = {};
  try {
    const user = await db.user.findOne({ _id: id });
    if (!user) {
      throw new Error("This user does not exist");
    };
    sendUser = {
      name: user.fullName,
      email: user.email,
      dob: user.dob,
      id: user.id
    };
    const token = await tokenSign(user.id, user.email);
    const body = {
      token,
      user: sendUser
    }
    res.status(200).send(body);
  } catch (error) {
    res.status(403).json({ message: `${err}` });
  }
};