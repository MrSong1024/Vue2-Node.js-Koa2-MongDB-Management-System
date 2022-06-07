/*
 * @Author: Songjq
 * @Date: 2022-04-02 00:41:09
 * @Desscription: 发送回执
 */
import request from "@/api/request";

// 发送回执列表
export function getSmsReturnRecordAll(params) {
    return request({
        url: "api/sms/returnRecord/all",
        method: "get",
        params
    });
}

// 批量删除发送回执
export function del(data) {
    return request({
        url: "api/sms/returnRecord",
        method: "delete",
        data
    });
}

// 概览-短信发送统计
export function getSmsReturnRecordChart(params) {
    return request({
        url: "api/sms/returnRecord/chart",
        method: "get",
        params
    });
}

export default {
    getSmsReturnRecordAll,
    getSmsReturnRecordChart,
    del
};