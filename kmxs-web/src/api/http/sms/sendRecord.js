/*
 * @Author: Songjq
 * @Date: 2022-04-02 00:12:53
 * @Desscription: 发送记录
 */
import request from "@/api/request";

// 发送记录列表
export function getSmsSendRecordAll(params) {
    return request({
        url: "api/sms/sendRecord/all",
        method: "get",
        params
    });
}

// 查看记录详情
export function getSmsSendRecord(params) {
    return request({
        url: "api/sms/sendRecord",
        method: "get",
        params
    });
}

// 批量删除发送记录
export function del(data) {
    return request({
        url: "api/sms/sendRecord",
        method: "delete",
        data
    });
}

export default {
    getSmsSendRecordAll,
    getSmsSendRecord,
    del
};