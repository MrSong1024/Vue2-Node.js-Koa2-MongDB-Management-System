/*
 * @Author: Songjq
 * @Date: 2022-03-14 22:09:11
 * @Desscription: 短信管理模块 =》 短信发送记录
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const SmsSchema = new Schema({
    createBy: {
        // 关联用户集合
        type: String,
        ref: "users",
        required: true,
    },
    // 批次号
    resMsgid: {
        type: String,
        required: true,
    },
    // 电话号码集合
    phones: {
        type: String,
        required: true,
    },
    // 模板ID
    templateId: {
        type: Number,
        required: true,
    },
    // 短息内容
    smsContent: {
        type: String,
        required: true,
    },
    // 短信类型
    templateType: {
        type: String,
    },
    // 字符长度
    smsLength: {
        type: String,
    },
    // 短信条数
    smsCounts: {
        type: String,
    },
    // 信息详情
    smsInfo: {
        type: String,
    },
    // 短信费用
    unitPrice: {
        type: Number,
    },
    // 是否定时发送
    isTiming: {
        required: true,
        type: Boolean,
        default: false
    },
    // 定时发送
    timing: {
        type: Date,
    },
    // 状态
    status: {
        type: String,
        required: true,
    },
    // 编辑人
    updateBy: {
        type: String,
    },
    // 更新时间
    updateTime: {
        type: Date,
    },
    // 创建时间
    createTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = SmsSendRecord = mongoose.model("smsSendRecord", SmsSchema);