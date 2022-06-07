/*
 * @Author: Songjq
 * @Date: 2022-03-10 14:41:45
 * @Desscription: 短信相关操作
 */
const { randomCode, sendMessage, getArrived, saveSmsArrived } = require("../../tools/smsFunction");
const NXlSX = require("node-xlsx");
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");
const sd = require('silly-datetime');
const _ = require('lodash');

// 引入Sms模板
const User = require("../../models/system/User");
const SmsReturnRecord = require("../../models/sms/SmsReturnRecord");
const SmsTemplate = require("../../models/sms/SmsTemplate");
const SmsSendRecord = require("../../models/sms/SmsSendRecord");

// 引入发送短信记录方法
const sendSmsRecord_fn = require("../../tools/sendSmsRecord");

const fs = require('fs'); //引入 fs 核心模块
const dbJson = './dbs.json'; // 临时存放验证码

/**
 * @route POST api/sms/sendCode
 * @desc  发送手机验证码
 * @access 接口是公开的
 */
router.post("/sendCode", async (ctx) => {
    const { code, phone, browserId } = ctx.request.body;

    // 1.读取本地文件存储的验证码
    let data = fs.readFileSync(dbJson, 'utf-8');
    let dataArr = JSON.parse(data)
    let fsCode = "",
        fsExpire = "";
    dataArr.forEach(val => {
        // 读取图形验证码
        if (val.browserId === browserId) {
            fsCode = val.answer
        }
        // 读取手机验证时间
        if (val.phone === phone) {
            fsExpire = val.expire
        }
    })

    // 2.校验验证码(字母转小写，然后对比校验)
    if (code.toUpperCase() !== fsCode) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "验证码不正确!"
        };
        return;
    }

    // 3.校验发送频率--1分钟内1次
    let nowExpire = new Date().getTime();
    let minute = Math.floor(parseInt(nowExpire - fsExpire) / 1000 / 60)
    if (minute < 1) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "验证请求过于频繁，1分钟内1次"
        };
        return;
    }

    // 4.校验Email邮箱格式，出错时或者为空时
    if (!phone) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "参数错误"
        };
        return;
    }

    // 获取当前用户信息
    let userData = await User.findOne({ phone });

    // 5.配置参数
    const conf = {
        get code() {
            // 验证码
            return () => {
                return randomCode(6); //生成6位数字随机验证码
            };
        },
        get expire() {
            // 到期时间
            return () => {
                return new Date().getTime();
            };
        },
    };

    // 6.保存发送认证信息
    let phoneCode = conf.code(),
        expire = conf.expire();

    fs.readFile(dbJson, function(err, data) {
        if (err) {
            return console.error(err);
        }
        //将二进制的数据转换为字符串
        let str = data.toString();
        let verificationCode = [];
        //将字符串转换为json对象
        if (str) {
            verificationCode = JSON.parse(str);
        }
        let index = verificationCode.findIndex(item => item.phone === phone)
        if (index > -1) {
            verificationCode[index].answer = phoneCode
            verificationCode[index].expire = expire
        } else {
            let obj = {
                phone: phone,
                answer: phoneCode,
                expire: expire,
            }
            verificationCode.push(obj); //将传来的对象push进数组对象中
        }
        let dataStr = JSON.stringify(verificationCode); //把json对象转换成字符串重新写入json文件中
        fs.writeFile(dbJson, dataStr, function(err) {
            if (err) {
                console.error(err);
            }
        })
    })

    let resMsgid = new Date().getTime(); // 以当前时间戳作为批次号

    async function timeout() {
        return new Promise((resolve, reject) => {
            sendMessage(
                phone,
                [phoneCode, "10"],
                1,
                resMsgid,
                (state) => {
                    resolve(state);
                }
            );
        });
    }
    // 获取当前短信模板
    const { templateContent, smsLength, smsCounts, templateType, smsInfo, templateId } = await SmsTemplate.findOne({ templateId: 1 });
    let str1 = templateContent.replace("{1}", phoneCode)
    let smsContent = str1.replace("{2}", 10)

    // 7.发送验证码
    await timeout().then((res) => {
        if (res.statusCode === '000000') {
            ctx.body = {
                code: 200,
                message: "验证码发送成功"
            };

            // 写入操作日志
            global.log.desc = "发送手机验证码成功";

            // 写入发送记录
            sendSmsRecord_fn({
                isTiming: false,
                phones: phone,
                smsContent,
                smsCounts,
                smsInfo,
                smsLength,
                templateId,
                templateType,
                resMsgid,
                createBy: userData ? userData.userno : phone,
                status: 0,
                updateTime: new Date(),
                msg: "短信发送成功",
            });
        } else {
            ctx.status = 400;
            ctx.body = { code: 400, message: res.statusMsg };
            global.log.desc = res.statusMsg;
        }
    });
});


