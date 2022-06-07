/*
 * @Author: Songjq
 * @Date: 2021-12-16 21:19:35
 * @Desscription: 用户管理模块
 */
const Router = require("koa-router");
const router = new Router();
const bcrypt = require("bcryptjs");
const tools = require("../../config/tools");
const jsencrypt = require("../../config/jsencrypt"); // 解密
const passport = require("koa-passport");
const { validateUserInput } = require("../../validation/user");

// 引入相关定义模型
const User = require("../../models/system/User");
const Role = require("../../models/system/Role");
const Config = require("../../models/system/Config");

// 引入input验证
const { passwordPolicy } = require("../../validation/password");

const fs = require('fs'); //引入 fs 核心模块
const dbJson = './dbs.json'; // 临时存放验证码

/**
 * @route GET api/users/all
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
                { username: new RegExp(keyword) },
                { userno: new RegExp(keyword) }
            ],
            $and: [
                { status: new RegExp(status) },
            ],
        };

        // 总条数
        const total = await User.find(searchData).countDocuments();

        await User.find(searchData)
            .sort({ date: -1 })
            .skip(Number(page * size))
            .limit(Number(size))
            .then((res) => {
                let data = []
                res.forEach(val => {
                    data.push({
                        _id: val._id,
                        username: val.username,
                        userno: val.userno,
                        orderNum: val.orderNum,
                        role: val.role,
                        status: val.status,
                        safety: val.safety,
                        authentication: val.authentication,
                        email: val.email,
                        department: val.department,
                        departmentAlias: val.departmentAlias,
                        post: val.post,
                        desc: val.desc,
                        smsPrice: val.finance.smsPrice,
                        extendAttrs: val.extendAttrs,
                    })
                })

                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data,
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
 * @route GET api/users/current
 * @desc  用户信息接口地址 返回用户信息
 * @access 接口是私密的
 */
router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { role, id, username, userno, avatar, finance } = ctx.state.user;
        const roleResult = await Role.findOne({ roleKey: role });
        // 权限列表
        let roles = [...roleResult.permissions, ...[role]];
        ctx.status = 200;
        ctx.body = {
            code: 200,
            user: {
                id,
                username,
                userno,
                avatar,
                role,
                roles: roles,
                finance
            },
        };
    }
);


/**
 * @route GET api/users/currentAll
 * @desc  获取个人详细信息
 * @access 接口是私密的
 */
router.get(
    "/currentAll",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const userResult = await User.findOne({ userno });

        if (userResult.department) {
            const deptResult = await Dept.findOne({ _id: userResult.department });
            userResult.departmentAlias = deptResult ? deptResult.deptName : ""
        }

        // 安全等级
        // 默认：0 - 存在风险
        // 绑定邮箱和手机号  1：一般
        if (userResult.email && userResult.phone) {
            userResult.safety = '1'
        }

        // 完成实名认证 2：安全
        if (userResult.email && userResult.phone && userResult.idCard) {
            userResult.safety = '2'
        }

        const {
            _id,
            address,
            authentication,
            avatar,
            browserInfos,
            date,
            department,
            departmentAlias,
            desc,
            email,
            extendAttrs,
            gender,
            idCard,
            phone,
            post,
            role,
            safety,
            status,
            username,
            finance
        } = userResult;
        // 权限列表
        ctx.status = 200;
        ctx.body = {
            code: 200,
            data: {
                _id,
                address,
                authentication,
                avatar,
                browserInfos,
                date,
                department,
                departmentAlias,
                desc,
                email,
                extendAttrs,
                gender,
                idCard,
                phone,
                post,
                role,
                safety,
                status,
                username,
                userno,
                finance
            }
        };
    }
);


