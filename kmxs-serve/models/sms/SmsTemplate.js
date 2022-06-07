/*
 * @Author: Songjq
 * @Date: 2022-03-15 23:26:31
 * @Desscription: 短信管理模块 => 短信模板
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const SmsTemplateSchema = new Schema({
    createBy: {
        // 关联用户集合
        type: String,
        ref: "users",
        required: true,
    },
    templateId: {
        type: Number,
    },
    templateName: {
        type: String,
        required: true,
    },
    // 签名
    templateSign: {
        type: String,
        required: true,
    },
    templateContent: {
        type: String,
        required: true,
    },
    // 变量内容
    variable: {
        type: String,
    },
    status: {
        type: String,
        required: true,
    },
    // 模板类型
    templateType: {
        type: String,
    },
    // 字数统计
    smsInfo: {
        type: String,
    },
    // 短信长度
    smsLength: {
        type: Number,
        default: 0,
    },
    // 短信条数
    smsCounts: {
        type: Number,
        default: 0,
    },
    // 备注
    remark: {
        type: String,
    },
    updateBy: {
        type: String,
    },
    updateTime: {
        type: Date,
    },
    createTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = SmsTemplate = mongoose.model("smsTemplate", SmsTemplateSchema);