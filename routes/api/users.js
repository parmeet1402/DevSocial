const express = require("express");
const User = require("../models/User"); // Load user model
const gravatar = require("gravatar");   // gravatar
const bcrypt = require('bcryptjs');     // bcrypt for password hashing

//set up a router
const router = express.Router();

// ------- Set the Routes ----------

// Route  --> GET api/users/
// Desc   --> Tests users route
// Access --> Public
router.get("/", (req, res) =>
  res.json({
    message: "Users works"
  })
);

// Route  --> GET api/users/register
// Desc   --> Register a user
// Access --> Public
router.post("/register", (req, res) =>
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        res.status(400).json({ email: "Email already exists" });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", // size of the avatar
          r: "pg", // rating
          d: "mm" // default icon
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });
      }
    })
);

// expose the router constant to server.js
module.exports = router;
