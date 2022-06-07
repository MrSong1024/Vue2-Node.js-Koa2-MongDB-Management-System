/*
 * @Author: Songjq
 * @Date: 2022-04-10 11:37:29
 * @Desscription: 定时任务
 */
var schedule = require('node-schedule');
// var md5 = require('blueimp-md5')
// var moment = require('moment')
// var Base64 = require('js-base64').Base64;
// var request = require('request');

// 引入Sms模块
const User = require("../models/system/User");
const Order = require("../models/finance/Order");
const SmsSendRecord = require("../models/sms/SmsSendRecord");
const Online = require("../models/system/Online");


// 引入发送短信记录方法
const { saveSmsArrived, getArrived, sendMessage } = require("./smsFunction");
const { queryAlipay } = require("./alipayFunction");

/**
 * 执行定时任务 - 批量获取短信回执
 * 
 * 
 */
// 封装函数回调
function intervalGetArrived() {
    return new Promise((resolve, reject) => {
        getArrived(
            (state) => {
                resolve(state);
            }
        );
    });
}

// 定时器任务
function interval() {

    // 配置执行周期（5s/次）
    var rule1 = new schedule.RecurrenceRule();
    var times1 = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
    rule1.second = times1;

    schedule.scheduleJob('30 * * * * *', async () => { // 每分钟一个周期
        // schedule.scheduleJob(rule1, async () => {
        console.log('scheduleCronstyle:' + new Date());

        /**
         * 1.定时批量获取短信状态，并计算短信费用
         */
        intervalGetArrived().then(res => {
            saveSmsArrived(res)
        })

        /**
         * 2.定时发送短信
         */
        // A.遍历发送记录信息表，找到 isTiming = true的；
        let sendRecords = await SmsSendRecord.find({ isTiming: true })

        // B.发送短信
        sendRecords.forEach(async val => {
            // 判断余额：余额小于零，终止发送
            let userData = await User.findOne({ userno: val.createBy });
            if (userData.finance.availableAmount > 0.5) {
                if (new Date(val.timing) <= new Date()) {
                    const { _id, phones, templateId, resMsgid } = val
                    await new Promise((resolve, reject) => {
                        sendMessage(
                            phones,
                            [],
                            templateId,
                            resMsgid,
                            (state) => {
                                resolve(state);
                            }
                        );
                    }).then(async res => {
                        // C.发送成功，将isTiming（是否定时短信） 修改为 false
                        await SmsSendRecord.updateOne({ _id }, {
                            $set: { isTiming: false, updateTime: new Date(), },
                        });
                    })
                }
            } else {
                console.log("余额不足")
            }
        })

        /**
         * 3.修改充值订单状态
         */
        // A.遍历充值订单，找到 status = WAIT_BUYER_PAY（交易创建，等待买家付款）
        let orderLists = await Order.find({
            $or: [
                // { status: null },
                { status: "WAIT_BUYER_PAY" },
                // { status: "ACQ.TRADE_NOT_EXIST" },
            ]
        })

        // B.调用订单查询接口，更新订单状态
        orderLists.forEach(async val => {
            new Promise((resolve, reject) => {
                queryAlipay(
                    val.orderNo,
                    (state) => {
                        resolve(state);
                    }
                );
            })
        })

        // 4.查看当前在线用户，如果已过期，则直接踢下线
        const findOnlins = await Online.find()
        findOnlins.forEach(async (val) => {
            let nowExpire = Math.round(new Date().getTime() / 1000),
                exp = Number(val.exp);
            if (nowExpire >= exp) {
                await Online.deleteOne({
                    tokenId: val.tokenId
                })
            }
        })
    });
}

interval() // 触发定时任务方法