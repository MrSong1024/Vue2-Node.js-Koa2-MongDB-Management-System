/*
 * @Author: Songjq
 * @Date: 2021-08-11 16:59:50
 * @Desscription:
 */
import request from "@/api/request";

// 查看所有
export function getDnsAll(params) {
    return request({
        url: "api/dns/all",
        method: "get",
        params
    });
}

// 新增
export function add(data) {
    return request({
        url: "api/dns",
        method: "post",
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: "api/dns",
        method: "put",
        data
    });
}

// 删除
export function del(data) {
    return request({
        url: "api/dns",
        method: "delete",
        data
    });
}

// 查看单条数据
export function getDns(params) {
    return request({
        url: "api/dns",
        method: "get",
        params
    });
}

export function enable(data) {
    return request({
        url: "api/dns/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/dns/disable",
        method: "post",
        data
    });
}

export default {
    getDnsAll,
    add,
    edit,
    del,
    getDns,
    enable,
    disable
};