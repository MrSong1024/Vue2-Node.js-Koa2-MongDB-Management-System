/*
 * @Author: Songjq
 * @Date: 2021-08-11 16:59:50
 * @Desscription:
 */
import request from "@/api/request";

// 新增
export function add(data) {
    return request({
        url: "api/notice",
        method: "post",
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: "api/notice",
        method: "put",
        data
    });
}

// 查看所有
export function getNoticeAll(params) {
    return request({
        url: "api/notice/all",
        method: "get",
        params
    });
}

// 删除单条数据
export function del(data) {
    return request({
        url: "api/notice",
        method: "delete",
        data
    });
}

export function enable(data) {
    return request({
        url: "api/notice/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/notice/disable",
        method: "post",
        data
    });
}

export default {
    getNoticeAll,
    add,
    edit,
    del,
    enable,
    disable
};