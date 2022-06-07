/*
 * @Author: Songjq
 * @Date: 2022-02-24 22:43:25
 * @Desscription: 登录管理 - 访问时间段
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const AccessSchema = new Schema({
    // 名称
    name: {
        type: String,
        required: true,
    },
    times: {
        type: Array,
    },
    // 起始时间
    startTime: {
        type: String,
    },
    // 截止时间
    endTime: {
        type: String,
    },
    // 排序
    orderNum: {
        type: Number
    },
    status: {
        type: String,
        required: true,
    },
    // 备注
    remark: {
        type: String,
    },
    // 创建人
    createBy: {
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

module.exports = Access = mongoose.model("access", AccessSchema);