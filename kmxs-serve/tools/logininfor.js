/*
 * @Author: Songjq
 * @Date: 2022-01-26 09:14:34
 * @Desscription: 写入登录日志
 */

// 引入相关模块
const Logininfor = require("../models/log/Login");
const User = require("../models/system/User");

module.exports = async function logininforFn(data) {

    // 1.获取当前用户信息
    /**
     * loginType
     * account:账号登录   email:邮箱登录   phone:短信登录
     */
    let searchData = {}

    switch (data.loginType) {
        case "account":
            searchData = { userno: new RegExp(data.userno) }
            break;

        case "email":
            searchData = { email: new RegExp(data.email) }
            break;

        case "phone":
            searchData = { phone: new RegExp(data.phone) }
            break;
    }

    const findUserResult = await User.findOne(searchData);

    // 2.封装登录日志需要存储的数据
    let updata = {
        msg: data.msg,
        status: data.status,
        type: data.loginType,
        userno: findUserResult ? findUserResult.userno : null,
        username: findUserResult ? findUserResult.username : null,
        role: findUserResult ? findUserResult.role : null,
    };

    // 3.存储登录日志数据
    const newLogininfor = new Logininfor(Object.assign(updata, global.loginInfo));

    // 4.存储到数据库
    newLogininfor.save();
};