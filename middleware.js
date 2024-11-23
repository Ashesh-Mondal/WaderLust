module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first to access the listings!");
    return res.redirect("/login");
  } else {
    return next();
  }
};
