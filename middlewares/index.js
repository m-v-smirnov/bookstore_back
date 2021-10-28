const db = require('../models/index');
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const secretKey = process.env.SECRET_KEY;

var winston = require('winston');

winston.configure({
  transports: [
    new (winston.transports.File)({ filename: './logs/somefile.log' })
  ]
});

exports.requestsDataLogger = async function (req, res, next) {
  
  winston.log('info',`${req.url}`);
  next();
}

exports.checkUserToken = async function (req, res, next) {
  let token = '';
  let decoded = {};
  try {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  } catch (err) {
    return res.status(400).json({
      message: "Authorization token missing or incorrect"
    });
  }

  try {
    decoded = jwt.verify(token, secretKey);
  } catch (error) {
    return res.status(400).json({
      message: `Token error: ${error}`
    });
  }

  const { id, email } = decoded;
  try {
    const user = await db.user.findOne({ _id: id, email })

    if (!user) {
      throw new Error("Authorisation error");
    };
    req.userId = id;
    req.userData = user;
    next()
  } catch (error) {
    return res.status(401).json({
      message: `Server send error: ${error}`
    });
  }
};

exports.emailPassIsValid = [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.passIsValid = [
  body('password').isLength({ min: 5 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];