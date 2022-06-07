/*
 * @Author: Songjq
 * @Date: 2021-12-19 22:02:31
 * @Desscription: 操作日志
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logSchema = new Schema({
    username: {
        type: String,
        // required: true,
    },
    userno: {
        type: String,
    },
    shortUrl: {
        type: String,
    },
    method: {
        type: String,
    },
    host: {
        type: String,
    },
    url: {
        type: String,
    },
    params: {
        type: String,
    },
    body: {
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
    status: {
        // 0 成功   1 失败
        type: String,
    },
    desc: {
        type: String,
    },
    date: { type: Date, default: Date.now },
});

module.exports = OperLog = mongoose.model("log", logSchema);