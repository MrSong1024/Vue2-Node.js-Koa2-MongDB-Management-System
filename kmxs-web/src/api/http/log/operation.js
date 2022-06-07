/*
 * @Author: Songjq
 * @Date: 2021-12-05 22:20:08
 * @Desscription: 日志管理模块
 */
import request from "@/api/request";

// 获取操作日志列表
export function getLogOperLogAll(params) {
    return request({
        url: "api/log/operLog/all",
        method: "get",
        params
    });
}

// 删除操作日志
export function del(data) {
    return request({
        url: "api/log/operLog",
        method: "delete",
        data
    });
}

export default {
    getLogOperLogAll,
    del
};