/*
 * @Author: Songjq
 * @Date: 2022-01-26 09:21:24
 * @Desscription: 消息审批模块
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const ApproveSchema = new Schema({
    createBy: {
        // 关联数据表
        type: String,
        ref: "users",
        required: true,
    },
    approveTitle: {
        type: String,
        required: true,
    },
    approveType: {
        type: String,
        required: true,
    },
    approveContent: {
        type: String,
    },
    status: {
        type: String,
        required: true,
    },
    records: [{
        creater: {
            type: String,
        },
        approver: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
        },
        createTime: {
            type: Date,
            default: Date.now,
        },
    }],
    createTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Approve = mongoose.model("approve", ApproveSchema);