// 短信管理 - 发送短信   -------------------- start --------------------
/**
 * @route POST api/sms/sendMessage
 * @desc  发送手机短信 : 短信通知
 * @access 接口是公开的
 */
router.post("/sendMessage",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { phones, templateId, smsCounts, isTiming, _id } = ctx.request.body;
        const { userno } = ctx.state.user;

        // 获取当前用户信息
        let userData = await User.findOne({ userno });

        // 读取当前用户的短信价格
        let smsPrice = userData.finance.smsPrice;

        // 当前批次手机号个数,计算当前批次短信发送,所需费用，
        let price = phones.split(",").filter(Boolean).length * smsPrice * smsCounts;

        // 费用精确到小数点后两位
        let unitPrice = price.toFixed(2);

        // 短信发送前，先验证账号余额
        if (userData.finance.availableAmount < unitPrice) {
            ctx.status = 400;
            ctx.body = { code: 400, message: "余额不足，请先充值后继续" };
            return
        }

        // 判断是新发送还是失败重发
        // 由于短信对接接口，绑定了一个第三方ID，此ID同一天只能出现一次；
        // 因此；失败重发目前的处理方式是，删除之前的发送记录，然后重新创建一条新的记录；
        // 重新生成批次号
        // let result = await SmsSendRecord.findOne({ _id })
        // let resMsgid = ""
        // if (result) {
        //     resMsgid = result.resMsgid; // 取原有的批次号
        // } else {
        resMsgid = new Date().getTime(); // 以当前时间戳作为批次号
        // }

        /**
         * 发送定时短信
         * @returns isTiming = true
         */
        if (isTiming) {
            ctx.body = {
                code: 200,
                message: "定时短信创建成功"
            };

            // 写入操作日志
            global.log.desc = `定时短信创建成功`;
            // 写入发送记录
            sendSmsRecord_fn({
                ...ctx.request.body,
                resMsgid,
                unitPrice,
                createBy: userno,
                status: 0,
                updateTime: new Date(),
                msg: "定时短信创建成功",
            });
        } else {
            /**
             * 发送普通短信
             */
            async function timeout() {
                return new Promise((resolve, reject) => {
                    sendMessage(
                        phones,
                        [], // 通过模板获取绑定的参数
                        templateId,
                        resMsgid,
                        (state) => {
                            resolve(state);
                        }
                    );
                });
            }

            await timeout().then((res) => {
                if (res.statusCode === '000000') {
                    ctx.body = {
                        code: 200,
                        data: {
                            ...ctx.request.body,
                            resMsgid,
                            unitPrice,
                            status: 0,
                        },
                        message: "短信发送成功"
                    };
                    // 写入操作日志
                    global.log.desc = `短信发送成功`;
                    // 写入发送记录
                    sendSmsRecord_fn({
                        ...ctx.request.body,
                        resMsgid,
                        unitPrice,
                        createBy: userno,
                        status: 0,
                        updateTime: new Date(),
                        msg: "短信发送成功",
                    });
                } else {
                    ctx.status = 400;
                    ctx.body = { code: 400, message: res.statusMsg };
                    // 写入操作日志
                    global.log.desc = res.statusMsg;
                    // 写入发送记录
                    sendSmsRecord_fn({
                        ...ctx.request.body,
                        resMsgid,
                        unitPrice: 0,
                        createBy: userno,
                        status: 1,
                        msg: res.statusMsg,
                        updateTime: new Date(),
                    });
                }
            });
        }
    });


/**
 * @route POST api/sms/getArrived
 * @desc  批量获取短信状态报告、上行短信信息接口
 * @access 接口是公开的
 */
router.post("/getArrived",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        async function timeout() {
            return new Promise((resolve, reject) => {
                getArrived(
                    (state) => {
                        resolve(state);
                    }
                );
            });
        }

        await timeout().then((res) => {
            if (res.statusCode === '000000') {
                ctx.body = { code: 200, data: res, message: "成功" };
                // 调用保存短信回执方法
                saveSmsArrived(res)
            } else {
                ctx.status = 400;
                ctx.body = { code: 400, message: res.statusMsg };
            }
        });
    });


/**
 * @route GET api/sms/downTemplate
 * @desc  下载号码导入模板
 * @access 接口是私有的
 */
router.get(
    "/downTemplate",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        // 单独设置表格宽度
        const sheetOptions = {
            "!cols": [
                { wch: 20 },
                { wch: 15 },
            ],
        };

        // 数据格式为[["hello","223"],["22","23"]];
        let buffer = NXlSX.build([{
            name: "sheetName",
            data: [
                [
                    'tel', 'name'
                ],
                [
                    '1008611',
                    '张三',
                ]
            ]
        }], {
            sheetOptions,
        });
        // 返回buffer流到前端
        ctx.body = buffer;
    }
);


