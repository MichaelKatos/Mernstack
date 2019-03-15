const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    default: moment().format('LLLL')
  },
  locale: {
    type: String,
    default: moment().locale()
  }
});

module.exports = User = mongoose.model('users', UserSchema);