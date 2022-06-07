/*
 * @Author: Songjq
 * @Date: 2021-08-11 16:59:50
 * @Desscription: 财务管理 - 充值订单
 */
import request from "@/api/request";

// 新增
export function add(data) {
    return request({
        url: "api/order",
        method: "post",
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: "api/order",
        method: "put",
        data
    });
}

// 删除单条数据
export function del(data) {
    return request({
        url: "api/order",
        method: "delete",
        data
    });
}

// 查看所有
export function getOrderAll(params) {
    return request({
        url: "api/order/all",
        method: "get",
        params
    });
}

// 查看单条数据
export function getOrder(params) {
    return request({
        url: "api/order",
        method: "get",
        params
    });
}

// 充值记录统计
export function postOrderChart(params) {
    return request({
        url: "api/order/chart",
        method: "get",
        params
    });
}

// 充值
export function alipay(data) {
    return request({
        url: "api/order/alipay",
        method: "post",
        data
    });
}

export function queryAlipay(data) {
    return request({
        url: "api/order/queryAlipay",
        method: "post",
        data
    });
}

export default {
    add,
    edit,
    del,
    getOrderAll,
    getOrder,
    postOrderChart,
    alipay,
    queryAlipay
};