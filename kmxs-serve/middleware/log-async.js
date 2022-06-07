/*
 * @Author: Songjq
 * @Date: 2021-12-23 20:44:16
 * @Desscription:
 */
const jwt = require("jsonwebtoken");
const logController = require("../controller/LogController");
const keys = require("../config/keys");

module.exports = function() {
    return async (ctx, next) => {
        if (ctx.method === "GET") {
            // 不记录get请求
            await next();
        } else {
            let token = ctx.request.header.authorization; // 获取当前用户token
            let payload = null; // 存储token解析的用户信息
            try {
                payload = await jwt.verify(token.split(" ")[1], keys.secretOrKey, {
                    expiresIn: 36000,
                });
            } catch (e) {
                payload = {};
            }

            // 定义需要存储的数据
            global.log = {
                username: payload.username,
                userno: payload.userno,
                ipaddr: global.loginInfo && global.loginInfo.ipaddr,
                location: global.loginInfo && global.loginInfo.location,
                browser: global.loginInfo && global.loginInfo.browser,
                method: ctx.request.method,
                host: ctx.request.header.host,
                url: ctx.request.url,
                shortUrl: ctx.request.body.shortUrl,
                params: JSON.stringify(ctx.request.body),
                body: null,
                status: null,
                desc: null,
            };

            await next();

            // 保存
            if (global.log.desc) {
                global.log.status = ctx.response.status;
                global.log.body = JSON.stringify(ctx.response.body);
                logController.add(global.log);
            }
        }
    };
};