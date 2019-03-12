const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require('../../validation/register');

const User = require('../../models/User');

// @route GET api/users/test
// @desc  tests users route
// @access Public
router.get('/test', (req, res) => res.json({
  msg: "Users Works"
}));

// @route GET api/users/register
// @desc  Register User
// @access Public
router.post('/register', (req, res) => {
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', //size
          r: 'pg', // rating
          d: 'mm' //default
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        //Encrypt Password
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

// @route GET api/users/login
// @desc  Login User  // Return "JWT" Token
// @access Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find User By email
  User.findOne({
      email
    })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          email: 'User not found'
        });
      }

      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // res.json({
          // User Matched
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          } // Created JWT Payload
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey, {
              expiresIn: 3600
            },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            });
          // });
        } else {
          return res.status(400).json({
            password: "Password Incorrect"
          });
        }
      });
    });
});

// @route GET api/users/current
// @desc  Return Current User
// @access Private
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json(req.user);
});

module.exports = router;