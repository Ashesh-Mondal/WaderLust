module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // req.originalUrl is used to get the complete url of the current page
    req.flash("error", "You must be logged in first to access the listings!");
    return res.redirect("/login");
  } else {
    return next();
  }
};

//* Passport has a flaw, that when it hits "/login" route and authenticates user
//* it wil clear it's session that's the reason we need to save the redirect url
//* in locals object so that it can be accessed in the any page

// Middleware to save the redirect url in locals object so that it can be accessed in the any page
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
