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
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// Route  --> POST api/profile/
// Desc   --> create user profile
// Access --> Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};
    const errors = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
      // split skills comma(,) seprated into an array
    if(typeof req.body.handle !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
      if(req.body.bio) profileFields.bio = req.body.bio;
      if(req.body.githubusername) profileFields.githubusername = req.body.githubusername,
     /*  //education
      profileFields.education = {};
      
      experience: [
        {
          title: req.body.experience.title,
          company: req.body.experience.company,
          location: req.body.experience.location,
          from: req.body.experience.from,
          to: req.body.experience.to,
          current: req.body.experience.current,
          description: req.body.description
        }
      ],
      
      //education
      profileFields.education = {};
      
      if(req.body.school) profileFields.education.school = req.body.school;
          degree: req.body.education.degree,
          fieldofstudy: req.body.education.fieldofstudy,
          from: req.body.education.from,
          to: req.body.education.to,
          current: req.body.education.current,
          description: req.body.education.description
        }
      ], */
      //social
      profileFields.social = {};
      if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
      if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
      if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
      if(req.body.instagram) profileFields.social.instagram = req.body.instagram,;
      if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

      // date
      if(req.body.date) profileFields.date = req.body.date;


      Profile.findOne({user: req.user.id}).then(profile=>{
        if(profile){
          //update
          Profile.findOneAndUpdate(
            {user: req.user.id},
            {$set: profileFields},
            {new: true}
          ).then(profile=> res.json(profile));
        }else{
          //create

          // check if handle exists
          Profile.findOne({handle: profileFields.handle}).then(profile => {
            if(profile){
              errors.handle = 'That handle already exists';
              res.status(400).json(errors);
            }

            // save profile
            new Profile(profileFields).save().then(profile=> res.json(profile)); 
          })
        }
      })
  }
);

// expose the router constant to server.js
module.exports = router;
