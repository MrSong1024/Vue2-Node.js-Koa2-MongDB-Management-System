/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:
 */
module.exports = {
    mongoURI: "mongodb://test:123456@localhost:27017/test", // 本地开发数据库环境
    secretOrKey: "secret" + new Date().getTime(),
};