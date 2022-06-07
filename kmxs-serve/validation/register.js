/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:
 */
const Validator = require("validator");
const isEmpty = require("./is-empty");
const jsencrypt = require("../config/jsencrypt"); // 解密

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.code = !isEmpty(data.code) ? data.code : "";
    // data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.message = "名字的长度不能小于2位且不能超过30位";
    }

    if (Validator.isEmpty(data.username)) {
        errors.message = "用户名不能为空";
    }

    // if (!Validator.isEmail(data.email)) {
    //   errors.message = "邮箱不合法";
    // }

    if (Validator.isEmpty(data.userno)) {
        errors.message = "账号不能为空";
    }

    if (Validator.isEmpty(data.password)) {
        errors.message = "密码不能为空";
    }

    if (Validator.isEmpty(data.code)) {
        errors.message = "验证码不能为空";
    }

    // if (
    //     !Validator.isLength(jsencrypt.decrypt(data.password), { min: 6, max: 30 })
    // ) {
    //     errors.message = "password的长度不能小于6位且不能超过30位";
    // }

    // if (Validator.isEmpty(data.password2)) {
    //   errors.message = "password2不能为空";
    // }

    // if (
    //   !Validator.equals(
    //     jsencrypt.decrypt(data.password),
    //     jsencrypt.decrypt(data.password2)
    //   )
    // ) {
    //   errors.message = "两次密码不一致";
    // }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};