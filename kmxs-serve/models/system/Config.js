/*
 * @Author: Songjq
 * @Date: 2022-02-24 22:43:25
 * @Desscription: 系统参数
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const ConfigSchema = new Schema({
    // 参数名称
    configName: {
        type: String,
        required: true,
    },
    // 参数键名
    configKey: {
        type: String,
        required: true,
    },
    // 参数键值
    configValue: {
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

module.exports = Config = mongoose.model("config", ConfigSchema);