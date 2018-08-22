const express = require("express");
const User = require("../models/User"); // Load user model
const gravatar = require("gravatar"); // gravatar
const bcrypt = require("bcryptjs"); // bcrypt for password hashing
const jwt = require("jsonwebtoken"); // java web tokens
const keys = require("../../config/keys");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register"); // load input validation --> REGISTER
const validateLoginInput = require("../../validation/login"); // load input validation --> LOGIN

//set up a router
const router = express.Router();

// ------- Set the Routes ----------

// Route  --> GET api/users/
// Desc   --> Tests users route
// Access --> Public
router.get("/test", (req, res) => res.json({ message: "Users works" }));

// Route  --> POST api/users/register
// Desc   --> Register a user
// Access --> Public
router.post("/register", (req, res) => {
  // destruction
  const { errors, isValid } = validateRegisterInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      res.status(400).json(errors);
    } else {
      //creates the avatar from gravatar
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size of the avatar
        r: "pg", // rating
        d: "mm" // default icon
      });

      // creates the new user object
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      //hashes the password and saves it in the user object
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// Route  --> POST api/users/login
// Desc   --> Login User/ Returning JWT Token
// Access --> Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email }).then(user => {
    // check for user exists
    if (!user) {
      errors.email = "user not found";
      return res.status(404).json(errors);
    }

    // check for password
    // using compare method
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: "true",
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// Route  --> GET api/users/current
// Desc   --> Return current user
// Access --> Private
router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

// expose the router constant to server.js
module.exports = router;
