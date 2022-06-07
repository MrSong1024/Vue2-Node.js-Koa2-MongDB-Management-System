/*
 * @Author: Songjq
 * @Date: 2021-12-05 22:20:08
 * @Desscription: 登录管理 - 登录模块
 */
import request from "@/api/request";
// 用户注册
export function register(data) {
    return request({
        url: "api/register",
        method: "post",
        data: data
    });
}

// 用户登录-账号密码
export function login(data) {
    return request({
        url: "api/login",
        method: "post",
        data
    });
}

// 用户登录-邮箱登录
export function loginByEmail(data) {
    return request({
        url: "api/login/by/email",
        method: "post",
        data
    });
}

// 用户登录-通过手机号登录
export function loginByPhone(data) {
    return request({
        url: "api/login/by/phone",
        method: "post",
        data
    });
}

// 获取当前登陆者信息
export function getUserCurrent() {
    return request({
        url: "api/users/current",
        method: "get"
    });
}

// 获取设备信息
export function getEquipmentInfo() {
    return request({
        url: "api/equipment/info",
        method: "get"
    });
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: "api/code",
        method: "get"
    });
}

// 发送邮箱验证码
export function sendMail(data) {
    return request({
        url: "api/email",
        method: "post",
        data
    });
}

// 忘记密码 - 修改密码
export function forgetPwd(data) {
    return request({
        url: "api/forgetPwd",
        method: "post",
        data
    });
}

// 获取地理位置
export function getWsLocation(params) {
    return request({
        url: "ws/location/v1/ip",
        method: "get",
        params
    });
}

// 用户退出
export function loginOut() {
    return request({
        url: "api/loginOut",
        method: "post"
    });
}

export default {
    register,
    login,
    loginByEmail,
    loginByPhone,
    getUserCurrent,
    getCodeImg,
    getEquipmentInfo,
    sendMail,
    forgetPwd,
    getWsLocation,
    loginOut
};