/**
 * @route POST api/users
 * @desc  新增
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { errors, isValid } = validateUserInput(ctx.request.body);
        // 1.判断是否验证通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }
        const { userno, email, smsPrice: price } = ctx.request.body;

        // 获取当前用户信息
        const findUserResult = await User.findOne({ userno });

        // 2.验证邮箱是否已被占用
        const findResult = email && (await User.findOne({ email }));
        if (findResult && findResult.userno != userno) {
            ctx.status = 400;
            ctx.body = { code: 400, message: "邮箱已被占用" };
            global.log.desc = `邮箱已被占用`;
            return;
        }

        let configData = await Config.findOne({ configKey: "system.sms.price" })

        // 获取系统参数
        let smsPrice = price ? price : configData.configValue;

        // 4.新增用户
        if (findUserResult) {
            ctx.status = 400;
            ctx.body = { code: 400, message: "账号已被占用" };
            global.log.desc = `账号已被占用`;
            return
        }

        // 5.确认新增
        const newUser = new User({
            ...ctx.request.body,
            password: tools.enbcrypt("Aabc123456"),
            finance: {
                smsPrice,
            }
        });
        await newUser
            .save()
            .then((res) => {
                ctx.body = {
                    message: "操作成功",
                    code: 200,
                };
                global.log.desc = `新增用户成功`;
            })
            .catch((err) => {
                console.log(err);
            });
    }
);


/**
 * @route PUT api/users
 * @desc  编辑
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { errors, isValid } = validateUserInput(ctx.request.body);
        // 1.判断是否验证通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }

        const {
            _id,
            userno,
            email,
            smsPrice,
            address,
            department,
            departmentAlias,
            extendAttrs,
            gender,
            post,
            username,
            role
        } = ctx.request.body;

        // 获取当前用户信息
        const findUserResult = await User.findOne({ userno });

        // 2.验证邮箱是否已被占用
        const findResult = email && (await User.findOne({ email }));
        if (findResult && findResult.userno != userno) {
            ctx.status = 400;
            ctx.body = { code: 400, message: "邮箱已被占用" };
            global.log.desc = `邮箱已被占用`;
            return;
        }
        let configData = await Config.findOne({ configKey: "system.sms.price" })

        // 获取系统参数
        let price = smsPrice ? smsPrice : configData.configValue;

        await User.updateOne({ _id }, {
            $set: {
                username,
                gender,
                department,
                departmentAlias,
                post,
                address,
                extendAttrs,
                role,
                finance: {
                    ...findUserResult.finance,
                    smsPrice: price
                }
            },
        });
        ctx.body = { code: 200, message: "操作成功" };
        global.log.desc = `编辑用户成功`;
    }
);


/**
 * @route POST api/users/resetPwd
 * @desc  重置密码
 * @access 接口是私有的
 */
router.post(
    "/resetPwd",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userId } = ctx.request.body;
        await User.updateOne({ _id: userId }, {
            $set: {
                password: tools.enbcrypt("Aabc123456"), // 新增用户默认初始密码 123456
            },
        });
        ctx.body = {
            code: 200,
            message: "密码重置成功",
        };
        global.log.desc = `密码重置成功`;
    }
);


/**
 * @route POST api/users/resetUserName
 * @desc  修改用户名
 * @access 接口是私有的
 */
router.post(
    "/resetUserName",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { username } = ctx.request.body;
        const { userno } = ctx.state.user;
        // 编辑
        await User.updateOne({ userno }, {
            $set: { username },
        });
        ctx.body = {
            code: 200,
            message: "修改用户名成功",
        };
        global.log.desc = `修改用户名成功`;
    }
);


/**
 * @route DELETE api/users?id=adsfasdfasf
 * @desc  删除用户
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await User.deleteMany({
            _id: { $in: ids }
        }).then(() => {
            ctx.status = 200;
            ctx.body = { code: 200, message: "删除成功" };
            global.log.desc = `删除用户成功`;
        });
    }
);

/**
 * @route POST api/users/enable
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
            await User.updateOne({
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

        global.log.desc = `启用用户`;
    }
);

/**
 * @route POST api/users/disable
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
            await User.updateOne({
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

        global.log.desc = `禁用用户`;
    }
);


/**
 * @route POST api/users/changePwd
 * @desc  修改密码
 * @access 接口是私有的
 */
router.post(
    "/changePwd",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { oldPassword, newPassword } = ctx.request.body;
        const { password, userno } = ctx.state.user;
        const findUser = await User.findOne({ userno })

        // 1.校验密码策略
        async function timeout() {
            return new Promise((resolve, reject) => {
                passwordPolicy(newPassword, oldPassword, userno, false, (state) => {
                    resolve(state);
                })
            })
        }
        let messages = []
        await timeout().then((res) => {
            messages = res.messages;
        });

        if (messages.length > 0) {
            ctx.status = 403;
            ctx.body = {
                code: 403,
                messages
            };
            return
        }

        // 查到后 验证密码
        var result = await bcrypt.compareSync(
            jsencrypt.decrypt(oldPassword),
            password
        ); // 对比密码是否一致

        // 验证通过
        if (result) {
            await User.updateOne({ userno }, {
                $set: {
                    password: tools.enbcrypt(jsencrypt.decrypt(newPassword)),
                    passwords: findUser.passwords.concat([{
                        password: tools.enbcrypt(jsencrypt.decrypt(newPassword)),
                    }])
                },
            });
            ctx.body = {
                code: 200,
                message: "密码修改成功",
            };
            global.log.desc = `密码修改成功`;
        } else {
            ctx.status = 400;
            ctx.body = { message: "原密码错误", code: 400 };
            global.log.desc = `原密码错误`;
        }
    }
);


/**
 * @route POST api/users/changeEmail
 * @desc  修改邮箱
 * @access 接口是私有的
 */
