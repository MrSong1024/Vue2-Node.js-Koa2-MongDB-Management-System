/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:
 */
const Validator = require("validator");
const jsencrypt = require("../config/jsencrypt"); // 解密
const Policy = require("../models/login/Policy");
const User = require("../models/system/User");
const bcrypt = require("bcryptjs");

/**
 * 密码策略校验
 * 
 * @param {String} newPassword 新密码
 * @param {String} oldPassword 旧密码
 * @param {String} userNo 用户唯一标识  账号/邮箱/手机号
 * @param {Boolean} isRegister 是否为用户注册
 * @param {Function} callback 回调函数
 */
async function passwordPolicy(newPassword, oldPassword, userNo, isRegister, callback) {
    let messages = [], // 错误提示列表
        _password = jsencrypt.decrypt(newPassword); // 密码解密

    // 1.获取密码策略及用户信息
    let findPolicy = await Policy.findOne(),
        findUser = await User.findOne({
            $or: [
                { userno: new RegExp(userNo) },
                { email: new RegExp(userNo) },
                { phone: new RegExp(userNo) },
            ]
        });

    // 2.验证密码最小长度
    if (findPolicy.smallLength !== 0 && !Validator.isLength(_password, { min: findPolicy.smallLength })) {
        messages.push(`密码最小长度不能小于${findPolicy.smallLength}位`)
    }

    // 3.验证密码最大长度
    if (findPolicy.bigLength !== 0 && !Validator.isLength(_password, { max: findPolicy.bigLength })) {
        messages.push(`密码最大长度不能超过${findPolicy.bigLength}位`)
    }

    // 4.密码最短使用期限(天) - 非注册状态下验证
    if (findPolicy.useShortTime !== 0 && !isRegister && findUser) {

        // 排序
        function compare(date) {
            return (a, b) => {
                let v1 = a[date]
                let v2 = b[date]
                return v2 - v1
            }
        }
        let passwords = findUser.passwords.sort(compare("date")),
            pCreateTime = passwords[0].date,
            nowExpire = new Date().getTime(),
            days = Math.floor(parseInt(nowExpire - new Date(pCreateTime).getTime()) / 1000 / 60 / 60 / 24);
        if (days < findPolicy.useShortTime) {
            messages.push(`密码最短使用期限不能小于${findPolicy.useShortTime}天`)
        }
    }

    // 5.重复的数字或字母（位）
    if (findPolicy.repeatTimes !== 0) {
        let index = findPolicy.repeatTimes - 1;
        const reg = new RegExp("([a-zA-Z0-9])\\1{" + index + "}");
        if (reg.test(_password)) {
            messages.push(`密码不能包含${findPolicy.repeatTimes}个重复的数字或字母`)
        }
    }

    // 6.连续的数字（位）
    if (findPolicy.continuityTimes !== 0) {
        let index = findPolicy.continuityTimes - 1;
        const reg = new RegExp("\(0\(?=1\)\|1\(?=2\)\|2\(?=3\)\|3\(?=4\)\|4\(?=5\)\|5\(?=6\)\|6\(?=7\)\|7\(?=8\)\|8\(?=9\)\){" + index + "}\\d");
        if (reg.test(_password)) {
            messages.push(`密码不能包含${findPolicy.continuityTimes}个连续的数字`)
        }
    }

    // 7.强制密码历史
    if (findPolicy.useHistoryTimes !== 0) {
        // 排序
        function compare(date) {
            return (a, b) => {
                let v1 = a[date]
                let v2 = b[date]
                return v2 - v1
            }
        }
        let passwords = findUser.passwords.sort(compare("date"));
        let passwordList = passwords.splice(0, 5);
        let isPass = false;
        passwordList.forEach(async (val) => {
            const pass = await bcrypt.compareSync(
                _password,
                val.password
            );

            if (pass) {
                isPass = true;
            }
        })
        if (isPass) {
            messages.push(`不可以使用之前${findPolicy.useHistoryTimes}次旧密码`)
        }
    }

    // 8.密码必须包含
    if (findPolicy.isInclude.length > 0) {
        findPolicy.isIncludes.forEach(val => {
            const reg = new RegExp(val.remark)
            if (!reg.test(_password)) {
                messages.push(`密码必须${val.label}`)
            }
        })
    }

    // 9.禁用弱密码组合
    if (findPolicy.isWeak) {
        // A.匹配6位顺增或者降序
        const regSix = /((0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){5}|(9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0)){5})\d/;

        // B.匹配6位重复的数字或者字母
        const regRepeat = /([a-zA-Z0-9])\1{5}/;

        // D.匹配手机号码类型的
        const regPhone = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;

        if (regSix.test(_password) || regRepeat.test(_password) || regPhone.test(_password)) {
            messages.push(`密码不能包含弱密码组合`)
        }
    }

    // 10.姓名及账号名校验
    if (findPolicy.isIncludeAccount && _password.indexOf(userNo) >= 0) {
        messages.push("密码不能包含账号名（不区分大小写）")
    }

    callback({
        messages
    });
}
exports.passwordPolicy = passwordPolicy;