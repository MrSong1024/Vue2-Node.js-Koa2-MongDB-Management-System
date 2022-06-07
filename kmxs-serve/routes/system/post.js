/*
 * @Author: Songjq
 * @Date: 2022-04-19 22:15:59
 * @Desscription: 系统设置 - 岗位管理
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入相关定义模型
const Post = require("../../models/system/Post");

// 引入input验证
const functions = require("../../validation/post");

/**
 * @route GET api/post/all
 * @desc  查看所有用户
 * @access 接口是私密的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { keyword, page, size, status } = ctx.request.query;
        let searchData = {
            $or: [
                { postName: new RegExp(keyword) },
                { postNo: new RegExp(keyword) }
            ],
            $and: [
                { status: new RegExp(status) },
            ],
        };

        // 总条数
        const total = await Post.find(searchData).countDocuments();

        await Post.find(searchData)
            .sort({ orderNum: -1 })
            .skip(Number(page * size))
            .limit(Number(size))
            .then((res) => {
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: res,
                    total: total,
                };
            })
            .catch((err) => {
                ctx.status = 404;
                ctx.body = { code: 404, message: "找不到任何用户信息" };
            });
    }
);

/**
 * @route POST api/post
 * @desc  新增
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { postNo } = ctx.request.body;
        const { userno } = ctx.state.user;

        // 获取当前用户信息
        const findPostResult = await Post.findOne({ postNo });

        // 编码被占用
        if (findPostResult) {
            ctx.status = 500;
            ctx.body = { code: 500, message: "编码已被占用" };
            global.log.desc = `编码已被占用`;
            return
        }

        // 确认新增
        const newPost = new Post({
            ...ctx.request.body,
            createBy: userno
        });
        await newPost
            .save()
            .then((res) => {
                ctx.body = {
                    message: "操作成功",
                    code: 200,
                };
                global.log.desc = `新增岗位成功`;
            })
            .catch((err) => {
                console.log(err);
            });
    }
);


/**
 * @route PUT api/post
 * @desc  编辑
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { _id } = ctx.request.body;
        const { userno } = ctx.state.user;

        await Post.updateOne({ _id }, {
            $set: {
                ...ctx.request.body,
                updateBy: userno,
                updateTime: new Date()
            },
        });
        ctx.body = { code: 200, message: "操作成功" };
        global.log.desc = `编辑用户成功`;
    }
);

/**
 * @route DELETE api/post?id=adsfasdfasf
 * @desc  删除用户
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Post.deleteMany({
            _id: { $in: ids }
        }).then(() => {
            ctx.status = 200;
            ctx.body = { code: 200, message: "删除成功" };
            global.log.desc = `删除用户成功`;
        });
    }
);

/**
 * @route POST api/post/enable
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
            await Post.updateOne({
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

        global.log.desc = `启用岗位`;
    }
);

/**
 * @route POST api/post/disable
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
            await Post.updateOne({
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

        global.log.desc = `禁用岗位`;
    }
);


module.exports = router.routes();