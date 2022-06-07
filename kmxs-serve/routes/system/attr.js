/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 系统设置 - 拓展属性
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");
const Attr = require("../../models/system/Attr");

/**
 * @route POST api/attr
 * @desc  新增拓展属性
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const newAttr = new Attr(
            Object.assign({ ...ctx.request.body }, {
                createBy: userno,
            })
        );

        await newAttr
            .save()
            .then((res) => {
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    message: "操作成功",
                };
            })
            .catch((err) => {
                ctx.body = err;
            });

        global.log.desc = `新增拓展属性`;
    }
);


/**
 * @route PUT api/attr
 * @desc  编辑拓展属性
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { _id } = ctx.request.body;
        await Attr.updateOne({ _id }, {
            $set: Object.assign({ ...ctx.request.body }, { updateBy: userno, updateTime: new Date() }),
        });
        ctx.body = {
            code: 200,
            message: "操作成功",
        };
        global.log.desc = `编辑拓展属性`;
    }
);


/**
 * @route GET api/attr/all
 * @desc  获取拓展属性列表
 * @access 接口是私有的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { attrType, keyword, status, page, size } =
        ctx.request.query;
        // 根据关键字检索
        const searchData = {
            $or: [
                { attrKey: new RegExp(keyword) },
                { attrName: new RegExp(keyword) }
            ],
            $and: [
                { attrType: new RegExp(attrType) },
                { status: new RegExp(status) },
            ],
        };

        // 总条数
        const total = await Attr.find(searchData).countDocuments();

        // 根据条件查找数据
        await Attr.find(searchData)
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
 * @route DELETE api/attr
 * @desc  批量删除拓展属性
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Attr.deleteMany({
            _id: { $in: ids },
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });

        // 记录操作日志
        global.log.desc = `${ctx.state.user.userno}删除拓展属性`;
    }
);

/**
 * @route POST api/attr/enable
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
            await Attr.updateOne({
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

        global.log.desc = `启用拓展属性`;
    }
);

/**
 * @route POST api/attr/disable
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
            await Attr.updateOne({
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

        global.log.desc = `禁用拓展属性`;
    }
);

module.exports = router.routes();