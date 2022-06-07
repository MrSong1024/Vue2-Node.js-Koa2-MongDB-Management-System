/*
 * @Author: Songjq
 * @Date: 2022-04-19 23:56:25
 * @Desscription: 岗位管理
 */
import request from "@/api/request";
// 新增
export function add(data) {
    return request({
        url: "api/post",
        method: "post",
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: "api/post",
        method: "put",
        data
    });
}

// 删除
export function del(data) {
    return request({
        url: "api/post",
        method: "delete",
        data
    });
}

// 查看所有用户
export function getPostAll(params) {
    return request({
        url: "api/post/all",
        method: "get",
        params
    });
}

export function enable(data) {
    return request({
        url: "api/post/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/post/disable",
        method: "post",
        data
    });
}

export default {
    add,
    edit,
    del,
    getPostAll,
    enable,
    disable
};