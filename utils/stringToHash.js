const { createHash } = require("crypto");

exports.stringToHash = function (str) {
  return createHash('sha256').update(str).digest('hex');
}