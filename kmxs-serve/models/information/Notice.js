/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:通知公告模块
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const NoticeSchema = new Schema({
    createBy: {
        // 关联数据表
        type: String,
        ref: "users",
        required: true,
    },
    noticeTitle: {
        type: String,
        required: true,
    },
    noticeType: {
        type: String,
        required: true,
    },
    noticeContent: {
        type: String,
    },
    status: {
        type: String,
        required: true,
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

module.exports = Notice = mongoose.model("notice", NoticeSchema);