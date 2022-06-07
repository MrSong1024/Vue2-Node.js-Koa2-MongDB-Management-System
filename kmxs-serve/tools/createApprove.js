/*
 * @Author: Songjq
 * @Date: 2022-01-26 09:19:54
 * @Desscription: 创建消息审批 - 未开发模块
 */
// 引入相关模块
const Approve = require("../models/Approve");
const User = require("../models/system/User");

/**
 * @param {*} 
 */
module.exports = async function approveFn(data) {
    // 获取当前用户信息
    const searchData =
        data.loginType == "account" ? { userno: data.userno } : { email: data.email };
    const findUserResult = await User.findOne(searchData);
    // 封装登录日志需要存储的数据
    let updata = {
        msg: data.msg,
        status: data.status,
        userno: findUserResult ? findUserResult.userno : null,
        username: findUserResult ? findUserResult.username : null,
        role: findUserResult ? findUserResult.role : null,
    };

    // 存储登录日志数据
    const newApprove = new Approve(Object.assign(updata, global.loginInfo));

    // 存储到数据库
    newApprove.save();
};