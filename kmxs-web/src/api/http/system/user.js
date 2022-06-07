/*
 * @Author: Songjq
 * @Date: 2021-12-29 21:36:13
 * @Desscription:
 */
import request from "@/api/request";
// 新增
export function add(data) {
    return request({
        url: "api/users",
        method: "post",
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: "api/users",
        method: "put",
        data
    });
}

// 删除
export function del(data) {
    return request({
        url: "api/users",
        method: "delete",
        data
    });
}

export function enable(data) {
    return request({
        url: "api/users/enable",
        method: "post",
        data
    });
}

export function disable(data) {
    return request({
        url: "api/users/disable",
        method: "post",
        data
    });
}

// 查看所有用户
export function getUserAll(params) {
    return request({
        url: "api/users/all",
        method: "get",
        params
    });
}

// 查看当前用户详细信息
export function getUserCurrentAll() {
    return request({
        url: "api/users/currentAll",
        method: "get"
    });
}

// 重置密码
export function postUsersResetPwd(data) {
    return request({
        url: "api/users/resetPwd",
        method: "post",
        data
    });
}

// 修改密码
export function postUsersChangePwd(data) {
    return request({
        url: "api/users/changePwd",
        method: "post",
        data
    });
}

// 修改用户名
export function postUsersResetUserName(data) {
    return request({
        url: "api/users/resetUserName",
        method: "post",
        data
    });
}

// 修改邮箱
export function postUsersChangeEmail(data) {
    return request({
        url: "api/users/changeEmail",
        method: "post",
        data
    });
}

// 修改手机号
export function postUsersChangePhone(data) {
    return request({
        url: "api/users/changePhone",
        method: "post",
        data
    });
}

// 实名认证
export function postUsersCertification(data) {
    return request({
        url: "api/users/certification",
        method: "post",
        data
    });
}

export default {
    add,
    edit,
    del,
    enable,
    disable,
    getUserAll,
    postUsersResetPwd,
    postUsersChangePwd,
    postUsersResetUserName,
    postUsersChangeEmail,
    postUsersChangePhone,
    getUserCurrentAll,
    postUsersCertification
};