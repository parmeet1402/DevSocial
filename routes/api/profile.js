const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../models/Profile"); //load profile model
const User = require("../models/User"); //load user model
//set up a router
const router = express.Router();

// set the route

// Route  --> GET api/profile/test
// Desc   --> Test profile route
// Access --> Public
router.get("/test", (req, res) =>
  res.json({
    message: "profile works"
  })
);

// Route  --> GET api/profile
// Desc   --> current user profile
// Access --> Private
router.get("/",passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {};
  Profile.findOne({user: req.user.id}).then(profile=>{
    if(!profile){
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }
    res.json(profile);
  }).catch(err=> res.status(404).json(err));
});

// expose the router constant to server.js
module.exports = router;
