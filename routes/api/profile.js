const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validator = require('validator');
const cors = require('cors');

//Load Validation For Profile
const validateProfileInput = require('../../validation/profile');

//Load Profile Model
const Profile = require('../../models/Profile');
//Load User Profile
const User = require('../../models/User');


// @route GET api/profile/test
// @desc  tests profile route
// @access Public
router.get('/test', (req, res) => res.json({
  msg: "Profile Works"
}));

// @route GET api/profile
// @desc  Get current user profile
// @access Private
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {};

  Profile.findOne({
      user: req.user.id
    })
    .populate('user', ['name', 'avatar', 'email'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route GET api/profile/handle/:handle
// @desc  Get profile by handle
// @access Private
router.get('/handle/:handle', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {};

  Profile.findOne({
      handle: req.params.handle
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by user ID
// @access Private
router.get('/user/:user_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {};

  Profile.findOne({
      user: req.params.user_id
    })
    .populate('user', ['name', 'avatar', 'email'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({
      profile: 'There is no profile for this user'
    }));
});

// @route GET api/profile/all
// @desc  Get all profiles
// @access Private
router.get('/all', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar', 'email'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({
      profiles: 'There are no profiles'
    }));
});


router.get('/find/:query', cors(), (req, res) => {
  var query = req.params.query;
  const errors = {};

  Profile.find({
    'request': query
  }, (err, result) => {
    if (err) throw err;
    if (result) {
      res.json(result);
    } else {
      res.status(404);
    }
  });
});


// @route POST api/profile
// @desc  Create user profile
// @access Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateProfileInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }
  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  //Skills - Split Into Array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }
  //Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

  Profile.findOne({
      user: req.body.id
    })
    .then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate({
            user: req.user.id
          }, {
            $set: profileFields
          }, {
            new: true
          })
          .then(profile => res.json(profile));
      } else {
        // Create Profile

        // Check If Handle Exists
        Profile.findOne({
            handle: profileFields.handle
          })
          .then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists';
              res.status(400).json(errors);
            }

            // Save Profile
            new Profile(profileFields).save().then(profile => res.json(profile));
          });
      }
    });
});

module.exports = router;