router.post(
    "/changeEmail",
    // passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { email, emailCode, userno } = ctx.request.body;

        // 1.确认邮箱是否已经被占用
        const findUserResult = await User.findOne({ email });
        if (findUserResult) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: "邮箱已被占用，请更换"
            };
            return
        }

        // 2.读取本地文件存储的验证码
        let data = fs.readFileSync(dbJson, 'utf-8');
        let dataArr = JSON.parse(data)
        let fsEmailCode = "",
            fsExpire = "";
        dataArr.forEach(val => {
            if (val.email === email) {
                fsEmailCode = val.answer
                fsExpire = val.expire
            }
        })

        // 3.校验邮箱验证码(字母转小写，然后对比校验)
        if (fsEmailCode !== emailCode.toUpperCase()) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: "邮箱验证码不正确"
            };
            return
        }

        // 4.计算分钟时差，大于10分钟，验证码失效
        let nowExpire = new Date().getTime();
        let minute = Math.floor(parseInt(nowExpire - fsExpire) / 1000 / 60)
        if (minute > 10) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: "验证码已失效，请重新获取"
            };
            return;
        }

        // 5.校验通过，重置邮箱
        await User.updateOne({ userno }, {
            $set: {
                email,
            },
        });
        ctx.body = {
            code: 200,
            message: "绑定邮箱成功"
        };
        global.log.desc = `绑定邮箱`;
    }
);


/**
 * @route POST api/users/changePhone
 * @desc  修改手机号
 * @access 接口是私有的
 */
router.post(
    "/changePhone",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { phone, phoneCode } = ctx.request.body;
        const { userno } = ctx.state.user;

        // 1.确认手机是否已经被占用
        const findUserResult = await User.findOne({ phone });
        if (findUserResult) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: "手机号已被占用，请更换"
            };
            return
        }

        // 2.读取本地文件存储的验证码
        let data = fs.readFileSync(dbJson, 'utf-8');
        let dataArr = JSON.parse(data)
        let fsPhoneCode = "",
            fsExpire = "";
        dataArr.forEach(val => {
            // 读取手机验证时间
            if (val.phone === phone) {
                fsPhoneCode = val.answer
                fsExpire = val.expire
            }
        })

        // 3.校验手机验证码(字母转小写，然后对比校验)
        if (fsPhoneCode !== phoneCode) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: "手机验证码不正确!"
            };
            return;
        }

        // 4.计算分钟时差，大于10分钟，验证码失效
        let nowExpire = new Date().getTime();
        let minute = Math.floor(parseInt(nowExpire - fsExpire) / 1000 / 60)
        if (minute > 10) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: "验证码已失效，请重新获取"
            };
            return;
        }

        // 5.校验通过，重置密码
        await User.updateOne({ userno }, {
            $set: {
                phone,
            },
        });
        ctx.body = {
            code: 200,
            message: "绑定手机成功"
        };
        global.log.desc = `绑定手机`;
    }
);


/**
 * 百度智能云平台 - API接口对接
 * 
 * 详细路径：产品 - 人工智能 - OCR文字识别 - 卡证文字识别 - 身份证识别
 * 平台地址：https://cloud.baidu.com/doc/OCR/s/rk3h7xzck
 * 
 */
const AipOcrClient = require("baidu-aip-sdk").ocr;

// 设置APPID/AK/SK  
// const APP_ID = "你的 App ID";
// const API_KEY = "你的 Api Key";
// const SECRET_KEY = "你的 Secret Key";
const APP_ID = "25593013";
const API_KEY = "GEQgrDD2UZgYSOXrGVkODGqy";
const SECRET_KEY = "brTmEmFTlvflSVqW12jqGCG8GS6TBgjh";

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

/**
 * @route POST api/users/certification
 * @desc  识别身份证-实名认证
 * @access 接口是私有的
 */
router.post(
    "/certification",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { positiveImg, backImg } = ctx.request.body;
        const { userno } = ctx.state.user;

        let idCardSide = 'front'

        // 如果有可选参数
        var options = {};
        options["detect_direction"] = false; // 是否检测图像朝向，默认不检测，即：false
        options["detect_risk"] = true; // 是否开启身份证风险类型(身份证复印件、临时身份证、身份证翻拍、修改过的身份证)功能，默认不开启，即：false
        const positiveCardResult = await client.idcard(positiveImg, idCardSide, options)

        // 1.判断身份证号是否已被占用
        const findUserResult = await User.findOne({ idCard: positiveCardResult.words_result['公民身份号码'].words });
        if (findUserResult) {
            ctx.status = 400;
            ctx.body = { code: 400, message: "此身份证信息已被占用" };
            global.log.desc = `身份证信息已被占用`;
        } else {
            await User.updateOne({ userno }, {
                $set: {
                    authentication: true,
                    idCard: positiveCardResult.words_result['公民身份号码'].words,
                    authInfo: {
                        positiveImg,
                        backImg,
                        name: positiveCardResult.words_result['姓名'].words,
                        address: positiveCardResult.words_result['住址'].words,
                        idCard: positiveCardResult.words_result['公民身份号码'].words,
                        birth: positiveCardResult.words_result['出生'].words,
                        gender: positiveCardResult.words_result['性别'].words,
                        nation: positiveCardResult.words_result['民族'].words,
                    }
                },
            });
            // 校验通过，
            ctx.body = { code: 200, message: "认证成功" };
            global.log.desc = `实名认证`;
        }
    }
);

module.exports = router.routes();