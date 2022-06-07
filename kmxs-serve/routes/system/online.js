/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 系统设置 - 在线用户
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");
const Online = require("../../models/system/Online");

/**
 * @route GET api/online/all
 * @desc  获取在线用户列表
 * @access 接口是私有的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { keyword, page, size } = ctx.request.query;
        // 根据关键字检索
        const searchData = {
            $or: [
                { ipaddr: new RegExp(keyword) },
            ],
        };

        // 总条数
        const total = await Online.find(searchData).countDocuments();

        // 根据条件查找数据
        await Online.find(searchData)
            .sort({
                loginTime: -1,
            })
            .skip(Number(page * size))
            .limit(Number(size))
            .then((res) => {
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: res,
                    total: total,
                };
            });
    }
);

/**
 * @route DELETE api/online
 * @desc  批量在线用户
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Online.deleteMany({
            _id: { $in: ids },
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "强退成功",
            };
        });

        // 记录操作日志
        global.log.desc = `${ctx.state.user.userno}强退在线用户`;
    }
);

module.exports = router.routes();