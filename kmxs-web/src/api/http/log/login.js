/*
 * @Author: Songjq
 * @Date: 2021-12-05 22:20:08
 * @Desscription: 日志管理模块
 */
import request from "@/api/request";

// 获取登录日志列表
export function getLogininforAll(params) {
    return request({
        url: "api/log/logininfor/all",
        method: "get",
        params
    });
}

// 删除登录日志
export function del(data) {
    return request({
        url: "api/log/logininfor",
        method: "delete",
        data
    });
}

export default {
    getLogininforAll,
    del,
};