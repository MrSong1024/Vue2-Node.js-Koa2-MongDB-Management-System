/*
 * @Author: Songjq
 * @Date: 2022-05-02 00:29:26
 * @Desscription: 登录管理 - 密码策略
 */
import request from "@/api/request";

export function getPolicy(params) {
    return request({
        url: "api/policy",
        method: "get",
        params
    });
}

export function postPolicy(data) {
    return request({
        url: "api/policy",
        method: "post",
        data
    });
}

export default {
    postPolicy,
    getPolicy
};