/*
 * @Author: Songjq
 * @Date: 2022-03-14 20:34:18
 * @Desscription: 短信管理模块
 */
import request from "@/api/request";

// 发送手机验证码
export function sendPhoneCode(data) {
    return request({
        url: "api/sms/sendCode",
        method: "post",
        data
    });
}

// 发送模板短信
export function sendMessage(data) {
    return request({
        url: "api/sms/sendMessage",
        method: "post",
        data
    });
}

// 下载短信模板
export function getDownTemplate() {
    return request({
        url: "api/sms/downTemplate",
        method: "get",
        responseType: "blob"
    });
}

// 批量获取短信状态报告、上行短信信息接口
export function getArrived(data) {
    return request({
        url: "api/sms/getArrived",
        method: "post",
        data
    });
}

export default {
    sendPhoneCode,
    sendMessage,
    getArrived,
    getDownTemplate,
};