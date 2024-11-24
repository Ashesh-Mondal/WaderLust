const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

// SingnUp
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// Register User in DB
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password); // Used to save data in DB and hash password
      console.log(registeredUser);
      // req.login() is a passport method used to automatically login a user after the user signup
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        console.log(req.user);
        res.redirect("/listings");
      });
    } catch (e) {
      console.log(e);
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

// Login Form
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// Login User
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect("/listings");
  }
);

// Logout User
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been Logged Out Successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;
