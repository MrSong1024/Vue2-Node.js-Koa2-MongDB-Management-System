/*
 * @Author: Songjq
 * @Date: 2022-03-17 00:09:29
 * @Desscription: 写入发送短信记录
 */
const SmsSendRecord = require("../models/sms/SmsSendRecord");

module.exports = async function sendSmsRecord_fn(data) {

    // 1.通过批次号获取发送记录
    const RESULT = await SmsSendRecord.findOne({ _id: data._id })

    // 2.有记录，为失败重发，先删除原有数据，然后进行保存
    if (RESULT) {
        // 直接修改当前条数据状态（待定）
        // await SmsSendRecord.updateOne({ _id: data._id }, {
        //     $set: {
        //         ...data,
        //     },
        // });
        await SmsSendRecord.deleteOne({
            _id: data._id
        })
    }

    // 3.存储登录日志数据
    const newSmsSendRecord = new SmsSendRecord(data);

    // 4.存储到数据库
    newSmsSendRecord.save();

};