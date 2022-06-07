/*
 * @Author: Songjq
 * @Date: 2022-04-19 22:19:47
 * @Desscription: 部门管理
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const DeptSchema = new Schema({
    createBy: {
        // 关联数据表
        type: String,
        ref: "users",
        required: true,
    },
    parentId: {
        type: String,
    },
    parentName: {
        type: String,
    },
    deptId: {
        type: String,
    },
    deptName: {
        type: String,
    },
    // 排序
    orderNum: {
        type: Number
    },
    // 部门领导
    leader: {
        type: String,
    },
    // 联系电话
    phone: {
        type: String,
    },
    // 联系邮箱
    email: {
        type: String,
    },
    status: {
        type: String,
    },
    updateBy: {
        type: String,
    },
    updateTime: {
        type: Date,
    },
    children: [],
    remark: {
        type: String,
    },
    createTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Dept = mongoose.model("dept", DeptSchema);