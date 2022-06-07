/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 角色管理模块
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入Role模板
const Role = require("../../models/system/Role");

/**
 * @route GET api/role/alls
 * @desc  注册界面获取角色列表
 * @access 接口是私有的
 */
router.get(
    "/alls",
    async (ctx) => {
        // 根据条件查找数据
        await Role.find()
            .then((res) => {
                let roles = JSON.parse(JSON.stringify(res))

                let rolesArr = []

                roles.forEach(val => {
                    if (val.roleKey != 'admin') {
                        rolesArr.push({
                            value: val.roleKey,
                            label: val.roleName
                        })
                    }
                })

                // 请求成功，返回200的状态码
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: rolesArr, // 返回数据
                };
            });
    }
);

/**
 * @route GET api/role/all
 * @desc  获取所有角色列表
 * @access 接口是私有的
 */
router.get(
    "/all",
    // token权限验证，判断当前用户是否已登录，获取到token
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { status, keyword, page, size } = ctx.request.query;
        // 根据关键字检索
        const searchData = {
            // 根据角色名称、角色值筛选
            $or: [
                { roleName: new RegExp(keyword) },
                { roleKey: new RegExp(keyword) },
            ], // 根据状态筛选
            $and: [{ status: new RegExp(status) }],
        };

        // 总条数
        const total = await Role.find(searchData).countDocuments();

        // 根据条件查找数据
        // sort()   # 选择排序方式
        // skip()   # 从第几条开始取数据（入参需要数字类型）
        // limit()  # 取多少条数据（入参需要数字类型）
        await Role.find(searchData)
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
 * @route POST api/role
 * @desc  新增角色
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { roleKey } = ctx.request.body;

        // 判断角色字段是否被占用
        const findResult = await Role.findOne({ roleKey });
        if (findResult) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: "角色值已被占用",
            };
        } else {
            // 新增
            const newRole = new Role({
                ...ctx.request.body,
                createBy: userno,
            });
            await newRole
                .save()
                .then((res) => {
                    ctx.body = {
                        code: 200,
                        message: "操作成功",
                    };

                    global.log.desc = `新增角色`;
                })
                .catch((err) => {
                    ctx.body = err;
                });
        }
    }
);


/**
 * @route PUT api/role
 * @desc  编辑角色
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { _id } = ctx.request.body;

        await Role.updateOne({
            _id,
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

        global.log.desc = "编辑角色";
    }
);


/**
 * @route POST api/role/perms
 * @desc  角色授权操作
 * @access 接口是私有的
 */
router.post(
    "/perms",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { id, permissions } = ctx.request.body;
        const { userno } = ctx.state.user;
        // 通过ID获取当前角色，更新角色权限字段
        await Role.updateOne({
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


/**
 * @route DELETE api/role
 * @desc  批量删除角色
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Role.deleteMany({
            _id: { $in: ids },
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });

        // 记录操作日志
        global.log.desc = `删除角色`;
    }
);

/**
 * @route POST api/role/enable
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
            await Role.updateOne({
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

        global.log.desc = `启用角色`;
    }
);

/**
 * @route POST api/role/disable
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
            await Role.updateOne({
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

        global.log.desc = `禁用角色`;
    }
);

module.exports = router.routes();