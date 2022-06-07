/*
 * @Author: Songjq
 * @Date: 2021-12-23 20:46:05
 * @Desscription:
 */
const logService = require("../service/LogService");

class LogController {
  static async add(content) {
    await logService.add(content);
  }
}

module.exports = LogController;
