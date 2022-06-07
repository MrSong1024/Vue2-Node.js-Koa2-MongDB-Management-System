const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, { min: 6, max: 30 })) {
    errors.text = 'text的长度不能小于10位且不能超过300位';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'text不能为空';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
