/*
 * @Author: Songjq
 * @Date: 2022-03-10 14:30:02
 * @Desscription: 发送手机验证码
 */
var schedule = require('node-schedule');
var md5 = require('blueimp-md5')
var moment = require('moment')
var Base64 = require('js-base64').Base64;
var request = require('request');

// 引入Sms模块
const User = require("../models/system/User");
const SmsReturnRecord = require("../models/sms/SmsReturnRecord");
const SmsSendRecord = require("../models/sms/SmsSendRecord");

/**
 * 配置对接短信平台的相关配置
 * 
 * 1.对接平台网址    https://www.yuntongxun.com/member/main
 * 2.ACCOUNT_SID    主账户ID)
 * 3.AUTH_TOKEN     账户授权令牌
 * 4.Rest_URL       Rest URL(生产)
 * 5.AppID          应用ID
 */

var ACCOUNT_SID = '#';
var AUTH_TOKEN = '#';
var Rest_URL = 'https://app.cloopen.com:8883';
var AppID = '#';

/**
 * 统一处理配置信息
 */
var sigParameter = '';
var time = moment().format('YYYYMMDDHHmmss');
sigParameter = md5(ACCOUNT_SID + AUTH_TOKEN + time);

/**
 * 发送模板短信接口
 * 
 * @param {String} phones       批量手机号 "13911281234,15010151234,13811431234"  号码字符串，最多200个
 * @param {Array} datas         变量 eg:["替换内容","替换内容"]
 * @param {String} templateId   模板ID
 * @param {String} reqId        自定义第三方ID
 * @param {Function} callback   回调函数
 */
function sendMessage(phones, datas, templateId, reqId, callback) {

    /**
     * 1.使用MD5加密（账户Id + 账户授权令牌 + 时间戳）。其中账户Id和账户授权令牌根据url的验证级别对应主账户。
     * 时间戳是当前系统时间，格式"yyyyMMddHHmmss"。时间戳有效时间为24小时，如：20140416142030
     * 2.SigParameter参数需要大写，如不能写成sig=abcdefg而应该写成sig=ABCDEFG
     */

    //1. 配置准备请求url
    var url = Rest_URL + '/2013-12-26/Accounts/' + ACCOUNT_SID + '/SMS/TemplateSMS?sig=' + sigParameter;

    //2. 准备请求体
    var body = {
        to: phones,
        appId: AppID,
        templateId,
        datas,
        reqId
    }

    /**
     * 1.使用Base64编码（账户Id + 冒号 + 时间戳）其中账户Id根据url的验证级别对应主账户
     * 2.冒号为英文冒号
     * 3.时间戳是当前系统时间，格式"yyyyMMddHHmmss"，需与SigParameter中时间戳相同。
     */

    //3. 准备请求头
    var authorization = ACCOUNT_SID + ':' + time;
    authorization = Base64.encode(authorization);
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'Content-Length': JSON.stringify(body).length + '',
        'Authorization': authorization
    }

    //4. 发送请求, 并得到返回的结果, 调用callback
    request({
        method: 'POST',
        url: url,
        headers: headers,
        body: body,
        json: true
    }, (error, response, body) => {
        callback(body);
    });
}
exports.sendMessage = sendMessage;


/**
 * 批量获取短信状态报告、上行短信信息接口
 * 
 * @param {Function} callback 回调函数
 */
function getArrived(callback) {

    //1. 准备请求url
    var url = Rest_URL + '/2013-12-26/Accounts/' + ACCOUNT_SID + '/SMS/GetArrived?sig=' + sigParameter;

    //2. 准备请求体
    var body = {
        appId: AppID, // 必填 应用ID
        smsType: 1, // 选填  0:上行短信数据 1:短信状态报告 缺省1
        count: 500, // 选填  查询状态的数量。最大500，缺省100
    }

    //3. 准备请求头
    var authorization = ACCOUNT_SID + ':' + time;
    authorization = Base64.encode(authorization);
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'Content-Length': JSON.stringify(body).length + '',
        'Authorization': authorization
    }

    //4. 发送请求, 并得到返回的结果, 调用callback
    request({
        method: 'POST',
        url: url,
        headers: headers,
        body: body,
        json: true
    }, (error, response, body) => {
        callback(body);
    });
}
exports.getArrived = getArrived;

/**
 * 存入短息回执以及计算用户短信费用余额
 * 
 * @param {Object} res 调用短信回执接口返回的数据
 */
