/*
 * @Author: Songjq
 * @Date: 2022-04-28 23:33:41
 * @Desscription: 登录管理 - 黑名单
 */
import request from "@/api/request";

export function getBlackAll(params) {
    return request({
        url: "api/black/all",
        method: "get",
        params
    });
}

export function add(data) {
    return request({
        url: "api/black",
        method: "post",
        data
    });
}

export function edit(data) {
    return request({
        url: "api/black",
        method: "put",
        data
    });
}

export function del(data) {
    return request({
        url: "api/black",
        method: "delete",
        data
    });
}

export function enable(data) {
    return request({
        url: "api/black/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/black/disable",
        method: "post",
        data
    });
}

export default {
    getBlackAll,
    add,
    edit,
    del,
    enable,
    disable
};