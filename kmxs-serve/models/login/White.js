/*
 * @Author: Songjq
 * @Date: 2022-02-24 22:43:25
 * @Desscription: 登录管理 - 白名单
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const WhiteSchema = new Schema({
    // 名称
    name: {
        type: String,
        required: true,
    },
    // 访问IP起
    ipStart: {
        type: String,
        required: true,
    },
    // 访问IP止
    ipEnd: {
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

module.exports = White = mongoose.model("white", WhiteSchema);