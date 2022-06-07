/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 系统设置 - 白名单配置
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入White模板
const White = require("../../models/login/White");

/**
 * @route GET api/white/all
 * @desc  获取所有白名单列表
 * @access 接口是私有的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { keyword, status, page, size } = ctx.request.query;
        // 根据关键字检索
        const searchData = {
            // 根据白名单名称、白名单值筛选
            $or: [
                { name: new RegExp(keyword) },
            ],
            $and: [{ status: new RegExp(status) }],
        };

        // 总条数
        const total = await White.find(searchData).countDocuments();

        // 根据条件查找数据
        // sort()   # 选择排序方式
        // skip()   # 从第几条开始取数据（入参需要数字类型）
        // limit()  # 取多少条数据（入参需要数字类型）
        await White.find(searchData)
            .sort({
                createTime: 1,
            })
            .skip(Number(page * size))
            .limit(Number(size))
            .then((res) => {
                // 请求成功，返回200的状态码
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: res, // 返回数据
                    total: total, // 返回总条数
                };
            });
    }
);

/**
 * @route POST api/white
 * @desc  新增
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { name } = ctx.request.body;
        // 判断白名单字段是否被占用
        const findResult = await White.findOne({ name });
        if (findResult) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: "名称已被占用",
            };
        } else {
            // 新增
            const newWhite = new White({
                ...ctx.request.body,
                createBy: userno,
            });
            await newWhite
                .save()
                .then((res) => {
                    ctx.body = {
                        code: 200,
                        message: "操作成功",
                    };
                    global.log.desc = `新增白名单`;
                })
                .catch((err) => {
                    ctx.body = err;
                });
        }
    }
);

/**
 * @route PUT api/white
 * @desc  编辑白名单
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { _id } = ctx.request.body;
        await White.updateOne({
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

        global.log.desc = `编辑白名单`;
    }
);

/**
 * @route DELETE api/white
 * @desc  批量删除白名单
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await White.deleteMany({
            _id: { $in: ids },
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });

        // 记录操作日志
        global.log.desc = `删除白名单`;
    }
);

/**
 * @route POST api/white/enable
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
            await White.updateOne({
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

        global.log.desc = `启用白名单`;
    }
);

/**
 * @route POST api/white/disable
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
            await White.updateOne({
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

        global.log.desc = `禁用白名单`;
    }
);

module.exports = router.routes();