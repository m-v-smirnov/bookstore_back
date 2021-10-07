const db = require('../models/index');
const { createHash } = require("crypto");


exports.editUser = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });

  const { fullName, dob, password } = req.body;
  const id = req.userId;
  let hashPassword = createHash('sha256').update(password).digest('hex');

  try {
    const user = await db.user.updateOne(
      { _id: id },
      {
        fullName,
        dob,
        password: hashPassword,
        updatedAt: Date.now()
      });
    res.status(200).json({
      message: `Changes applied`
    });
  } catch (error) {
    res.status(400).json({
      message: `Server send error: ${error.message}`
    });
  }

};

exports.deleteUser = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const id = req.userId;

  try {
    const user = await db.user.deleteOne({ _id: id });
    res.status(200).json({
      message: `User deleted`
    });
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
};