/*
 * @Author: Songjq
 * @Date: 2021-12-11 23:55:16
 * @Desscription:
 */
const Validator = require("validator");
const isEmpty = require("./is-empty");
const jsencrypt = require("../config/jsencrypt"); // 解密

function validateUserInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : "";
    data.userno = !isEmpty(data.userno) ? data.userno : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.message = "名字的长度不能小于2位且不能超过30位";
    }

    if (Validator.isEmpty(data.username)) {
        errors.message = "用户名不能为空";
    }

    // if (!Validator.isuserno(data.userno)) {
    //   errors.message = "邮箱不合法";
    // }

    if (Validator.isEmpty(data.userno)) {
        errors.message = "账号不能为空";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
}
exports.validateUserInput = validateUserInput;