/*
 * @Author: Songjq
 * @Date: 2022-01-26 09:16:18
 * @Desscription: 发送邮箱验证码 方法封装
 * 配置文档详细地址： http://kmxs.com.cn/articles/web/2022-01-20/160.html
 */

const nodemailer = require("nodemailer"); //引入模块

let transporter = nodemailer.createTransport({
    service: "qq", //类型qq邮箱
    port: 465,
    secure: true,
    auth: {
        user: "#", // 发送方的邮箱
        pass: "#", // smtp 的授权码
    },
});

/**
 * 发送验证码方法配置
 * 
 * @param {String} type 邮件类型 0:验证码  1:新设备邮件  2:重置密码提醒
 * @param {String} username 用户名
 * @param {String} email 邮箱
 * @param {String} code 验证码
 * @param {Function} call 回调函数
 */
function sendMail(type, username, email, code = "", call, uuids) {

    let mailOptions = {}
    // 1.发送的配置项
    switch (type) {
        case "0":
            // 1.1 发送验证码
            mailOptions = {
                from: '"KMXS" <cloudesigner@qq.com>', // 发送方
                to: email, //接收者邮箱，多个邮箱用逗号间隔
                subject: "KMXS 邮箱验证码", // 标题
                html: `<div style="font: 13px/1 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', '微软雅黑',sans-serif;background: #f9f9f9;max-width: 600px;margin: 0 auto;">
            <div style="padding: 20px; background-color: #e91c41"></div>
            <div style="padding: 20px; background-color: #ffffff">
              <div style="color: #333333; font-weight: bold">
                亲爱的${username},您好！
              </div>
              <div style="line-height: 1.5; color: #6e6e6e; margin-top: 15px">
                您当前接收的动态验证码为：
                <b>${code}</b>
                <br />
                <br />
                该验证码10分钟内有效，勿重复发送。
                若该邮件不是由您本人主动申请发送，则您的帐号信息可能已泄露。
                <br />
                <br />
                KMXS Global Team
              </div>
          
              <div style="text-align: right; margin-top: 40px">
                <div style="color: #333333; margin-bottom: 10px">©️2022 KMXS.COM.CN</div>
              </div>
            </div>
            <div
              style="
                color: #999999;
                margin-top: 10px;
                padding: 10px 20px;
                line-height: 1.5;
              "
            >
              此为自动发送邮件，请勿直接回复！如您有任何疑问，请点击<a
                style="color: #e91c41"
                href="https://www.kmxs.com.cn"
                target="_blank"
                rel="noopener"
                >联系我们&gt;&gt;</a
              >
            </div>
          </div>`,
            };
            break;

        case "1":
            // 1.2 发送新设备提醒
            mailOptions = {
                from: '"KMXS" <cloudesigner@qq.com>', // 发送方
                to: email, //接收者邮箱，多个邮箱用逗号间隔
                subject: "KMXS 新设备提醒", // 标题
                html: `<div style="font: 13px/1 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', '微软雅黑',sans-serif;background: #f9f9f9;max-width: 600px;margin: 0 auto;">
              <div style="padding: 20px; background-color: #e91c41"></div>
              <div style="padding: 20px; background-color: #ffffff">
                <div style="color: #333333; font-weight: bold">
                  亲爱的${username},您好！
                </div>
                <div style="line-height: 1.5; color: #6e6e6e; margin-top: 15px">
                  <p>您的账号存在新设备的风险：</p>
                  <br />
                  <p><b>登录IP：</b>${uuids.ipaddr}</p>
                  <p><b>登录地点：</b>${uuids.location}</p>
                  <p><b>设备信息：</b>${uuids.browser}</p>
                  <br />
                  <br />
                  如果不是您本人操作，该帐号信息可能已泄露；请及时通过下方链接，进行 <a style="color: #e91c41" href="https://gitee.kmxs.com.cn/#/forgetPassword" target="_blank" rel="noopener">重置密码</a>。
                  <br />
                  <br />
                  KMXS Global Team
                </div>
            
                <div style="text-align: right; margin-top: 40px">
                  <div style="color: #333333; margin-bottom: 10px">©️2022 KMXS.COM.CN</div>
                </div>
              </div>
              <div
                style="
                  color: #999999;
                  margin-top: 10px;
                  padding: 10px 20px;
                  line-height: 1.5;
                "
              >
                此为自动发送邮件，请勿直接回复！如您有任何疑问，请点击<a
                  style="color: #e91c41"
                  href="https://www.kmxs.com.cn"
                  target="_blank"
                  rel="noopener"
                  >联系我们&gt;&gt;</a
                >
              </div>
            </div>`,
            };
            break;

        case "2":
            // 1.3 密码即将到期，重置密码提醒
            mailOptions = {
                from: '"KMXS" <cloudesigner@qq.com>', // 发送方
                to: email, //接收者邮箱，多个邮箱用逗号间隔
                subject: "KMXS 重置密码提醒", // 标题
                html: `<div style="font: 13px/1 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', '微软雅黑',sans-serif;background: #f9f9f9;max-width: 600px;margin: 0 auto;">
              <div style="padding: 20px; background-color: #e91c41"></div>
              <div style="padding: 20px; background-color: #ffffff">
                <div style="color: #333333; font-weight: bold">
                  亲爱的${username},您好！
                </div>
                <div style="line-height: 1.5; color: #6e6e6e; margin-top: 15px">
                  <p>您的账号密码将于${code}天后失效：</p>
                  <br />
                  <p><b>登录IP：</b>${uuids.ipaddr}</p>
                  <p><b>登录地点：</b>${uuids.location}</p>
                  <p><b>设备信息：</b>${uuids.browser}</p>
                  <br />
                  <br />
                  您的账号密码将于${code}天后失效，避免因密码失效而无法正常使用系统；请及时通过下方链接，进行 <a style="color: #e91c41" href="https://gitee.kmxs.com.cn/#/forgetPassword" target="_blank" rel="noopener">重置密码</a>。
                  <br />
                  <br />
                  KMXS Global Team
                </div>
            
                <div style="text-align: right; margin-top: 40px">
                  <div style="color: #333333; margin-bottom: 10px">©️2022 KMXS.COM.CN</div>
                </div>
              </div>
              <div
                style="
                  color: #999999;
                  margin-top: 10px;
                  padding: 10px 20px;
                  line-height: 1.5;
                "
              >
                此为自动发送邮件，请勿直接回复！如您有任何疑问，请点击<a
                  style="color: #e91c41"
                  href="https://www.kmxs.com.cn"
                  target="_blank"
                  rel="noopener"
                  >联系我们&gt;&gt;</a
                >
              </div>
            </div>`,
            };
            break;
    }

    // 2.触发发送函数
    transporter.sendMail(mailOptions, (error, info) => {
        console.log(error)
        if (error) {
            call(false);
        } else {
            call(true); //因为是异步 所有需要回调函数通知成功结果
        }
    });
}

module.exports = {
    sendMail,
};