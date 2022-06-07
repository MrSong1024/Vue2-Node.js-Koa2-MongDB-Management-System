/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:菜单管理模块
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const MenuSchema = new Schema({
    createBy: {
        // 关联数据表
        type: String,
        ref: "users",
        required: true,
    },
    parentId: {
        type: String,
        required: true,
    },
    parentName: {
        type: String,
    },
    menuId: {
        type: String,
    },
    menuName: {
        type: String,
        required: true,
    },
    menuType: {
        // M C B
        type: String,
        required: true,
    },
    // 排序
    orderNum: {
        type: Number
    },
    component: {
        // 组件路径
        type: String,
    },
    componentName: {
        // 组件名称
        type: String,
    },
    path: {
        // 路由地址
        type: String,
    },
    hidden: {
        type: Boolean,
        required: true,
    },
    alwaysShow: {
        type: Boolean,
    },
    status: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    permission: {
        // 权限标识
        type: String,
    },
    redirect: {
        type: String,
    },
    updateBy: {
        type: String,
    },
    updateTime: {
        type: Date,
    },
    meta: {
        type: Object,
    },
    children: [], // 菜单权限ID
    remark: {
        type: String,
    },
    createTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Menu = mongoose.model("menu", MenuSchema);