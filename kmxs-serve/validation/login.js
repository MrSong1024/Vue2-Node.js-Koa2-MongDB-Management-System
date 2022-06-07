/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:
 */
const Validator = require("validator");
const isEmpty = require("./is-empty");
const jsencrypt = require("../config/jsencrypt"); // 解密

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.userno = !isEmpty(data.userno) ? data.userno : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.userno) && data.loginType == "account") {
    errors.message = "账号不能为空";
  }

  if (Validator.isEmpty(data.email) && data.loginType == "email") {
    errors.message = "邮箱不能为空";
  }

  if (Validator.isEmpty(data.password)) {
    errors.message = "密码不能为空";
  }

  if (
    !Validator.isLength(jsencrypt.decrypt(data.password), { min: 6, max: 30 })
  ) {
    errors.message = "密码长度不能小于6位且不能超过30位";
  }

  // if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
  //   errors.password = "password的长度不能小于6位且不能超过30位";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