// 短信管理 - 模板管理   -------------------- start --------------
/**
 * @route GET api/sms/template/all
 * @desc  查看所有模板
 * @access 接口是私有的
 */
router.get(
    "/template/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { keyword, status, user, page, size } = ctx.request.query;
        const { userno, role } = ctx.state.user;
        let searchData = {
            templateName: new RegExp(keyword),
            createBy: role == 'admin' || role == 'demoAdmin' ? new RegExp(user) : userno,
            status: new RegExp(status),
        };

        // 总条数
        const total = await SmsTemplate.find(searchData).countDocuments();

        await SmsTemplate.find(searchData)
            .sort({ createTime: -1 })
            .skip(Number(page * size))
            .limit(Number(size))
            .then((res) => {
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: res,
                    total: total,
                };
            })
            .catch((err) => {
                ctx.status = 404;
                ctx.body = { code: 404, message: "找不到任何模板信息" };
            });
    }
);


/**
 * @route POST api/sms/template/binding
 * @desc  绑定模板ID
 * @access 接口是私有的
 */
router.post(
    "/template/binding",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { _id, templateId } = ctx.request.body;

        // 判断ID 是否已占用
        const findResult = templateId && await SmsTemplate.findOne({
            templateId,
        });

        if (findResult) {
            ctx.status = 400;
            ctx.body = { code: 400, message: "模板ID已被占用" };
        } else {
            await SmsTemplate.updateOne({ _id }, {
                $set: { templateId },
            });
            ctx.body = {
                message: "操作成功",
                code: 200,
            };

            global.log.desc = `绑定模板ID`;
        }
    }
);


/**
 * @route POST api/sms/template
 * @desc  创建短信模板
 * @access 接口是私有的
 */
router.post(
    "/template",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;

        // 3.新增操作
        const newPost = new SmsTemplate({ ...ctx.request.body, createBy: userno });
        await newPost
            .save()
            .then((res) => (ctx.body = res))
            .catch((err) => (ctx.body = err));
        ctx.body = {
            message: "操作成功",
            code: 200,
        };
        global.log.desc = `新增模板`;
    }
);


/**
 * @route PUT api/sms/template
 * @desc  编辑模板
 * @access 接口是私有的
 */
router.put(
    "/template",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { _id } = ctx.request.body;
        // 2.判断如果有有ID  就是编辑
        await SmsTemplate.updateOne({ _id }, {
            $set: Object.assign({ ...ctx.request.body }),
        });
        ctx.body = {
            message: "操作成功",
            code: 200,
        };

        global.log.desc = `编辑模板`;
    }
);


/**
 * @route GET api/sms/template?id=asdfasdf
 * @desc  查看单个模板信息
 * @access 接口是公开的
 */
router.get(
    "/template",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { _id } = ctx.request.query;
        await SmsTemplate.findOne({ _id })
            .then((res) => {
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    message: "操作成功",
                    data: res,
                };
            })
            .catch((err) => {
                ctx.status = 404;
                ctx.body = { code: 404, message: "没有模板信息" };
            });
    }
);

/**
 * @route DELETE api/sms/template
 * @desc  批量删除单个模板
 * @access 接口是私有的
 */
router.delete(
    "/template",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await SmsTemplate.deleteMany({ _id: { $in: ids } }).then(() => {
            ctx.status = 200;
            ctx.body = { code: 200, message: "删除成功" };
        });
    }
);


// 短信管理 - 发送记录   -------------------- start --------------
/**
 * @route GET api/sms/sendRecord/all
 * @desc  查看所有发送记录
 * @access 接口是私有的
 */
router.get(
    "/sendRecord/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { status, keyword, startTime, endTime, user, page, size, isTiming } =
        ctx.request.query;
        const { userno, role } = ctx.state.user;

        let searchData = {
            $or: [
                { phones: new RegExp(keyword) },
                { smsContent: new RegExp(keyword) },
                { resMsgid: new RegExp(keyword) },
            ],
            $and: [
                { createBy: role == 'admin' || role == 'demoAdmin' ? new RegExp(user) : userno },
                { isTiming: JSON.parse(isTiming) },
                { status: new RegExp(status) },
                { createTime: { $gte: startTime } },
                { createTime: { $lte: endTime } }
            ]
        };

        // 总条数
        const total = await SmsSendRecord.find(searchData).countDocuments();

        await SmsSendRecord.find(searchData)
            .sort({ updateTime: -1 })
            .skip(Number(page * size))
            .limit(Number(size))
            .then((res) => {
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: res,
                    total: total,
                };
            })
            .catch((err) => {
                ctx.status = 404;
                ctx.body = {
                    code: 404,
                    message: "找不到任何操作信息",
                };
            });
    }
);