function saveSmsArrived(res) {
    /**
     * 思路前提：官方提供的【批量获取】的接口，并不是在发送完短信后，直接调用就能直接返回数据，有时候会有延迟
     * 开发思路：借助官方文档自定义的 reqId这个字段，用这个字段和发送记录的resMsgid（批次号）进行关联；
     * 发送回执实现：通过【批量获取】接口返回的reqId字段，获取发送记录的数据，然后遍历存储回执记录；
     * 用户余额：通过发送记录，找到创建者，通过user集合，获取当前用户的短信费用，结合回执成功的短信条数，识别当前批次所产生的费用
     */

    // 1.获取发送短信的回执记录，将回执数据通过 reqId 进行分组
    Array.prototype.groupBy = function(group) { // 封装数组分组方法
        return group && typeof group === 'function' ? Array.prototype.reduce.call(this, function(c, v) {
            var k = group(v);
            if (c.hasOwnProperty(k)) {
                c[k].push(v);
            } else {
                c[k] = [v];
            }
            return c;
        }, {}) : this;
    }

    let returnRecords = res.reports && res.reports.groupBy(it => it.reqId) // 分组后数据

    // 2.遍历分组后的数据，获取每个分组对应的发送记录数据
    Object.keys(returnRecords).forEach(async key => {

        // 2.1 通过reqId获取到发送记录的对应信息
        const SEND_RECORD = await SmsSendRecord.findOne({ resMsgid: key }) // 发送记录，涵盖当前批次发送短信的所有内容信息
        const USER_DATA = await User.findOne({ userno: SEND_RECORD.createBy }); // 获取发送当前批次短信的用户信息
        const SMS_PRICE = USER_DATA.finance.smsPrice; // 当前用户的短信费用

        let smsPriceCount = 0, // 当前批次产生的所有费用（仅统计发送成功的短信）
            availableAmount = 0, // 每个用户消耗的短信费用
            sendSmsAmount = 0; // 发送总数

        // 拿到的数据是一个数组，对每一条数据单独存储
        returnRecords[key].forEach(async val => {

            // 2.2 将对应信息存储至发送回执表
            if (val.status == 0) {
                smsPriceCount += (SMS_PRICE * val.smsCount);
                sendSmsAmount++
            } else {
                val.recvTime = "" // 如果发送失败，接收时间为空
            }

            const { createBy, resMsgid, templateId, smsContent, templateType, smsInfo } = SEND_RECORD

            // 定义运营商信息
            let phoneInfo = null

            // 获取号码运营商 和 归属地信息
            await new Promise((resolve, reject) => {
                getOperatorInfo(
                    val.fromNum,
                    (state) => {
                        resolve(state);
                    }
                );
            }).then(async (res) => {
                eval("(" + res + ")") // 将字符串转义成可执行对象

                function phone(v) { // 运行回调函数
                    phoneInfo = v.data
                }

                const newSms = await new SmsReturnRecord({
                    ...val,
                    unitPrice: SMS_PRICE * val.smsCount,
                    createBy,
                    resMsgid,
                    templateId,
                    smsContent,
                    templateType,
                    smsInfo,
                    operator: phoneInfo.operator, // 运营商
                    area: phoneInfo.area, // 归属地
                    area_operator: phoneInfo.area_operator, // 归属地+运营商
                });

                // 存储发送回执至数据库
                newSms.save();
            })
        })

        // 3.保存当前用户计算后的余额
        availableAmount = (USER_DATA.finance.availableAmount - smsPriceCount).toFixed(2); // 计算可用余额 = 用户当前余额 - 当前批次产生的有效费用

        await User.updateOne({ userno: SEND_RECORD.createBy }, { // 保存可用余额
            $set: {
                finance: {
                    amount: USER_DATA.finance.amount, // 充值总额
                    smsPrice: USER_DATA.finance.smsPrice, // 短信单价
                    availableAmount, // 可用金额
                    usableAmount: (availableAmount / SMS_PRICE).toFixed(2), // 可用条数
                    cashAmount: (USER_DATA.finance.cashAmount + smsPriceCount).toFixed(2), // 消费金额
                    sendSmsAmount: (USER_DATA.finance.sendSmsAmount + sendSmsAmount).toFixed(2) // 发送总数
                }
            },
        });
    })
}
exports.saveSmsArrived = saveSmsArrived;


/**
 * 获取手机号运营商详情
 * 
 * @param {String} phone 手机号
 * @param {Function} callback 回调函数
 */
function getOperatorInfo(phone, callback) {

    //1. 准备请求url
    var url = `https://www.baifubao.com/callback?cmd=1059&callback=phone&phone=${phone}`;

    //2. 准备请求头
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'Content-Length': '',
        'Authorization': ""
    }

    //3. 发送请求, 并得到返回的结果, 调用callback
    request({
        method: 'GET',
        url: url,
        headers: headers,
        body: {},
        json: true
    }, (error, response, res) => {
        callback(res);
    });
}
exports.getOperatorInfo = getOperatorInfo;


/**
 * 生成指定长度的随机数
 * 
 * @param {Number} length 验证码长度
 * @returns 
 */
function randomCode(length) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var result = ""; //统一改名: alt + shift + R
    for (var i = 0; i < length; i++) {
        var index = Math.ceil(Math.random() * 9);
        result += chars[index];
    }
    return result;
}
exports.randomCode = randomCode;