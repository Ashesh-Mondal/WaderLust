const express = require("express");
const app = express();
const PORT = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

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

app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// NEW ROUTE

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE ROUTE

app.post("/listings", async (req, res) => {
  // Way 1
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
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// EDIT ROUTE

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// UPDATE ROUTE

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = req.body.listing;
  console.log(listing);
  await Listing.findByIdAndUpdate(id, { ...listing });
  res.redirect(`/listings/${id}`);
});

// DELETE ROUTE

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// SHOW ROUTE

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});
