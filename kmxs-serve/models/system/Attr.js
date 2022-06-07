/*
 * @Author: Songjq
 * @Date: 2022-02-24 22:43:25
 * @Desscription: 拓展属性
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const AttrSchema = new Schema({
    // 属性名称
    attrName: {
        type: String,
    },
    // 字段名称
    attrKey: {
        type: String,
    },
    // 所属类型
    attrType: {
        type: String,
    },
    // 状态
    status: {
        type: String,
    },
    // 属性长度
    length: {
        type: String,
    },
    // 属性类型
    component: {
        type: String,
    },
    // 绑定的值
    value: {
        type: String,
    },
    // 关联属性
    options: {
        type: Array,
    },
    // 排序
    orderNum: {
        type: Number
    },
    // 属性说明
    remark: {
        type: String,
    },
    // 新增时编辑
    editableInAdd: {
        type: Boolean,
    },
    // 新增时显示
    visibleInAdd: {
        type: Boolean,
    },
    // 新增时必填
    requiredInAdd: {
        type: Boolean,
    },
    // 编辑时显示
    visibleInEdit: {
        type: Boolean,
    },
    // 编辑时必填
    requiredInEdit: {
        type: Boolean,
    },
    // 编辑时编辑
    editableInEdit: {
        type: Boolean,
    },
    // 详情时显示
    visibleInDetail: {
        type: Boolean,
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

module.exports = Attr = mongoose.model("attr", AttrSchema);