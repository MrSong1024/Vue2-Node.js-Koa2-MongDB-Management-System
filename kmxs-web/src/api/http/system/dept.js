/*
 * @Author: Songjq
 * @Date: 2022-04-19 22:27:50
 * @Desscription: 部门管理
 */
import request from "@/api/request";

// 菜单列表
export function getDeptAll(params) {
    return request({
        url: "api/dept/all",
        method: "get",
        params
    });
}

// 新增
export function add(data) {
    return request({
        url: "api/dept",
        method: "post",
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: "api/dept",
        method: "put",
        data
    });
}

// 删除
export function del(data) {
    return request({
        url: "api/dept",
        method: "delete",
        data
    });
}

// 获取树节点
export function getDeptTree(params) {
    return request({
        url: "api/dept/tree",
        method: "get",
        params
    });
}

// 获取所有树节点
export function getDeptTreeAll(params) {
    return request({
        url: "api/dept/treeAll",
        method: "get",
        params
    });
}

export function enable(data) {
    return request({
        url: "api/dept/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/dept/disable",
        method: "post",
        data
    });
}

export default {
    getDeptAll,
    getDeptTree,
    getDeptTreeAll,
    add,
    edit,
    del,
    enable,
    disable
};