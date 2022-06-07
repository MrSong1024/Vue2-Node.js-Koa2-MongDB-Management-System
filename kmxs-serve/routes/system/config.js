/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 系统设置 - 参数配置
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入Config模板
const Config = require("../../models/system/Config");

/**
 * @route GET api/config/all
 * @desc  获取所有参数列表
 * @access 接口是私有的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { keyword, status, page, size } = ctx.request.query;
        // 根据关键字检索
        const searchData = {
            // 根据参数名称、参数值筛选
            $or: [
                { configName: new RegExp(keyword) },
                { configKey: new RegExp(keyword) },
            ],
            $and: [{ status: new RegExp(status) }],
        };

        // 总条数
        const total = await Config.find(searchData).countDocuments();

        // 根据条件查找数据
        // sort()   # 选择排序方式
        // skip()   # 从第几条开始取数据（入参需要数字类型）
        // limit()  # 取多少条数据（入参需要数字类型）
        await Config.find(searchData)
            .sort({
                orderNum: 1,
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
 * @route POST api/config
 * @desc  新增
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { configKey } = ctx.request.body;
        // 判断参数字段是否被占用
        const findResult = await Config.findOne({ configKey });
        if (findResult) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: "参数值已被占用",
            };
        } else {
            // 新增
            const newConfig = new Config({
                ...ctx.request.body,
                createBy: userno,
            });
            await newConfig
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
    }
);

/**
 * @route PUT api/config
 * @desc  编辑参数
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { _id } = ctx.request.body;
        await Config.updateOne({
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

        global.log.desc = `编辑参数`;
    }
);


/**
 * @route DELETE api/config
 * @desc  批量删除参数
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Config.deleteMany({
            _id: { $in: ids },
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });

        // 记录操作日志
        global.log.desc = `删除参数`;
    }
);

/**
 * @route POST api/config/enable
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
            await Config.updateOne({
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

        global.log.desc = `启用参数`;
    }
);

/**
 * @route POST api/config/disable
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
            await Config.updateOne({
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

        global.log.desc = `禁用参数`;
    }
);



/**
 * @route POST api/config/perms
 * @desc  参数授权操作
 * @access 接口是私有的
 */
router.post(
    "/perms",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { id, permissions } = ctx.request.body;
        const { userno } = ctx.state.user;
        // 通过ID获取当前参数，更新参数权限字段
        await Config.updateOne({
            _id: id,
        }, {
            $set: {
                permissions,
                updateBy: userno,
                updateTime: new Date(),
            },
        });

        ctx.body = {
            code: 200,
            message: "操作成功",
        };

        global.log.desc = `授权操作`; // 记录操作日志
    }
);

module.exports = router.routes();