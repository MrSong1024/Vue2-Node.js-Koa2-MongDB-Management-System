/*
 * @Author: Songjq
 * @Date: 2022-04-19 22:18:18
 * @Desscription: 岗位管理
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const PostSchema = new Schema({
    createBy: {
        // 关联数据表
        type: String,
        ref: "users",
        required: true,
    },
    // 用户昵称
    postName: {
        type: String,
        required: true,
    },
    // 账号
    postNo: {
        type: String,
        required: true,
    },
    // 排序
    orderNum: {
        type: Number
    },
    // 账号状态
    status: {
        type: String,
    },
    remark: {
        type: String,
    },
    updateBy: {
        type: String,
    },
    updateTime: {
        type: Date,
    },
    // 创建日期
    createTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Post = mongoose.model("post", PostSchema);