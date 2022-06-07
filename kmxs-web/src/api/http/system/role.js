/*
 * @Author: Songjq
 * @Date: 2021-12-06 23:30:28
 * @Desscription: 角色管理
 */
import request from "@/api/request";

// 获取所有角色列表
export function getRoleAll(params) {
    return request({
        url: "api/role/all",
        method: "get",
        params
    });
}

// 新增角色
export function add(data) {
    return request({
        url: "api/role",
        method: "post",
        data
    });
}

// 编辑角色
export function edit(data) {
    return request({
        url: "api/role",
        method: "put",
        data
    });
}

// 批量删除角色
export function del(data) {
    return request({
        url: "api/role",
        method: "delete",
        data
    });
}

// 授权
export function postRolePerms(data) {
    return request({
        url: "api/role/perms",
        method: "post",
        data
    });
}

// 获取所有角色列表
export function getRoleAlls() {
    return request({
        url: "api/role/alls",
        method: "get",
    });
}

export function enable(data) {
    return request({
        url: "api/role/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/role/disable",
        method: "post",
        data
    });
}

export default {
    getRoleAll,
    getRoleAlls,
    add,
    edit,
    del,
    postRolePerms,
    enable,
    disable
};