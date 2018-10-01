const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../models/Profile"); //load profile model
const User = require("../models/User"); //load user model
const validateProfileInput = require("../../validation/profile"); //importss validation
const validateExperienceInput = require("../../validation/experience"); //importss validation
const validateEducationInput = require("../../validation/education"); //importss validation
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
      .populate("user", ["name", "avatar"])
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

// Route  --> GET api/profile/all
// Desc   --> GET all profiles
// Access --> Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

// Route  --> GET api/profile/handle/:handle
// Desc   --> GET profile by handle
// Access --> Public

router.get("/handle/:handle", (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// Route  --> GET api/profile/user/:user_id
// Desc   --> GET profile by user ID
// Access --> Public

router.get("/user/:user_id", (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

// Route  --> POST api/profile/
// Desc   --> create user profile
// Access --> Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};
    const { errors, isValid } = validateProfileInput(req.body);

    // check validation
    if (!isValid) {
      // return any errors
      return res.status(400).json(errors);
    }
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    // split skills comma(,) seprated into an array
    if (typeof req.body.handle !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      (profileFields.githubusername = req.body.githubusername),
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
        (profileFields.social = {});
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    // date
    if (req.body.date) profileFields.date = req.body.date;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //create

        // check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) { 
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// Route  --> POST api/profile/experience
// Desc   --> Add experience
// Access --> Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // add tp experience array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// Route  --> POST api/profile/education
// Desc   --> Add education
// Access --> Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEducation = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // add to education array
      profile.education.unshift(newEducation);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// Route  --> DELETE api/profile/experience/:exp_id
// Desc   --> delete experience
// Access --> Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        //splice out of array
        profile.experience.splice(removeIndex, 1);

        //save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// Route  --> DELETE api/profile/education/:edu_id
// Desc   --> delete education
// Access --> Private
router.delete(
  "/education/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        //splice out of array
        profile.education.splice(removeIndex, 1);

        //save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// Route  --> DELETE api/profile
// Desc   --> delete profile and USER too
// Access --> Private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
  }
);

// expose the router constant to server.js
module.exports = router;
