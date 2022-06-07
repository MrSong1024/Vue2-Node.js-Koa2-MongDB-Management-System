/*
 * @Author: Songjq
 * @Date: 2022-04-29 00:00:13
 * @Desscription: 登录管理 - 访问时间段
 */
import request from "@/api/request";

export function getAccessAll(params) {
    return request({
        url: "api/access/all",
        method: "get",
        params
    });
}

export function add(data) {
    return request({
        url: "api/access",
        method: "post",
        data
    });
}

export function edit(data) {
    return request({
        url: "api/access",
        method: "put",
        data
    });
}

export function del(data) {
    return request({
        url: "api/access",
        method: "delete",
        data
    });
}

export function enable(data) {
    return request({
        url: "api/access/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/access/disable",
        method: "post",
        data
    });
}

export default {
    getAccessAll,
    add,
    edit,
    del,
    enable,
    disable
};