/*
 * @Author: Songjq
 * @Date: 2021-12-23 20:47:23
 * @Desscription:
 */
const OperLog = require("../models/log/Operation");

class LogService {
    static async add(content) {
        let log = new OperLog(content);
        await log.save();
    }
}

module.exports = LogService;