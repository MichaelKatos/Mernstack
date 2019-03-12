const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  //Setting name validator to be between 2 and 30 characters
  if (!validator.isLength(data.name, {
      min: 2,
      max: 30
    })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}