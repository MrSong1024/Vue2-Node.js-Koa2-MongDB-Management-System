/*
 * @Author: Songjq
 * @Date: 2022-04-28 22:24:51
 * @Desscription: 登录管理 - 白名单
 */
import request from "@/api/request";

export function getWhiteAll(params) {
    return request({
        url: "api/white/all",
        method: "get",
        params
    });
}

export function add(data) {
    return request({
        url: "api/white",
        method: "post",
        data
    });
}

export function edit(data) {
    return request({
        url: "api/white",
        method: "put",
        data
    });
}

export function del(data) {
    return request({
        url: "api/white",
        method: "delete",
        data
    });
}

export function enable(data) {
    return request({
        url: "api/white/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/white/disable",
        method: "post",
        data
    });
}

export default {
    getWhiteAll,
    add,
    edit,
    del,
    enable,
    disable
};