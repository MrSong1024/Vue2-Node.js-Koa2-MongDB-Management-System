/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 系统设置 - 访问时间段
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入Access模板
const Access = require("../../models/login/Access");

/**
 * @route GET api/access/all
 * @desc  获取所有访问时间段列表
 * @access 接口是私有的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { keyword, status, page, size } = ctx.request.query;
        // 根据关键字检索
        const searchData = {
            // 根据访问时间段名称、访问时间段值筛选
            $or: [
                { name: new RegExp(keyword) },
            ],
            $and: [{ status: new RegExp(status) }],
        };

        // 总条数
        const total = await Access.find(searchData).countDocuments();

        // 根据条件查找数据
        // sort()   # 选择排序方式
        // skip()   # 从第几条开始取数据（入参需要数字类型）
        // limit()  # 取多少条数据（入参需要数字类型）
        await Access.find(searchData)
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
 * @route POST api/access
 * @desc  新增
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { name, times } = ctx.request.body;
        // 判断访问时间段字段是否被占用
        const findResult = await Access.findOne({ name });
        if (findResult) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: "名称已被占用",
            };
        } else {
            // 新增
            const newAccess = new Access({
                ...ctx.request.body,
                startTime: times[0],
                endTime: times[1],
                createBy: userno,
            });
            await newAccess
                .save()
                .then((res) => {
                    ctx.body = {
                        code: 200,
                        message: "操作成功",
                    };
                    global.log.desc = `新增访问时间段`;
                })
                .catch((err) => {
                    ctx.body = err;
                });
        }
    }
);

/**
 * @route PUT api/access
 * @desc  编辑访问时间段
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { _id, times } = ctx.request.body;
        await Access.updateOne({
            _id
        }, {
            $set: {
                ...ctx.request.body,
                startTime: times[0],
                endTime: times[1],
                updateBy: userno,
                updateTime: new Date(),
            },
        });

        ctx.body = {
            code: 200,
            message: "操作成功",
        };

        global.log.desc = `编辑访问时间段`;
    }
);

/**
 * @route DELETE api/access
 * @desc  批量删除访问时间段
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Access.deleteMany({
            _id: { $in: ids },
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });

        // 记录操作日志
        global.log.desc = `删除访问时间段`;
    }
);

/**
 * @route POST api/access/enable
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
            await Access.updateOne({
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

        global.log.desc = `启用访问时间段`;
    }
);

/**
 * @route POST api/access/disable
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
            await Access.updateOne({
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

        global.log.desc = `禁用访问时间段`;
    }
);

module.exports = router.routes();