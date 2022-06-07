/*
 * @Author: Songjq
 * @Date: 2021-12-05 22:20:10
 * @Desscription:
 */
import Vue from "vue";
import axios from "axios";
import { Notification, MessageBox } from "element-ui";
import store from "../store";
import { getToken } from "@/utils/auth";
import Config from "@/settings";
import { removeToken } from "@/utils/auth";

// 创建axios实例
const service = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? process.env.VUE_APP_BASE_API : "/", // api 的 base_url
    timeout: Config.timeout // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
    config => {
        if (getToken()) {
            config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        config.headers["Content-Type"] = "application/json";
        if (store.getters.user.role == 'demoAdmin' && config.method != "get") {
            Notification.error({
                title: "演示账号，不允许相关操作，可注册账号并联系管理员索要相应权限",
                duration: 5000
            });
            return;
        }
        return config;
    },
    error => {
        console.log(error);
        Promise.reject(error);
    }
);

// response 拦截器
service.interceptors.response.use(
    response => {
        const code = response.status;
        if (code < 200 || code > 300) {
            Notification.error({
                title: error.response.data.message
            });
            return Promise.reject(error.response.data);
        } else {
            return response.data;
        }
    },
    error => {
        let status = error.response.status;
        switch (status) {
            case 500:
                Notification.error({
                    title: "网络异常，请稍后再试",
                    duration: 5000
                });
                break;

            case 400:
                Notification.error({
                    title: error.response.data.message,
                    duration: 5000
                });
                break;

            case 404:
                Notification.error({
                    title: error.response.data.message,
                    duration: 5000
                });
                break;

                // 密码策略校验失败
            case 403:
                let messages = error.response.data.messages,
                    html = "";
                messages.forEach((v, i) => {
                    html += `<div style="font-size:12px;line-height:20px;"><p>${i+1}.${v}</p></div>`
                })
                Notification.error({
                    title: "密码策略提示",
                    dangerouslyUseHTMLString: true,
                    message: html,
                    duration: 5000
                });
                break;
        }

        // 认证信息过期
        if (error.response.data == "Unauthorized") {
            MessageBox("认证信息过期，可尝试退出后重新登录", "提示", {
                confirmButtonText: "确定",
                type: "warning"
            }).then(() => {
                // 退出登录，返回登录页面
                removeToken();
                location.reload();
            });
            return;
        }

        if (error.toString().indexOf("Error: timeout") !== -1) {
            Notification.error({
                title: "网络请求超时",
                duration: 5000
            });
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);
export default service;