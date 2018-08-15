const mongoose = require("mongoose");
const Schema = mongoose.schema;

// Create User Schema
// i.e. what fields will be present in User collection
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  date: { type: Date, default: Date.now, required: true }
});

// expose the schema to server.js
module.exports = User = mongoose.model("users", UserSchema);
