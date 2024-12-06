const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// INDEX ROUTE && CREATE ROUTE
router
  .route("/")
  .get(wrapAsync(listingController.index))
  // .post(
  //   isLoggedIn,
  //   validateListing,
  //   wrapAsync(listingController.createListing)
  // );
  .post(upload.single("listing[image]"), (req, res) => {
    res.send(req.file);
  });

// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW ROUTE && UPDATE ROUTE && DELETE ROUTE
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
