/*
 * @Author: Songjq
 * @Date: 2022-02-26 16:35:55
 * @Desscription: 充值订单
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const OrderSchema = new Schema({
    createBy: {
        // 关联数据表
        type: String,
        ref: "users",
        required: true,
    },
    // 订单编号
    orderNo: {
        type: String,
        required: true,
    },
    // 订单金额
    money: {
        type: String,
    },
    // 充值状态
    status: {
        type: String,
    },
    // 支付类型
    type: {
        type: String,
        required: true,
    },
    // 订单标题
    subject: {
        type: String,
    },
    // 订单描述
    body: {
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
    createTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Order = mongoose.model("order", OrderSchema);