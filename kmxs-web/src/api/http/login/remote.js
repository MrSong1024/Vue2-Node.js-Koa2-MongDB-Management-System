/*
 * @Author: Songjq
 * @Date: 2022-05-02 00:29:26
 * @Desscription: 登录管理 - 异地登录
 */
import request from "@/api/request";

export function getRemote(params) {
    return request({
        url: "api/remote",
        method: "get",
        params
    });
}

export function postRemote(data) {
    return request({
        url: "api/remote",
        method: "post",
        data
    });
}

export default {
    postRemote,
    getRemote
};