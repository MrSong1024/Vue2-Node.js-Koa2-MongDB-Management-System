/*
 * @Author: Songjq
 * @Date: 2022-01-24 17:39:52
 * @Desscription: 信息管理 - 通知公告
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入Notice模板
const Notice = require("../../models/information/Notice");

/**
 * @route POST api/notice
 * @desc  新增
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        // 新增
        const newNotice = new Notice(
            Object.assign({
                ...ctx.request.body
            }, {
                createBy: userno,
            })
        );
        await newNotice
            .save()
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: "操作成功",
                };
                global.log.desc = `新增公告`;
            })
            .catch((err) => {
                ctx.body = err;
            });
    }
);


/**
 * @route PUT api/notice
 * @desc  编辑
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { _id } = ctx.request.body;
        await Notice.updateOne({
            _id
        }, {
            $set: Object.assign({
                ...ctx.request.body
            }, {
                updateBy: userno,
                updateTime: new Date()
            }),
        });
        ctx.body = {
            code: 200,
            message: "操作成功",
        };
        global.log.desc = `编辑公告`;

    }
);


/**
 * @route GET api/notice/all
 * @desc  获取公告列表
 * @access 接口是私有的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const {
            keyword,
            type,
            status,
            user,
            page,
            size
        } = ctx.request.query;
        const { userno, role } = ctx.state.user;
        // 根据关键字检索
        const searchData = {
            status: new RegExp(status),
            noticeTitle: new RegExp(keyword),
            noticeType: new RegExp(type),
            createBy: role == 'admin' || role == 'demoAdmin' ? new RegExp(user) : userno,
        };

        // 总条数
        const total = await Notice.find(searchData).countDocuments();

        // 根据条件查找数据
        await Notice.find(searchData)
            .sort({
                createTime: -1,
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
 * @route DELETE api/notice
 * @desc  批量删除公告
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Notice.deleteMany({
            _id: {
                $in: ids
            },
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });

        // 记录操作日志
        global.log.desc = `${ctx.state.user.userno}删除公告`;
    }
);

/**
 * @route POST api/notice/enable
 * @desc  批量启用
 * @access 接口是私有的
 */
router.post(
    "/enable",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { ids } = ctx.request.body;
        ids.forEach(async _id => {
            await Notice.updateOne({
                _id
            }, {
                $set: {
                    status: "0",
                    updateBy: userno,
                    updateTime: new Date(),
                },
            });
        })

        ctx.body = {
            code: 200,
            message: "操作成功",
        };

        global.log.desc = `启用通知公告`;
    }
);

/**
 * @route POST api/notice/disable
 * @desc  批量禁用
 * @access 接口是私有的
 */
router.post(
    "/disable",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { ids } = ctx.request.body;
        ids.forEach(async _id => {
            await Notice.updateOne({
                _id
            }, {
                $set: {
                    status: "1",
                    updateBy: userno,
                    updateTime: new Date(),
                },
            });
        })

        ctx.body = {
            code: 200,
            message: "操作成功",
        };

        global.log.desc = `禁用通知公告`;
    }
);

module.exports = router.routes();