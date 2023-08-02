const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const wrapAsync = require("../controlError/wrapAsync");
const { verifyToken } = require("../config/authentication/authJwt");
const passport = require("passport");
const { upload } = require("../helper/multer");
const { registerUser, loginUser, allUser, currentUser, checkingUserWithEmail, addPicture, resetPassword, newUserForKyc, kycForUserProcess, verifykyc, kycForCompanyProcess, newCompanyForKyc } = require("../controller/User");
require("../config/authentication/google_authentication");

router.post("/register", check("emailId", "Please include a valid email").isEmail(), check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }), wrapAsync(registerUser));

router.post("/login", wrapAsync(loginUser));

router.get("/", wrapAsync(allUser));

router.get("/currentUser", [verifyToken], wrapAsync(currentUser));

//  find user
router.post("/emailCheck", wrapAsync(checkingUserWithEmail));

// update user model with new profile picture
router.post("/addPicture", [verifyToken], upload.single("image"), wrapAsync(addPicture));

// route handling forget passwordd
router.post("/resetPassword", check("emailId", "Please include a valid email").isEmail(), check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }), wrapAsync(resetPassword));

//aadhar or pain uploading or say kyc for user.
router.post("/kycforuser", [verifyToken], upload.single("image"), wrapAsync(kycForUserProcess));
//kyc for company.
router.post("/kycforcompany", [verifyToken], upload.single("image"), wrapAsync(kycForCompanyProcess));
// route to find all user who has applied for verification of kyc.
router.get("/newuserforkyc", [verifyToken], wrapAsync(newUserForKyc));
// route to find all company who has applied for verification of kyc.
router.get("/newcompanyforkyc", [verifyToken], wrapAsync(newCompanyForKyc));
// verifykyc by aadhar and pan
router.get("/verifykyc", [verifyToken], wrapAsync(verifykyc));
// routes for google authentication
router.get("/googleauth", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/googleauth/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect("/");
});

module.exports = router;
