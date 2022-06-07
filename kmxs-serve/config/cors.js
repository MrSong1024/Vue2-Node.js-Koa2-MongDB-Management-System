/*
 * @Author: Songjq
 * @Date: 2021-12-14 01:01:10
 * @Desscription: 跨域处理配置项
 */
module.exports = corsConfigs = {
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization", "Date"],
    maxAge: 100,
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
    accessControlAllowOrigin: "*",
    allowHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "X-Custom-Header",
        "anonymous",
        "Browser",
    ],
};