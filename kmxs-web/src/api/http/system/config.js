/*
 * @Author: Songjq
 * @Date: 2022-02-24 22:53:00
 * @Desscription: 参数配置
 */
import request from "@/api/request";

// 获取所有角色列表
export function getConfigAll(params) {
    return request({
        url: "api/config/all",
        method: "get",
        params
    });
}

// 新增
export function add(data) {
    return request({
        url: "api/config",
        method: "post",
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: "api/config",
        method: "put",
        data
    });
}

// 批量删除角色
export function del(data) {
    return request({
        url: "api/config",
        method: "delete",
        data
    });
}

export function enable(data) {
    return request({
        url: "api/config/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/config/disable",
        method: "post",
        data
    });
}

export default {
    getConfigAll,
    add,
    edit,
    del,
    enable,
    disable
};