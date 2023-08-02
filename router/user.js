const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const wrapAsync = require("../controlError/wrapAsync");
const { verifyToken } = require("../config/authentication/authJwt");
const passport = require("passport");
const { upload } = require("../helper/multer");
const { registerUser, loginUser, allUser, currentUser, checkingUserWithEmail, addPicture, resetPassword } = require("../controller/user");
const imageUploading = require("../helper/imageuploading");
const User = require("../models/user");
require("../config/authentication/google_authentication");

router.post("/register", check("emailId", "Please include a valid email").isEmail(), check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }), wrapAsync(registerUser));

router.post("/login", wrapAsync(loginUser));

router.get("/", wrapAsync(allUser));

router.get("/currentUser", [verifyToken], wrapAsync(currentUser));

//  find user
router.post("/emailCheck", wrapAsync(checkingUserWithEmail));

// update user model with new profile picture
router.post("/addPicture", [verifyToken], wrapAsync(addPicture));

// route handling forget passwordd
router.post("/resetPassword", check("emailId", "Please include a valid email").isEmail(), check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }), wrapAsync(resetPassword));

//aadhar or pain uploading route.
router.post("/kycforuser", [verifyToken], upload.single("image"), async (req, res) => {
  const { proofOfAddress, proofOfIdentity, passportsizephoto } = req.query;
  const imageResponse = await imageUploading(req.file.destination + "/" + req.file.filename, proofOfAddress, proofOfIdentity, passportsizephoto, req.userId);
  if (imageResponse) {
    return res.status(200).json({ message: "Image Uploaded Successfully" });
  }
});
// route to find all user who has applied for verification of kyc.
router.get("/newverificationforkyc", [verifyToken], async (req, res) => {
  const newuserforverification = await User.find({ $and: [{ "userKyc.proofOfAddress.url": { $ne: null } }, { "userKyc. proofOfIdentity.url": { $ne: null } }, { verificationdone: false }] });
  return res.status(200).json({ newuserforverification });
});
// verifykyc by aadhar and pan
router.get("/verifykyc", [verifyToken], async (req, res) => {
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
});

router.post("/kycforcompany", [verifyToken], upload.single("image"), async (req, res) => {
  const { proofOfIdentityforcompany, certification, moa, aoa, boardResolution } = req.query;
  const imageResponse = await imageUploading(req.file.destination + "/" + req.file.filename, proofOfIdentityforcompany, certification, moa, aoa, boardResolution, req.userId);
  if (imageResponse) {
    return res.status(200).json({ message: "Image Uploaded Successfully" });
  }
});

// routes for google authentication
router.get("/googleauth", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/googleauth/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect("/");
});

module.exports = router;
