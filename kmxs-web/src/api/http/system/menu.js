/*
 * @Author: Songjq
 * @Date: 2021-12-06 23:31:13
 * @Desscription:
 */
import request from "@/api/request";

// 菜单列表
export function getMenusAll(params) {
    return request({
        url: "api/menu/all",
        method: "get",
        params
    });
}

// 新增
export function add(data) {
    return request({
        url: "api/menu",
        method: "post",
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: "api/menu",
        method: "put",
        data
    });
}

// 删除
export function del(data) {
    return request({
        url: "api/menu",
        method: "delete",
        data
    });
}

// 菜单列表
export function getMenusBuild(params) {
    return request({
        url: "api/menu/build",
        method: "get",
        params
    });
}

// 获取树节点
export function getMenusTree(params) {
    return request({
        url: "api/menu/tree",
        method: "get",
        params
    });
}

// 获取所有树节点
export function getMenusTreeAll(params) {
    return request({
        url: "api/menu/treeAll",
        method: "get",
        params
    });
}

export function enable(data) {
    return request({
        url: "api/menu/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/menu/disable",
        method: "post",
        data
    });
}

export default {
    getMenusAll,
    getMenusTree,
    getMenusTreeAll,
    add,
    edit,
    del,
    getMenusBuild,
    enable,
    disable
};