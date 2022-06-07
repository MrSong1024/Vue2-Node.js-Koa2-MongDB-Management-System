/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:角色管理模块
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const RoleSchema = new Schema({
    createBy: {
        // 关联用户集合
        type: String,
        ref: "users",
        required: true,
    },
    roleName: {
        type: String,
        required: true,
    },
    roleKey: {
        type: String,
        required: true,
    },
    // 排序
    orderNum: {
        type: Number
    },
    remark: {
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
    permissions: [], // 权限集合
    createTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Role = mongoose.model("role", RoleSchema);