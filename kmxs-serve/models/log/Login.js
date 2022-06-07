/*
 * @Author: Songjq
 * @Date: 2021-12-19 22:02:31
 * @Desscription: 登录日志
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const LogininforSchema = new Schema({
    username: {
        type: String,
    },
    userno: {
        type: String,
    },
    // 登录方式
    type: {
        type: String,
    },
    // 角色
    role: {
        type: String,
    },
    MACAddr: {
        type: String,
    },
    ipaddr: {
        type: String,
    },
    location: {
        type: String,
    },
    browser: {
        type: String,
    },
    os: {
        type: String,
    },
    status: {
        // 0 成功   1 失败
        type: String,
    },
    msg: {
        type: String,
    },
    loginTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Logininfor = mongoose.model("logininfor", LogininforSchema);