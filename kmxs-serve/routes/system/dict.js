/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 系统设置 - 字典管理
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入Dict模板
const Dict = require("../../models/system/Dict");

/**
 * @route POST api/dict
 * @desc  新增字典
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { dictType } = ctx.request.body;

        // 判断字典字段是否被占用
        const findResult = await Dict.findOne({
            dictType,
        });
        if (findResult) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: "字典值已被占用",
            };
            return
        }

        // 新增
        const newDict = new Dict(
            Object.assign({ ...ctx.request.body }, {
                createBy: userno,
            })
        );

        // 新增
        await newDict
            .save()
            .then((res) => {
                ctx.body = res;
            })
            .catch((err) => {
                ctx.body = err;
            });

        ctx.body = {
            code: 200,
            message: "操作成功",
        };

        global.log.desc = `新增字典`;

    }
);


/**
 * @route PUT api/dict
 * @desc  编辑字典
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { _id } = ctx.request.body;

        // 编辑
        await Dict.updateOne({ _id }, {
            $set: Object.assign({ ...ctx.request.body }, { updateBy: userno, updateTime: new Date() }),
        });
        ctx.body = {
            code: 200,
            message: "操作成功",
        };
        global.log.desc = `编辑字典`;

    }
);


/**
 * @route GET api/dict/all
 * @desc  获取字典列表
 * @access 接口是私有的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { dictType, keyword, status, page, size } =
        ctx.request.query;
        // 根据关键字检索
        const searchData = {
            $or: [
                { dictType: new RegExp(keyword) },
                { dictName: new RegExp(keyword) }
            ],
            $and: [
                { dictType: new RegExp(dictType) },
                { status: new RegExp(status) },
            ],
        };

        // 总条数
        const total = await Dict.find(searchData).countDocuments();

        // 根据条件查找数据
        await Dict.find(searchData)
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
 * @route DELETE api/dict
 * @desc  批量删除字典
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Dict.deleteMany({
            _id: { $in: ids },
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });

        // 记录操作日志
        global.log.desc = `${ctx.state.user.userno}删除字典`;
    }
);

/**
 * @route POST api/dict/enable
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
            await Dict.updateOne({
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

        global.log.desc = `启用字典`;
    }
);

/**
 * @route POST api/dict/disable
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
            await Dict.updateOne({
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

        global.log.desc = `禁用字典`;
    }
);

module.exports = router.routes();