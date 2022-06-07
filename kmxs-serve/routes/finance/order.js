/*
 * @Author: Songjq
 * @Date: 2022-02-26 19:48:55
 * @Desscription: 财务管理 - 充值订单
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");
const Order = require("../../models/finance/Order");
const User = require("../../models/system/User");
const sd = require('silly-datetime');
const _ = require('lodash');

const { alipay, queryAlipay } = require("../../tools/alipayFunction");


/**
 * @route POST api/order/alipay
 * @desc  立即充值
 * @access 接口是私有的
 */
router.post(
    "/alipay",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { out_trade_no, totalAmount, subject, body, payType } = ctx.request.body;
        const { userno } = ctx.state.user;
        async function timeout() {
            return new Promise((resolve, reject) => {
                alipay(
                    ctx.request.body,
                    (state) => {
                        resolve(state);
                    }
                );
            });
        }

        await timeout().then(async (url) => {
            // 确认订单以后，创建订单
            // 交易状态：WAIT_BUYER_PAY（交易创建，等待买家付款）、TRADE_CLOSED（未付款交易超时关闭，或支付完成后全额退款）、TRADE_SUCCESS（交易支付成功）、TRADE_FINISHED（交易结束，不可退款）

            // 通过订单号查询订单，如果已有订单，直接进入付款流程，如果未创建订单，重新创建订单
            let payResult = await Order.find({ orderNo: out_trade_no })

            // 已有订单，直接进入付款流程
            if (payResult.length) {
                ctx.body = {
                    code: 200,
                    data: url,
                    message: "成功"
                }

                return
            }

            // 未查到当前订单，重新创建订单
            const newPost = new Order({
                orderNo: out_trade_no,
                money: totalAmount,
                status: "ACQ.TRADE_NOT_EXIST", // 默认：交易创建，等待买家付款
                type: payType,
                subject,
                body,
                remark: "",
                createBy: userno
            });
            await newPost
                .save()
                .then((res) => (
                    // 创建订单成功以后，进入付款流程
                    ctx.body = {
                        code: 200,
                        data: url,
                        message: "成功"
                    }))
                .catch((err) => (
                    ctx.body = err
                ));
        });
    }
);

/**
 * @route POST api/order/queryAlipay
 * @desc  查询充值结果
 * @access 接口是私有的
 */
router.post(
    "/queryAlipay",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { out_trade_no } = ctx.request.body;
        async function timeout() {
            return new Promise((resolve, reject) => {
                queryAlipay(
                    out_trade_no,
                    (state) => {
                        resolve(state);
                    }
                );
            });
        }

        await timeout().then((res) => {
            ctx.body = res;
        });
    }
);

/**
 * @route POST api/order
 * @desc  创建充值订单绑定接口地址
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        let orderNo = `${Date.parse(new Date())}${Math.floor(Math.random () * 900) + 100}`
        const newPost = new Order({ ...ctx.request.body, orderNo, createBy: userno });
        await newPost
            .save()
            .then((res) => (ctx.body = res))
            .catch((err) => (ctx.body = err));
        ctx.body = {
            message: "操作成功",
            code: 200,
        };
        global.log.desc = `新增充值订单`;
    }
);

/**
 * @route PUT api/order
 * @desc  编辑充值订单绑定接口地址
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { _id, money, status, createBy } = ctx.request.body;
        const { userno } = ctx.state.user;
        // 获取当前用户信息
        let userData = await User.findOne({ userno: createBy })

        // 只有通过审核的订单，才会计入充值费用
        if (status == 2) {
            // 通过审核才计入统计
            let finance = {
                smsPrice: userData.finance.smsPrice,
                cashAmount: userData.finance.cashAmount,
                sendSmsAmount: userData.finance.sendSmsAmount,
            }

            // 充值总额
            finance.amount = (Number(userData.finance.amount) + Number(money)).toFixed(2)
            // 可用金额
            finance.availableAmount = (Number(finance.amount) - Number(userData.finance.cashAmount)).toFixed(2)
            // 可用条数
            finance.usableAmount = Math.floor(finance.availableAmount / finance.smsPrice).toFixed(2)
            await User.updateOne({ userno: createBy }, {
                $set: {
                    finance
                }
            })
        }

        // 编辑
        await Order.updateOne({ _id }, {
            $set: Object.assign({ ...ctx.request.body, updateBy: userno, updateTime: new Date() }),
        });
        ctx.body = {
            message: "操作成功",
            code: 200,
        };

        global.log.desc = `编辑充值订单`;
    }
);


/**
 * @route GET api/order/all
 * @desc  查看所有充值订单接口地址
 * @access 接口是公开的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { keyword, user, type, status, page, size } = ctx.request.query;
        const { userno, role } = ctx.state.user;
        let searchData = {
            orderNo: new RegExp(keyword),
            createBy: role == 'admin' || role == 'demoAdmin' ? new RegExp(user) : userno,
            type: new RegExp(type),
            status: new RegExp(status),
        };

        // 总条数
        const total = await Order.find(searchData).countDocuments();

        await Order.find(searchData)
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
                ctx.body = { code: 404, message: "找不到任何充值订单信息" };
            });
    }
);


/**
 * @route GET api/order?id=asdfasdf
 * @desc  单个充值订单地址
 * @access 接口是公开的
 */
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { orderNo } = ctx.request.query;
        await Order.findOne({ orderNo })
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
                ctx.body = { code: 404, message: "没有充值订单信息" };
            });
    }
);


/**
 * @route DELETE api/order
 * @desc  删除充值订单地址
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Order.deleteMany({
            _id: { $in: ids },
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });
    }
);


/**
 * @route GET api/order/chart
 * @desc  查看所有充值订单接口地址
 * @access 接口是公开的
 */
router.get(
    "/chart",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { startTime, endTime, keyword, status } = ctx.request.query;
        const { userno, role } = ctx.state.user;
        let searchData = {
            createBy: role == 'admin' || role == 'demoAdmin' ? new RegExp("") : userno,
            status: new RegExp(status),
            orderNo: new RegExp(keyword),
            $and: [
                { updateTime: { $gte: startTime } },
                { updateTime: { $lte: endTime } }
            ]
        };

        await Order.find(searchData)
            .sort({ updateTime: 1 })
            .then((res) => {
                // 按照echart柱状图表 处理数据
                let data = JSON.parse(JSON.stringify(res))
                data.forEach(val => {
                    val.updateTime = sd.format(val.updateTime, 'MM-DD')
                })

                // 通过更新时间集合数据
                let _data = _.groupBy(data, "updateTime")
                dates = [] // 日期集合
                counts = [] // 金额集合

                Object.keys(_data).forEach(key => {
                    dates.push(key)
                    let moneys = 0;
                    _data[key].forEach(val => {
                        moneys += val.money * 1
                    })
                    counts.push(moneys)
                })

                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: {
                        dates,
                        counts
                    },
                };
            })
            .catch((err) => {
                ctx.status = 404;
                ctx.body = { code: 404, message: "找不到任何充值订单信息" };
            });
    }
);

module.exports = router.routes();