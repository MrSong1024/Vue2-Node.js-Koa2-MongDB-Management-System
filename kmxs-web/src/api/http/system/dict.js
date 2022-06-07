/*
 * @Author: Songjq
 * @Date: 2021-12-06 23:30:28
 * @Desscription:
 */
import request from "@/api/request";

// 公共方法-用于封装
export function get(dictType) {
    const params = {
        dictType,
        page: 0,
        size: 9999
    };
    return request({
        url: "api/dict/all",
        method: "get",
        params
    });
}

// 获取所有字典列表
export function getDictAll(params) {
    return request({
        url: "api/dict/all",
        method: "get",
        params
    });
}

// 新增
export function add(data) {
    return request({
        url: "api/dict",
        method: "post",
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: "api/dict",
        method: "put",
        data
    });
}

// 批量删除字典
export function del(data) {
    return request({
        url: "api/dict",
        method: "delete",
        data
    });
}

export function enable(data) {
    return request({
        url: "api/dict/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/dict/disable",
        method: "post",
        data
    });
}

export default {
    getDictAll,
    add,
    edit,
    del,
    enable,
    disable
};