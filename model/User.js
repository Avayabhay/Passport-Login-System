const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userScheme = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pass: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userScheme);
