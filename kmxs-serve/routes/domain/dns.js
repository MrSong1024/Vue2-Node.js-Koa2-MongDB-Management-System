/*
 * @Author: Songjq
 * @Date: 2021-12-05 15:13:05
 * @Desscription:域名管理 - 长链接绑定
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");
const Dns = require("../../models/domain/Dns");
const Dict = require("../../models/system/Dict");
const validateDnsInput = require("../../validation/dns");
const NXlSX = require("node-xlsx");
const Mock = require("mockjs");

const User = require("../../models/system/User");
/**
 * @route POST api/dns
 * @desc  新增
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { errors, isValid } = validateDnsInput(ctx.request.body);
        const { shortUrl } = ctx.request.body;
        const { userno } = ctx.state.user;
        // 判断是否验证通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }

        // 新增操作
        const findResult = await Dns.findOne({
            shortUrl,
        });
        if (findResult) {
            ctx.status = 500;
            ctx.body = { code: 500, message: "短域名已被占用" };
        } else {
            // 新增
            const newDns = new Dns({ ...ctx.request.body });
            console.log(newDns)
            await newDns
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

            global.log.desc = `新增链接`;
        }
    }
);


/**
 * @route PUT api/dns
 * @desc  编辑
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { errors, isValid } = validateDnsInput(ctx.request.body);
        const { _id } = ctx.request.body;

        // 判断是否验证通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }

        await Dns.updateOne({ _id }, {
            $set: Object.assign({ ...ctx.request.body }),
        }).then(() => {
            ctx.body = {
                message: "操作成功",
                code: 200,
            };
        })

        global.log.desc = `编辑链接`;
    }
);


/**
 * @route GET api/dns/all
 * @desc  查看所有长链接接口地址
 * @access 接口是私有的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { keyword, user, type, status, page, size } = ctx.request.query;
        const { userno, role } = ctx.state.user;

        let searchData = {
            shortUrl: new RegExp(keyword),
            user: role == 'admin' ? new RegExp(user) : userno,
            type: new RegExp(type),
            status: new RegExp(status)
        };

        // 总条数
        const total = await Dns.find(searchData).countDocuments();

        await Dns.find(searchData)
            .sort({ date: -1 })
            .skip(Number(page * size))
            .limit(Number(size))
            .then((res) => {
                ctx.status = 200;

                res.forEach(val => {
                    if (val.serviceListsPc == 0) {
                        val.serviceListsPc = [{
                            label: "",
                            value: "",
                            status: "0",
                            url: "",
                            remark: "",
                            picture: "",
                        }, ]
                    }

                    if (val.serviceListsPhone == 0) {
                        val.serviceListsPhone = [{
                            label: "",
                            value: "",
                            status: "0",
                            url: "",
                            remark: "",
                            picture: "",
                        }, ]
                    }
                })



                ctx.body = {
                    code: 200,
                    data: res,
                    total: total,
                };
            })
            .catch((err) => {
                ctx.status = 404;
                ctx.body = { code: 404, message: "找不到任何长链接信息" };
            });
    }
);


/**
 * @route GET api/dns?id=asdfasdf
 * @desc  单个长链接地址
 * @access 接口是公开的
 */
router.get(
    "/",
    // passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { shortUrl } = ctx.request.query;
        const findDns = await Dns.findOne({ shortUrl });
        if (findDns.status != "0") {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: "域名已过期"
            };
            return
        }

        await Dns.findOne({ shortUrl })
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
                ctx.body = { code: 404, message: "没有链接信息" };
            });
    }
);

/**
 * @route DELETE api/dns
 * @desc  批量删除长链接
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Dns.deleteMany({
            _id: { $in: ids },
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });
    }
);

/**
 * @route POST api/dns/enable
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
            await Dns.updateOne({
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

        global.log.desc = `启用长链接`;
    }
);

/**
 * @route POST api/dns/disable
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
            await Dns.updateOne({
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

        global.log.desc = `禁用长链接`;
    }
);


/**
 * @route GET api/dns/all/download
 * @desc  导出
 * @access 接口是私有的
 */
router.get(
    "/all/download",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { dictList } = await Dict.findOne({ dictType: "long_url_type" });

        //表头
        const _headers = [
            "序号",
            "短域名",
            "类型",
            "平台",
            "长链接",
            "过期日期",
            "描述",
        ];

        await Dns.find()
            .sort({ date: -1 })
            .then((res) => {
                const _data = [];
                let id = 0;
                // 处理类型
                res.forEach((val) => {
                    dictList.forEach((v) => {
                        if (val.type == v.value) {
                            val.typeAlias = v.label;
                        }
                    });

                    val.longUrlLists.forEach((v) => {
                        id++;
                        _data.push({
                            id: id,
                            shortUrl: val.shortUrl,
                            typeAlias: val.typeAlias,
                            plat: v.label,
                            longUrl: v.url,
                            expirationTime: val.expirationTime,
                            des: val.des,
                        });
                    });
                });

                let data = [];
                for (let i = 0; i < _data.length; i++) {
                    let arr = [
                        _data[i].id,
                        _data[i].shortUrl,
                        _data[i].typeAlias,
                        _data[i].plat,
                        _data[i].longUrl,
                        _data[i].expirationTime,
                        _data[i].des,
                    ];
                    data.push(arr);
                }
                data.unshift(_headers);

                // 单独设置表格宽度
                const sheetOptions = {
                    "!cols": [
                        { wch: 5 },
                        { wch: 15 },
                        { wch: 10 },
                        { wch: 20 },
                        { wch: 80 },
                        { wch: 15 },
                        { wch: 20 },
                    ],
                };
                console.log(data)
                // 数据格式为[["hello","223"],["22","23"]];
                let buffer = NXlSX.build([{ name: "sheetName", data: data }], {
                    sheetOptions,
                });
                // 返回buffer流到前端
                ctx.body = buffer;
            })
            .catch((err) => {
                ctx.status = 404;
                ctx.body = { code: 404, message: "找不到任何长链接信息" };
            });
    }
);

module.exports = router.routes();