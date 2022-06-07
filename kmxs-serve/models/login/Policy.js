/*
 * @Author: Songjq
 * @Date: 2022-02-24 22:43:25
 * @Desscription: 登录管理 - 密码策略
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const PolicySchema = new Schema({
    // 密码最小长度
    smallLength: {
        type: Number
    },
    // 密码最大长度
    bigLength: {
        type: Number
    },
    // 密码最短使用期限（天）
    useShortTime: {
        type: Number
    },
    // 密码最长使用期限（天）
    useLongTime: {
        type: Number
    },
    // 重复的数字或字母
    repeatTimes: {
        type: Number
    },
    // 连续的数字
    continuityTimes: {
        type: Number
    },
    // 强制密码历史
    useHistoryTimes: {
        type: Number
    },
    // 密码必须包含
    isInclude: {
        type: Array,
    },
    isIncludes: {
        type: Array,
    },
    // 禁用弱密码组合
    isWeak: {
        type: Boolean
    },
    // 姓名及账号名校验
    isIncludeAccount: {
        type: Boolean
    },
    // 创建时间
    createTime: {
        type: Date,
        default: Date.now,
    },
    // 更新人员
    updateBy: {
        type: String,
    },
    // 更新时间
    updateTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Policy = mongoose.model("policy", PolicySchema);