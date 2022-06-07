/*
 * @Author: Songjq
 * @Date: 2022-04-02 00:12:07
 * @Desscription: 短信模板
 */
import request from "@/api/request";

// 短信模板列表
export function getSmsTemplateAll(params) {
    return request({
        url: "api/sms/template/all",
        method: "get",
        params
    });
}

// 新增
export function add(data) {
    return request({
        url: "api/sms/template",
        method: "post",
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: "api/sms/template",
        method: "put",
        data
    });
}

// 批量删除数据
export function del(data) {
    return request({
        url: "api/sms/template",
        method: "delete",
        data
    });
}

// 绑定模板ID
export function postTemplateBinding(data) {
    return request({
        url: "api/sms/template/binding",
        method: "post",
        data
    });
}

// 查询短信模板详情
export function getSmsTemplate(params) {
    return request({
        url: "api/sms/template",
        method: "get",
        params
    });
}

export default {
    getSmsTemplateAll,
    getSmsTemplate,
    postTemplateBinding,
    add,
    edit,
    del,
};