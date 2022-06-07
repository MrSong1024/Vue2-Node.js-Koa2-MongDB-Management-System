/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 登录管理 - 新设备
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入Remote模板
const Remote = require("../../models/login/Remote");

/**
 * @route POST api/remote
 * @desc  新增/编辑配置信息
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { _id } = ctx.request.body;
        // 编辑-新设备配置
        if (_id) {
            await Remote.updateOne({
                _id
            }, {
                $set: {
                    ...ctx.request.body,
                    updateBy: userno,
                    updateTime: new Date(),
                },
            });

            ctx.body = {
                code: 200,
                message: "操作成功",
            };

            global.log.desc = `编辑新设备配置`;
            return
        }

        // 新增-新设备配置
        const newRemote = new Remote({
            ...ctx.request.body
        });
        await newRemote
            .save()
            .then((res) => {
                ctx.body = {
                    code: 200,
                    message: "操作成功",
                };
                global.log.desc = `新增参数`;
            })
            .catch((err) => {
                ctx.body = err;
            });
    }
);

/**
 * @route GET api/remote
 * @desc  查看配置详情
 * @access 接口是私有的
 */
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        await Remote.findOne()
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
                ctx.body = { code: 404, message: "没有配置信息" };
            });
    }
);

module.exports = router.routes();