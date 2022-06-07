/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 登录管理 - 密码策略
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");
const Policy = require("../../models/login/Policy");

/**
 * @route POST api/policy
 * @desc  新增/编辑配置信息
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { _id } = ctx.request.body;
        // 编辑-密码策略配置
        if (_id) {
            await Policy.updateOne({
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

            global.log.desc = `编辑密码策略配置`;
            return
        }

        // 新增-密码策略配置
        const newPolicy = new Policy({
            ...ctx.request.body
        });
        await newPolicy
            .save()
            .then((res) => {
                ctx.body = {
                    code: 200,
                    message: "操作成功",
                };
                global.log.desc = `新增参数`;
            })
            .catch((err) => {
                ctx.status = 400;
                ctx.body = {
                    code: 400,
                    message: "新增策略失败"
                };
            });
    }
);

/**
 * @route GET api/policy
 * @desc  查看配置详情
 * @access 接口是私有的
 */
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        await Policy.findOne()
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
                ctx.body = {
                    code: 404,
                    message: "没有配置信息"
                };
            });
    }
);

module.exports = router.routes();