const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';

  //Setting name validator to be between 2 and 30 characters
  if (!validator.isLength(data.name, {
      min: 2,
      max: 30
    })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};