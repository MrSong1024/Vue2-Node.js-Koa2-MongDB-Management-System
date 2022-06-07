/*
 * @Author: Songjq
 * @Date: 2022-02-24 22:43:25
 * @Desscription: 登录管理 - 新设备
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const RemoteSchema = new Schema({
    // 参数名称
    name: {
        type: String
    },
    // 是否为新设备
    isRemote: {
        type: Boolean,
    },
    // 新设备通知
    isLoginNotice: {
        type: Boolean,
    },
    // 新设备通知方式
    noticeType: {
        type: String,
    },
    // 新设备二次认证
    isSecondAuth: {
        type: Boolean,
    },
    // 新设备二次认证方式
    isSecondAuthType: {
        type: Array,
    },
    // 新设备认证时间
    authTime: {
        type: String,
    },
    // 多台设备同时在线
    onceOnline: {
        type: Boolean,
    },
    // 排序
    orderNum: {
        type: Number
    },
    // 备注
    remark: {
        type: String,
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

module.exports = Remote = mongoose.model("remote", RemoteSchema);