const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

exports.tokenSign = function (id, email) {
  return new Promise((res, rej) => {
    jwt.sign({
      id,
      email
    },
      secretKey,
      { expiresIn: 6000 },
      function (err, token) {
        if (err) {
          rej('Error')
        }
        res(token);
      }
    );
  })
}