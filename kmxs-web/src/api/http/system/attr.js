/*
 * @Author: Songjq
 * @Date: 2021-12-06 23:30:28
 * @Desscription: 拓展属性
 */
import request from "@/api/request";

export function getAttrAll(params) {
    return request({
        url: "api/attr/all",
        method: "get",
        params
    });
}

export function add(data) {
    return request({
        url: "api/attr",
        method: "post",
        data
    });
}

export function edit(data) {
    return request({
        url: "api/attr",
        method: "put",
        data
    });
}

export function del(data) {
    return request({
        url: "api/attr",
        method: "delete",
        data
    });
}

export function enable(data) {
    return request({
        url: "api/attr/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/attr/disable",
        method: "post",
        data
    });
}

export default {
    getAttrAll,
    add,
    edit,
    del,
    enable,
    disable
};