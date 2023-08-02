const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_ACC_ACTIVATE = "usingtokenforauthentication";
const AppError = require("../controlError/AppError");
const customStatuandError = require("../controlError/httpStatusandError");
const error = customStatuandError();

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array(), 400);
  }
  const { userType, forUser, fullName, companyName, selectCompany, emailId, password, mobileNo, country, companysize } = req.body;
  try {
    let user = await User.findOne({ emailId });
    if (user) {
      throw new AppError(customStatuandError("user")["409"], 409);
    }
    // CREATING NEW USERR
    user = new User({
      userType,
      forUser,
      fullName,
      companyName,
      selectCompany,
      blockchainAdd: blkchn,
      BNZBalance,
      emailId,
      password,
      mobileNo,
      country,
      companysize
    });
    //password hashing
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    const token = jwt.sign({ emailId, password, id: user._id }, JWT_ACC_ACTIVATE, {
      expiresIn: "10 days"
    });
    const registerUser = await user.save();
    return res.status(201).json({ registerUser, token });
  } catch (err) {
    throw new AppError(error["500"], 500);
  }
};

const loginUser = async (req, res) => {
  try {
    let loginResult;
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user.googleId) {
      loginResult = await bcrypt.compare(password, user.password);
    }
    let hashedPassword = user.password;
    if (loginResult || user.googleId) {
      hashedPassword = hashedPassword ? hashedPassword : user.googleId;
      const token = jwt.sign({ emailId, hashedPassword, id: user._id }, JWT_ACC_ACTIVATE, {
        expiresIn: "10 days"
      });
      return res.status(200).json({
        message: "you are Logged In",
        token,
        emailId,
        fullName: user.fullName,
        userType: user.userType,
        blockchainAdd: user.blockchainAdd,
        BNZBalance: user.BNZBalance
      });
    } else {
      return res.status(404).json({ message: "Please enter the correct credential" });
    }
  } catch (e) {
    throw new AppError(error["500"], 500);
  }
};

const allUser = async (_, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    throw new AppError(error["500"], 500);
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new AppError(error["500"], 500);
    }
    return res.status(200).json(user);
  } catch (err) {
    throw new AppError(error["500"], 500);
  }
};

const checkingUserWithEmail = async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new AppError(customStatuandError("user")["404"], 404);
    }
    return res.status(200).json({ message: "User Existing" });
  } catch (error) {
    throw new AppError(error["500"], 500);
  }
};

const addPicture = async (req, res) => {
  try {
    const { userId } = req;
    const { profilePic } = req.body;
    await User.findByIdAndUpdate(userId, { profilePicture: profilePic }, { new: true });
    return res.status(200).json({ message: "Profile Picture added" });
  } catch (error) {
    throw new AppError(error["500"], 500);
  }
};

const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array(), 400);
  }
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    throw new AppError(error["500"], 500);
  }
};

module.exports = {
  registerUser,
  loginUser,
  allUser,
  currentUser,
  checkingUserWithEmail,
  addPicture,
  resetPassword
};
