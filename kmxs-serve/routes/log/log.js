/*
 * @Author: Songjq
 * @Date: 2021-12-16 21:19:35
 * @Desscription: 日志管理 - 登录日志/操作日志
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入Logininfor模板
const Logininfor = require("../../models/log/Login");
const OperLog = require("../../models/log/Operation");

/**
 * @route GET api/log/logininfor/all
 * @desc  查看所有登录日志
 * @access 接口是公开的
 */
router.get(
    "/logininfor/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { status, keyword, user, startTime, endTime, page, size } =
        ctx.request.query;
        const { userno, role } = ctx.state.user;
        let searchData = {
            $or: [
                { ipaddr: new RegExp(keyword) },
            ],
            $and: [
                { userno: role == 'admin' || role == 'demoAdmin' ? new RegExp(user) : userno },
                { status: new RegExp(status) },
                { loginTime: { $gte: startTime } },
                { loginTime: { $lte: endTime } },
            ],
        };

        // 总条数
        const total = await Logininfor.find(searchData).countDocuments();

        await Logininfor.find(searchData)
            .sort({ loginTime: -1 })
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
                    message: "找不到任何登录信息",
                };
            });
    }
);


/**
 * @route DELETE api/log
 * @desc  删除 登录日志
 * @access 接口是私有的
 */
router.delete(
    "/logininfor",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Logininfor.deleteMany({ _id: { $in: ids } }).then(() => {
            ctx.status = 200;
            ctx.body = { code: 200, message: "删除成功" };
        });
    }
);


/**
 * @route GET api/log/operLog/all
 * @desc  查看所有操作日志
 * @access 接口是公开的
 */
router.get(
    "/operLog/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { status, keyword, user, startTime, endTime, page, size } =
        ctx.request.query;
        const { userno, role } = ctx.state.user;
        let searchData = {
            $or: [
                { ipaddr: new RegExp(keyword) }
            ],
            $and: [
                { userno: role == 'admin' || role == 'demoAdmin' ? new RegExp(user) : userno },
                { status: new RegExp(status) },
                { date: { $gte: startTime } },
                { date: { $lte: endTime } }
            ],
        };

        // 总条数
        const total = await OperLog.find(searchData).countDocuments();

        await OperLog.find(searchData)
            .sort({ date: -1 })
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
 * @route DELETE api/log/operLog
 * @desc  删除 操作日志
 * @access 接口是私有的
 */
router.delete(
    "/operLog",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await OperLog.deleteMany({ _id: { $in: ids } }).then(() => {
            ctx.status = 200;
            ctx.body = { code: 200, message: "删除成功" };
        });
    }
);

module.exports = router.routes();