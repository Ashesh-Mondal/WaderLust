const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

User.plugin(passportLocalMongoose); // automatically provides username, hashing, salting, hasing password and need not to be built from scratch

model.exports = User;