/**
 * @route DELETE api/sms/sendRecord
 * @desc  批量删除发送记录
 * @access 接口是私有的
 */
router.delete(
    "/sendRecord",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await SmsSendRecord.deleteMany({ _id: { $in: ids } }).then(() => {
            ctx.status = 200;
            ctx.body = { code: 200, message: "删除成功" };
        });
    }
);


/**
 * @route GET api/sms/sendRecord?_id
 * @desc  批量删除发送记录
 * @access 接口是私有的
 */
router.get(
    "/sendRecord",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { _id } = ctx.request.query;
        await SmsSendRecord.findOne({ _id }).then((res) => {
            ctx.status = 200;
            ctx.body = { code: 200, data: res, message: "操作成功" };
        });
    }
);


// 短信管理 - 发送回执   -------------------- start --------------
/**
 * @route GET api/sms/returnRecord/all
 * @desc  查看所有发送回执
 * @access 接口是私有的
 */
router.get(
    "/returnRecord/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { status, keyword, startTime, endTime, user, page, size } =
        ctx.request.query;
        const { userno, role } = ctx.state.user;
        let searchData = {
            $or: [
                { fromNum: new RegExp(keyword) },
                { smsContent: new RegExp(keyword) },
                { resMsgid: new RegExp(keyword) },
            ],
            $and: [
                { createBy: role == 'admin' || role == 'demoAdmin' ? new RegExp(user) : userno },
                { status: new RegExp(status) },
                { createTime: { $gte: startTime } },
                { createTime: { $lte: endTime } }
            ]
        };

        // 总条数
        const total = await SmsReturnRecord.find(searchData).countDocuments();

        await SmsReturnRecord.find(searchData)
            .sort({ createTime: -1 })
            .skip(Number(page * size))
            .limit(Number(size))
            .then((res) => {
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: res,
                    total: total,
                };
            })
            .catch((err) => {
                ctx.status = 404;
                ctx.body = {
                    code: 404,
                    message: "找不到任何操作信息",
                };
            });
    }
);


/**
 * @route GET api/sms/returnRecord/chart
 * @desc  查看所有发送回执
 * @access 接口是私有的
 */
router.get(
    "/returnRecord/chart",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { startTime, endTime, user, page, size } =
        ctx.request.query;
        const { userno, role } = ctx.state.user;
        let searchData = {
            $and: [
                { createBy: role == 'admin' || role == 'demoAdmin' ? new RegExp(user) : userno },
                { createTime: { $gte: startTime } },
                { createTime: { $lte: endTime } }
            ]
        };

        await SmsReturnRecord.find(searchData)
            .sort({ createTime: 1 })
            .then((res) => {

                // 按照echart折线图 处理数据
                let data = JSON.parse(JSON.stringify(res))
                data.forEach(val => {
                    val.createTime = sd.format(val.createTime, 'MM-DD')
                })

                // 通过更新时间集合数据
                let _data = _.groupBy(data, "createTime")
                dates = [] // 日期集合
                datax = [] // 成功数据
                datay = [] // 失败数据

                Object.keys(_data).forEach(keys => {
                    dates.push(keys)
                    let _innerData = _.groupBy(_data[keys], "status")
                    Object.keys(_innerData).forEach(key => {
                        // 1.统计每个手机号进行统计
                        if (_innerData['0'] && key == '0') {
                            datax.push(_innerData['0'].length)
                        }
                        if (_innerData['1'] && key == '1') {
                            datay.push(_innerData['1'].length)
                        }

                        // 2.按照实际发送条数统计
                        // if (_innerData['0'] && key == '0') {
                        //     let x = 0
                        //     _innerData[key].forEach(val => {
                        //         x += val.smsCount * 1
                        //     })
                        //     datax.push(x)
                        // }
                        // if (_innerData['1'] && key == '1') {
                        //     let y = 0
                        //     _innerData['1'].forEach(val => {
                        //         y += val.smsCount * 1
                        //     })
                        //     datay.push(y)
                        // }

                        // 没有数据的 默认传0
                        if (!_innerData['0']) { datax.push(0) }
                        if (!_innerData['1']) { datay.push(0) }
                    })
                })

                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: {
                        dates,
                        datax,
                        datay
                    },
                };
            })
            .catch((err) => {
                ctx.status = 404;
                ctx.body = {
                    code: 404,
                    message: "找不到任何操作信息",
                };
            });
    }
);


/**
 * @route DELETE api/sms/returnRecord
 * @desc  批量删除发送回执
 * @access 接口是私有的
 */
router.delete(
    "/returnRecord",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await SmsReturnRecord.deleteMany({ _id: { $in: ids } }).then(() => {
            ctx.status = 200;
            ctx.body = { code: 200, message: "删除成功" };
        });
    }
);

module.exports = router.routes();