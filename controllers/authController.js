const db = require('../models/index');
const { createHash } = require("crypto");
const jwt = require("jsonwebtoken");
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
  //console.log(req.body);

  try {
    const user = await db.user.findOne(fullName, email, dob, password);
    if (user) {
      throw new Error("User with that email already exists");
    }
  } catch (error) {
    return res.status(403).json({
      message: `${error}`
    });
  }

  try {
    const user = await db.user.create(fullName, email, dob, password);
    sendUser = {
      name: user.fullName,
      email: user.email,
      dob: user.dob,
      id: user.id
    };
    const token = await tokenSign(user.id, user.email);
  } catch (error) {
    
  }
//@@@@@@@@@@@@@
  db.User.findOne({ where: { email: email }, raw: true })
    .then(user => {
      if (user) {
        throw new Error("User with that email already exists");
      }
      return db.User.create({
        fullName,
        email,
        dob,
        password: hashPassword
      })
    })
    .then(user => {
      sendUser = {
        name: user.fullName,
        email: user.email,
        dob: user.dob,
        id: user.id
      };
      return tokenSign(user.id, user.email);
    })
    .then(token => {
      const body = {
        token,
        user: sendUser
      }
      res.status(200).send(body);
    })
    .catch(err => {
      res.status(403).json({
        message: `${err}`
      });
    });
}

exports.loginUser = function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  //console.log(req.body);
  const { email, password } = req.body;
  const hashPassword = createHash('sha256').update(password).digest('hex');
  let sendUser = {};
  db.User.findOne({ where: { email } })
    .then(user => {
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
      return token = tokenSign(user.id, user.email);
    })
    .then(token => {
      const body = {
        token,
        user: sendUser
      }
      res.status(200).send(body);
    })
    .catch(err => {
      res.status(403).json({
        message: `${err}`
      });
    });
};

exports.loginUserByToken = function (req, res) {

  const id = req.userId;
  let sendUser = {};
  db.User.findOne({ where: { id } })
    .then(user => {
      if (!user) {
        throw new Error("This user does not exist");
      };
      sendUser = {
        name: user.fullName,
        email: user.email,
        dob: user.dob,
        id: user.id
      };
      return tokenSign(user.id, user.email)
    })
    .then(token => {
      const body = {
        token,
        user: sendUser
      }
      res.status(200).send(body);
    })
    .catch(err => {
      res.status(403).json({
        message: `${err}`
      });
    });
};