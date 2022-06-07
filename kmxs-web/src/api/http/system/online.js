/*
 * @Author: Songjq
 * @Date: 2021-12-06 23:30:28
 * @Desscription:
 */
import request from "@/api/request";

// 获取所有字典列表
export function getOnlineAll(params) {
    return request({
        url: "api/online/all",
        method: "get",
        params
    });
}

// 强退
export function del(data) {
    return request({
        url: "api/online",
        method: "delete",
        data
    });
}

export default {
    getOnlineAll,
    del
};