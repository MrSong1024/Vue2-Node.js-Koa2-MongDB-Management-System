/*
 * @Author: Songjq
 * @Date: 2022-03-10 14:30:02
 * @Desscription: 登录成功后，写入设备信息
 */
const User = require("../models/system/User");
const logininforFn = require("./logininfor"); // 写入登录日志方法

/**
 * 登录成功以后，写入设备信息
 * loginType account:账号   email:邮箱  phone:短信
 * @param {Object} res 调用短信回执接口返回的数据
 */
async function loginSuccessFn(findUserResult, uuids, browserId, loginType) {
    // 1.获取当前用户的已登录设备信息
    let browserInfos = findUserResult.browserInfos || [];
    let index = browserInfos && browserInfos.findIndex((val) => {
        return val.browserId === browserId
    })

    // 2.已保存的登录设备，重置登录时间
    if (index >= 0) {
        browserInfos[index].loginDate = new Date()
    } else {
        browserInfos.push({
            isBrowser: true,
            browserId,
            loginIp: uuids.ipaddr,
            location: uuids.location,
            browser: uuids.browser,
        })
    }

    // 3.更新用户常用设备
    await User.updateOne({
        userno: findUserResult.userno
    }, {
        $set: {
            browserInfos,
        },
    });

    // 4.写入登录日志
    logininforFn({
        userno: findUserResult.userno,
        loginType,
        email: findUserResult.email,
        phone: findUserResult.phone,
        status: 0,
        msg: "登录成功",
    });
}
exports.loginSuccessFn = loginSuccessFn;