/*
 * @Author: Songjq
 * @Date: 2021-12-19 22:02:31
 * @Desscription: 登录日志
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const OnlineSchema = new Schema({
    // 会话编号
    tokenId: {
        type: String,
    },
    // 用户账号
    userno: {
        type: String,
    },
    // 用户姓名
    username: {
        type: String,
    },
    // 登录方式
    type: {
        type: String,
    },
    // 部门名称
    department: {
        type: String,
    },
    // 登录IP
    ipaddr: {
        type: String,
    },
    // 登录地点
    location: {
        type: String,
    },
    // 浏览器
    browser: {
        type: String,
    },
    // 过期时间
    exp: {
        type: String,
    },
    loginTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Online = mongoose.model("online", OnlineSchema);