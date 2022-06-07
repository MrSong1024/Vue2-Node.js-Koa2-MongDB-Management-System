/*
 * @Author: Songjq
 * @Date: 2022-04-07 21:51:09
 * @Desscription: 
 */
const Order = require("../models/finance/Order");
const User = require("../models/system/User");
var request = require('request');
const AlipaySdk = require('alipay-sdk').default
const AlipayFormData = require('alipay-sdk/lib/form').default

// 初始化插件
const alipaySdk = new AlipaySdk({
    appId: '#',
    gateway: 'https://openapi.alipaydev.com/gateway.do',
    signType: 'RSA2', // 注意这里默认是RSA2, 但是我自己只能用RSA, 所以是RSA, 正常不要配置
    privateKey: '#', // 应用私钥
    alipayPublicKey: '#' // 支付宝公钥
})

/**
 * 订单支付方法封装
 * 
 * @param {*} callback 
 */
async function alipay(productInfo, callback) {
    const { out_trade_no, totalAmount, subject, body } = productInfo
    const formData = new AlipayFormData()
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get')
    // 配置回调接口
    formData.addField('notify_url', 'http://localhost:8003/#/finance/pay')
    formData.addField('bizContent', {
        product_code: 'FAST_INSTANT_TRADE_PAY',
        out_trade_no,
        totalAmount,
        subject, // 订单标题
        body, // ding
    });
    formData.addField('returnUrl', 'http://localhost:8003/#/finance/pay'); //加在这里才有效果,不是加在bizContent 里面
    // 请求接口
    const result = await alipaySdk.exec(
        'alipay.trade.page.pay', {}, { formData: formData },
    );
    // result 为可以跳转到支付链接的 url
    callback(result);
}
exports.alipay = alipay;


/**
 * 支付订单结果查询
 * 
 * @param {*} no 
 * @param {*} callback 
 */
async function queryAlipay(out_trade_no, callback) {
    const formData = new AlipayFormData()
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get')

    // 设置参数
    formData.addField('bizContent', {
        out_trade_no
    });

    // 请求接口
    const result = await alipaySdk.exec(
        'alipay.trade.query', {}, { formData: formData },
    );

    //发送请求, 并得到返回的结果, 调用callback
    request({
        method: 'GET',
        url: result,
    }, async (error, response, res) => {
        let obj = JSON.parse(res).alipay_trade_query_response

        if (obj.code == "10000") {
            // 1.通过订单编号获取订单信息
            let orderData = await Order.findOne({ orderNo: out_trade_no })

            // 2.通过创建人，获取创建人用户信息
            let userData = await User.findOne({ userno: orderData.createBy })

            // 3.当充值状态为成功时，计算用户财务信息
            if (obj.trade_status == "TRADE_SUCCESS" && orderData.status != "TRADE_SUCCESS") { // 已经充值成功的订单，不在继续计费
                // 通过审核才计入统计
                let finance = {
                    smsPrice: userData.finance.smsPrice,
                    cashAmount: userData.finance.cashAmount,
                    sendSmsAmount: userData.finance.sendSmsAmount,
                }

                // 充值总额
                finance.amount = (Number(userData.finance.amount) + Number(orderData.money)).toFixed(2)

                // 可用金额
                finance.availableAmount = (Number(finance.amount) - Number(userData.finance.cashAmount)).toFixed(2)

                // 可用条数
                finance.usableAmount = Math.floor(finance.availableAmount / finance.smsPrice).toFixed(2)

                await User.updateOne({ userno: orderData.createBy }, {
                    $set: {
                        finance
                    }
                })

                // global.log.desc = `充值成功`;
            }

            // 4.更新订单状态
            await Order.updateOne({ orderNo: out_trade_no }, {
                $set: Object.assign({ status: obj.trade_status, updateTime: new Date() }),
            });
        } else {
            // 4.更新订单状态
            await Order.updateOne({ orderNo: out_trade_no }, {
                $set: Object.assign({ status: obj.sub_code, updateTime: new Date() }),
            });
        }

        callback(obj);
    });
}
exports.queryAlipay = queryAlipay;