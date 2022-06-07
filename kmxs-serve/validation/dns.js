/*
 * @Author: Songjq
 * @Date: 2021-12-05 16:02:29
 * @Desscription:
 */
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.shortUrl = !isEmpty(data.shortUrl) ? data.shortUrl : "";

  //   if (!Validator.isLength(data.text, { min: 6, max: 30 })) {
  //     errors.text = "text的长度不能小于10位且不能超过300位";
  //   }

  if (Validator.isEmpty(data.shortUrl)) {
    errors.message = "shortUrl不能为空";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
