const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

// Create Profile Schema
const ProfileSchema = new Schema({
  user: {
    // Links Profile To User ID!!!!
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  company: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    // For Interests Section!!!
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [{ //embedded arrays
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true
    },
    location: {
      type: String,
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    }
  }],
  education: [{ //embedded arrays
    school: {
      type: String
    },
    degree: {
      type: String
    },
    fieldofstudy: {
      type: String
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    }
  }],
  social: {
    youtube: {
      type: String
    },
    facebook: {
      type: String
    },
    twitter: {
      type: String
    },
    instagram: {
      type: String
    },
    linkedin: {
      type: String
    }
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

module.exports = Profile = mongoose.model('profile', ProfileSchema);