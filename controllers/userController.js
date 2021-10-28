const db = require('../models/index');
const { createHash } = require("crypto");


exports.editUser = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });

 
  const { fullName, dob, password, avatarRef } = req.body;

  const _id = req.userData._id;
  let hashPassword = createHash('sha256').update(password).digest('hex');
  let avatarRefId = '';

  try {
    avatarRefId = await db.file.findOne({ fileRef: avatarRef });
  } catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }

  try {
    const user = await db.user.updateOne(
      { _id },
      {
        fullName,
        dob,
        avatarRefId,
        password: hashPassword,
        updatedAt: Date.now()
      });
  } catch (error) {
    res.status(400).json({
      message: `Server send error: ${error.message}`
    });
  }

  try {
    const user = await db.user.findOne({ _id }).populate('avatarRefId');
    sendUser = {
      fullName: user.fullName,
      email: user.email,
      dob: user.dob,
      id: user.id,
      avatarRef: user.avatarRefId.fileRef,
    };
    const body = {
      user: sendUser
    }
    res.status(200).send(body)
  } catch (error) {
    res.status(400).json({
      message: `Server send error: ${error.message}`
    });
  }

};

exports.getUserByID = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const _id = req.userData._id;
  let user = {};

  try {
    user = await db.user.findOne({ _id }).populate('avatarRefId');
    body = {user};
    res.status(200).send(body);
  } catch (error) {
    return res.status(400).json({
      message: `${error}`
    });
  }
};

exports.deleteUser = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const _id = req.userData._id;

  try {
    const user = await db.user.deleteOne({ _id });
    res.status(200).json({
      message: `User deleted`
    });
  } catch (error) {
    res.status(400).json({
      message: `${error}`
    });
  }
};