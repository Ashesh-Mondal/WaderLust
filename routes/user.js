const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// SingnUp
router.get("/signup", userController.renderSignupForm);

// Register User in DB
router.post("/signup", wrapAsync(userController.signup));

// Login Form
router.get("/login", userController.renderLoginForm);

// Login User
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// Logout User
router.get("/logout", userController.logout);

module.exports = router;
