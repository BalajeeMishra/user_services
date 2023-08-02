const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const JWT_ACC_ACTIVATE = "usingtokenforauthentication";
const AppError = require("../controlError/AppError");
const imageUploading = require("../helper/imageuploading");
const imageUploadingHelper = require("../helper/imageuploadinghelper");
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
    const imagePath = req.file.destination + "/" + req.file.filename;
    const profilePic = await imageUploadingHelper(imagePath);
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

const newUserForKyc = async (_, res) => {
  const newuserforverification = await User.find({ $and: [{ "userKyc.proofOfAddress.url": { $ne: null } }, { "userKyc.proofOfIdentity.url": { $ne: null } }, { verificationdone: false }] });
  if (!newuserforverification) {
    throw new AppError("No new user applied for kyc", 404);
  }
  return res.status(200).json({ newuserforverification });
};

const newCompanyForKyc = async (_, res) => {
  const newuserforverification = await User.find({ $and: [{ "companyKyc.proofOfIdentity.url": { $ne: null } }, { "companyKyc.certification.url": { $ne: null } }, { verificationdone: false }] });
  if (!newuserforverification) {
    throw new AppError("No new company applied for kyc", 404);
  }
  return res.status(200).json({ newuserforverification });
};

const kycForUserProcess = async (req, res) => {
  const { proofOfAddress, proofOfIdentity, passportsizephoto } = req.query;
  const imagePath = req.file.destination + "/" + req.file.filename;
  const imageResponse = await imageUploading({ imagePath, proofOfAddress, proofOfIdentity, passportsizephoto, userId: req.userId });
  if (imageResponse) {
    fs.unlink(imagePath, (err) => {
      if (err) {
      } else {
      }
    });
    return res.status(200).json({ message: "Document Uploaded Successfully" });
  }
};

const kycForCompanyProcess = async (req, res) => {
  try {
    const { proofOfIdentityforcompany, certification, moa, aoa, boardResolution } = req.query;
    const imagePath = req.file.destination + "/" + req.file.filename;
    const imageResponse = await imageUploading({ imagePath, proofOfIdentityforcompany, certification, moa, aoa, boardResolution, userId: req.userId });
    if (imageResponse) {
      fs.unlink(imagePath, (err) => {
        if (err) {
        } else {
        }
      });
      return res.status(200).json({ message: "Document Uploaded Successfully" });
    } else {
      throw new AppError("Something went wrong. Please try again!");
    }
  } catch (e) {
    throw new AppError(error["500"], 500);
  }
};

const verifykyc = async (req, res) => {
  const { id, proofOfAddress, proofOfIdentityforuser, userVerified, proofOfIdentityforCompany, certification, moa, aoa, boardResolution, companyVerified } = req.query;
  const user = await User.findById(id);
  if (proofOfAddress) {
    user.userKyc.proofOfAddress.status = true;
    await user.save();
    return res.status(200).json({ message: "Proof of Address verified" });
  } else if (proofOfIdentityforuser) {
    user.userKyc.proofOfIdentity.status = true;
    await user.save();
    return res.status(200).json({ message: "Proof of identity verified" });
  } else if (passportsizephoto) {
    user.userKyc.passportsizephoto.status = true;
    await user.save();
    return res.status(200).json({ message: "Profile pic verified" });
  } else if (userVerified) {
    if (user.userKyc.proofOfAddress.status && user.userKyc.proofOfIdentity.status) {
      user.userKyc.verificationdone = true;
      await user.save();
      return res.status(200).json({ message: "User verification done" });
    }
    return res.status(404).json({ message: "Something went wrong, Please try again" });
  } else if (proofOfIdentityforCompany) {
    user.companyKyc.proofOfIdentity.status = true;
    await user.save();
    return res.status(200).json({ message: "Proof of identity verified " });
  } else if (certification) {
    user.companyKyc.certification.status = true;
    await user.save();
    return res.status(200).json({ message: "Certification verified" });
  } else if (moa) {
    user.companyKyc.moa.status = true;
    await user.save();
    return res.status(200).json({ message: "Memorandum of Association Verified" });
  } else if (aoa) {
    user.companyKyc.aoa.status = true;
    await user.save();
    return res.status(200).json({ message: "Articles of Association Verified" });
  } else if (boardResolution) {
    user.companyKyc.boardResolution.status = true;
    await user.save();
    return res.status(200).json({ message: "Board Resolution or Letter of Authorization verified" });
  } else if (companyVerified) {
    if (user.companyKyc.proofOfIdentity.status && user.companyKyc.certification.status && user.companyKyc.moa) {
      user.companyKyc.verificationdone = true;
      await user.save();
      return res.status(200).json({ message: "Company verification done" });
    }
    return res.status(404).json({ message: "Something went wrong, Please try again" });
  }
  return res.status(500).json({ message: "Server not responding.try again!" });
};

module.exports = {
  registerUser,
  loginUser,
  allUser,
  currentUser,
  checkingUserWithEmail,
  addPicture,
  resetPassword,
  newUserForKyc,
  kycForUserProcess,
  verifykyc,
  kycForCompanyProcess,
  newCompanyForKyc
};
