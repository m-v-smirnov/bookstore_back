const db = require('../models/index');
const { tokenSign } = require('../utils/tokenSign');
const { stringToHash } = require('../utils/stringToHash');

exports.createUser = async function (req, res) {

  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const { fullName, email, dob, password } = req.body;
  const hashPassword = stringToHash(password);
  let sendUser = {};
  const fileRef = "defaultavatar.png";
  let avatarRefId;

  try {
    avatarRefId = (await db.file.findOne({ fileRef }))._id;
  } catch (error) {
    console.log(error);
  }

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
      avatarRefId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    sendUser = {
      fullName: user.fullName,
      email: user.email,
      dob: user.dob,
      id: user.id,
      avatarRef: fileRef
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
}

exports.loginUser = async function (req, res) {
  if (!req.body) return res.status(400).json({ message: "Empty request body" });
  const { email, password } = req.body;
  const hashPassword = stringToHash(password);
  let sendUser = {};

  try {
    const user = await db.user.findOne({ email }).populate('avatarRefId');
    if (!user) {
      throw new Error("This user does not exist");
    };
    if (hashPassword !== user.password) {
      throw new Error("Invalid password");
    }
    sendUser = {
      fullName: user.fullName,
      email: user.email,
      dob: user.dob,
      id: user.id,
      avatarRef: (user.avatarRefId ? user.avatarRefId.fileRef : "defaultavatar.png"),
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
    const user = await db.user.findOne({ _id: id }).populate('avatarRefId');
    if (!user) {
      throw new Error("This user does not exist");
    };
    sendUser = {
      fullName: user.fullName,
      email: user.email,
      dob: user.dob,
      id: user.id,
      avatarRef: (user.avatarRefId ? user.avatarRefId.fileRef : "defaultavatar.png"),
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