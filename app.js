const express = require("express");
const app = express();
const PORT = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hi! I am Root");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("saved");
//   res.send("successful testing");
// });

// INDEX ROUTE

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// NEW ROUTE

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE ROUTE

app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    // Way 1
    // if (!req.body) {
    //   next(new ExpressError(400, "Send valid data to create a listing"));
    // }
    // let { title, description, image, price, location, country } = req.body;
    // let newListing = new Listing({
    //   title,
    //   description,
    //   price,
    //   location,
    //   country,
    // });
    // await newListing.save();

    // Way 2
    if (!req.body.listing) {
      next(new ExpressError(400, "Send valid data to create a listing"));
    }
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// EDIT ROUTE

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// UPDATE ROUTE

app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
      next(new ExpressError(400, "Send valid data to create a listing"));
    }
    const listing = req.body.listing;
    console.log(listing);
    await Listing.findByIdAndUpdate(id, { ...listing });
    res.redirect(`/listings/${id}`);
  })
);

// DELETE ROUTE

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

// SHOW ROUTE

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});
