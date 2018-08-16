const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');

// Routes are included in this file
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// set up Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect with mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => conosle.log(err));

// Passport Middleware
app.use(passport.initialize()); 

// Passport config
require('./config/passport.js')(passport);

// routes are set up
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Port number
const port = process.env.PORT || 5000;

// Setting up server port and callback func
app.listen(port, () => console.log(`Server is running on ${port}`));
