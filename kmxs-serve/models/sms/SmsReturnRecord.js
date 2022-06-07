/*
 * @Author: Songjq
 * @Date: 2022-03-14 22:09:11
 * @Desscription: 短信管理模块 => 短信回执
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
        // required: true,
    },
    // 模板ID
    templateId: {
        type: Number,
        // required: true,
    },
    // 短息内容
    smsContent: {
        type: String,
        // required: true,
    },
    // 短信类型
    templateType: {
        type: String,
    },
    // 运营商
    operator: {
        type: String,
    },
    // 归属地
    area: {
        type: String,
    },
    // 归属地+运营商
    area_operator: {
        type: String,
    },
    // 信息详情
    smsInfo: {
        type: String,
    },
    // 短信价格
    unitPrice: {
        type: Number,
    },
    // 功能操作标识 ，SMSArrived
    action: {
        type: String,
    },
    // REST API版本号，格式：YYYY-MM-DD
    apiVersion: {
        type: String,
    },
    /**
     * 当smsType=0时，该字段值手机回复的短信内容，utf8格式
     * 当smsType=1时，该字段的值为短信ID，即下行短信请求响应的smsMessageSid
     */
    content: {
        type: String,
    },
    /**
     * 到达状态描述，即运营商网关状态码
     * 当status非0且smsType=1时有效
     */
    deliverCode: {
        type: String,
    },
    // 发送/接收短信的手机号码，以1开头的11位号码
    fromNum: {
        type: String,
    },
    // 第三方自定义消息id  smsType=1时有效
    reqId: {
        type: Number,
    },
    // 下行短信计费条数  smsType=1时有效
    smsCount: {
        type: Number,
    },
    // 0:上行短信数据 1:短信状态报告
    smsType: {
        type: Number,
    },
    // 下行通道码号
    spCode: {
        type: String,
    },
    // 短信到达状态, 0为接收成功，其它值为接收失败
    status: {
        type: String,
    },
    // 短信送达手机时间，格式：yyyyMMddHHmmss
    recvTime: {
        type: String,
    },
    // 短信发送时间，格式：yyyyMMddHHmmss  smsType=1时有效
    dateSent: {
        type: String,
    },
    createTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = SmsReturnRecord = mongoose.model("smsReturnRecord", SmsSchema);