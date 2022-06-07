/*
 * @Author: Songjq
 * @Date: 2021-12-16 21:19:35
 * @Desscription: 登录模块
 */
const Router = require("koa-router");
const svgCaptcha = require("svg-captcha");
const bcrypt = require("bcryptjs");
const tools = require("../../config/tools");
const jsencrypt = require("../../config/jsencrypt"); // 解密
const passport = require("koa-passport");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const router = new Router();
const sendEmail = require("../../tools/sendEmail.js"); //引入封装好的函数
const { loginSuccessFn } = require("../../tools/loginFunction");
const { v4: uuidv4 } = require('uuid');
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

// 引入相关模板
const User = require("../../models/system/User");
const Role = require("../../models/system/Role");
const Access = require("../../models/login/Access");
const Black = require("../../models/login/Black");
const White = require("../../models/login/White");
const Remote = require("../../models/login/Remote");
const Dict = require("../../models/system/Dict");
const Online = require("../../models/system/Online");

// 引入input验证
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const { passwordPolicy } = require("../../validation/password");

// 引入公共方法
const equipmentInfo = require("../../tools/equipmentInfo"); // 获取设备信息
const logininforFn = require("../../tools/logininfor"); // 写入登录日志方法

const fs = require('fs'); //引入 fs 核心模块
const { Console } = require("console");
const dbJson = './dbs.json'; // 临时存放验证码

/**
 * @route GET api/code
 * @desc  获取验证码
 * @access 接口是公开的
 */
router.get("/code", async (ctx, next) => {
    const {
        browserId
    } = ctx.request.query;
    // 1.字母验数字证码
    // let codeConfig = {
    //     size: 4,// 验证码长度
    //     ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    //     noise: 5, // 干扰线条的数量
    //     width: 100, //验证码宽度
    //     height: 40, //验证码高度
    //     fontSize: 40,   //字体大小
    //     color: true,    //开启字体颜色
    //     background: '#cc9966',//背景颜色
    //     // charPreset:'abcd123456789', //随机预设字符
    // }
    // const cap = svgCaptcha.create(codeConfig); //验证码

    // 2.数学表算式验证码
    let codeConfig = {
        mathMin: 1, //数学表达式的最小值
        mathMax: 20, // 数学表达式的最大值
        mathOperator: "+", // 使用的运算符:+、-或+-(用于随机的+或-)
        noise: 1, // 干扰线条的数量
        width: 160, //验证码宽度
        height: 60, //验证码高度
        fontSize: 60, //字体大小
        color: true, //开启字体颜色
        background: "#cc9966", //背景颜色
    };
    const cap = svgCaptcha.createMathExpr(codeConfig); //算式验证码

    let img = cap.data; // 验证码
    let imgText = cap.text.toUpperCase(); // 验证码字符，忽略大小写（存取值，用于登录验证）
    ctx.response.type = "image/svg+xml"; // 设置响应头
    ctx.body = img;

    // 3.将验证码写入本地文件
    fs.readFile(dbJson, function(err, data) {
        if (err) {
            return console.error(err);
        }
        //将二进制的数据转换为字符串
        let str = data.toString();
        let verificationCode = [];
        //将字符串转换为json对象
        if (str) {
            verificationCode = JSON.parse(str);
        }
        let index = verificationCode.findIndex(item => item.browserId === browserId)
        if (index > -1) {
            verificationCode[index].answer = imgText
        } else {
            let obj = {
                browserId: browserId,
                answer: imgText
            }
            verificationCode.push(obj); //将传来的对象push进数组对象中
        }
        let dataStr = JSON.stringify(verificationCode); //把json对象转换成字符串重新写入json文件中
        fs.writeFile(dbJson, dataStr, function(err) {
            if (err) {
                console.error(err);
            }
        })
    })
});

/**
 * @route POST api/email
 * @desc  发送邮箱验证码
 * @access 接口是公开的
 */
router.post("/email", async (ctx, next) => {
    const {
        code,
        email,
        browserId
    } = ctx.request.body;

    // 1.读取本地文件存储的验证码
    let data = fs.readFileSync(dbJson, 'utf-8');
    let dataArr = JSON.parse(data)
    let fsCode = "",
        fsExpire = "";
    dataArr.forEach(val => {
        // 图形验证码
        if (val.browserId === browserId) {
            fsCode = val.answer
        }
        // 邮箱验证时间
        if (val.email === email) {
            fsExpire = val.expire
        }
    })

    // 2.校验验证码(字母转小写，然后对比校验)
    if (code.toUpperCase() !== fsCode) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "验证码不正确!"
        };
        return;
    }

    // 3.校验发送频率，频率--1分钟内1次
    let nowExpire = new Date().getTime();
    let minute = Math.floor(parseInt(nowExpire - fsExpire) / 1000 / 60)
    if (minute < 1) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "验证请求过于频繁，1分钟内1次"
        };
        return;
    }

    // 4.校验Email邮箱格式，出错时或者为空时
    if (!email) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "参数错误"
        };
        return;
    }

    // 5.通过邮箱获取用户名称  => 仅作展示用
    const findResult = await User.findOne({
        email
    });
    let username = findResult ? findResult.username : email;

    // 6.配置参数
    const conf = {
        get code() {
            // 验证码
            return () => {
                return Math.random().toString(16).slice(2, 6).toUpperCase(); //生成随机验证码
            };
        },
        get expire() {
            // 到期时间
            return () => {
                return new Date().getTime();
            };
        },
    };

    // 7.保存发送认证信息
    let emailCode = conf.code(),
        expire = conf.expire()
    fs.readFile(dbJson, function(err, data) {
        if (err) {
            return console.error(err);
        }
        //将二进制的数据转换为字符串
        let str = data.toString();
        let verificationCode = [];
        //将字符串转换为json对象
        if (str) {
            verificationCode = JSON.parse(str);
        }
        let index = verificationCode.findIndex(item => item.email === email)
        if (index > -1) {
            verificationCode[index].answer = emailCode
            verificationCode[index].expire = expire
        } else {
            let obj = {
                email: email,
                answer: emailCode,
                expire: expire,
            }
            verificationCode.push(obj); //将传来的对象push进数组对象中
        }
        let dataStr = JSON.stringify(verificationCode); //把json对象转换成字符串重新写入json文件中
        fs.writeFile(dbJson, dataStr, function(err) {
            if (err) {
                console.error(err);
            }
        })
    })

    async function timeout() {
        return new Promise((resolve, reject) => {
            // 发送验证码
            sendEmail.sendMail(
                "0",
                username,
                email,
                emailCode,
                (state) => {
                    resolve(state);
                }
            );
        });
    }

    // 8.发送验证码
    await timeout().then((state) => {
        if (state) {
            ctx.body = {
                code: 200,
                message: "验证码发送成功"
            };
        } else {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: "验证码发送失败，请重新尝试"
            };
        }
    });
});

/**
 * @route POST api/register
 * @desc  注册接口地址
 * @access 接口是公开的
 */
router.post("/register", async (ctx) => {
    const {
        errors,
        isValid
    } = validateRegisterInput(ctx.request.body);

    const {
        code,
        userno,
        password,
        username,
        role,
        browserId
    } = ctx.request.body;

    // 1.正则校验 - 判断是否验证通过 
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    // 2.校验密码策略
    async function timeout() {
        return new Promise((resolve, reject) => {
            passwordPolicy(password, "", userno, true, (state) => {
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

    // 2.读取本地文件存储的验证码
    let data = fs.readFileSync(dbJson, 'utf-8');
    let dataArr = JSON.parse(data)
    let fsCode = "";
    dataArr.forEach(val => {
        if (val.browserId === browserId) {
            fsCode = val.answer
        }
    })

    // 3.校验验证码(字母转小写，然后对比校验)
    if (code.toUpperCase() !== fsCode) {
        ctx.status = 400;
        ctx.body = {
            message: "验证码不正确!"
        };
        return;
    }

    // 4.存储到数据库
    const findResult = await User.findOne({
        userno
    });
    if (findResult) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "账号已被占用"
        };
    } else {
        let _password = tools.enbcrypt(jsencrypt.decrypt(password));
        const newUser = new User(
            Object.assign({
                ...ctx.request.body
            }, {
                password: _password,
                role, // 开启用户自动选择角色注册
                status: "0", // 默认启用
                passwords: [{
                    password: _password,
                }]
            })
        );

        // 存储到数据库
        await newUser
            .save()
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: "新用户注册成功",
                    data: {
                        userno,
                        username,
                    },
                };
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

/**
 * @route POST api/login
 * @desc  登录接口地址 返回token
 * @access 接口是公开的
 */
router.post("/login", async (ctx) => {
    const { errors, isValid } = validateLoginInput(ctx.request.body);
    const {
        userno,
        password,
        uuid,
        code,
        email,
        browserId
    } = ctx.request.body;
    const findUser = await User.findOne({ userno });
    const findPolicy = await Policy.findOne();
    const uuids = JSON.parse(jsencrypt.decrypt(uuid));
    // 默认账号登录
    let loginType = "account"

    // 1.获取用户ip 地理位置  浏览器信息
    global.loginInfo = {
        ipaddr: uuids.ipaddr,
        location: uuids.location,
        browser: uuids.browser,
    };

    // 2.判断是否验证通过
    if (!isValid) {
        ctx.status = 400;
        ctx.body = Object.assign({
            code: 400
        }, errors);
        // 写入登录日志
        logininforFn({
            userno,
            loginType,
            email,
            status: 1,
            msg: errors.message,
        });
        return;
    }

    // 6.判断用户是否存在
    if (!findUser) {
        // 用户不存在，终止执行
        ctx.status = 404;
        ctx.body = {
            code: 404,
            message: "用户不存在"
        };
        // 写入登录日志
        logininforFn({
            userno,
            loginType,
            email,
            status: 1,
            msg: "用户不存在",
        });
        return;
    }

    // 3.校验密码策略,临近密码最长使用期限小于3天，发送邮件提醒用户修改密码
    function compare(date) {
        return (a, b) => {
            let v1 = a[date]
            let v2 = b[date]
            return v2 - v1
        }
    }

    // 3.1 没有历史密码记录，先保存当前的
    if (!findUser.passwords.length) {
        let _password = tools.enbcrypt(jsencrypt.decrypt(password));
        await User.updateOne({ userno }, {
            $set: {
                passwords: [{ password: _password }]
            },
        });
    }

    // 3.2 获取新保存的密码
    const findUserResult = await User.findOne({ userno });

    // 3.3 计算创建密码日期差值
    let passwords = findUserResult.passwords.sort(compare("date")),
        pCreateTime = passwords.length && passwords[0].date,
        nowExpire = new Date().getTime(),
        days = Math.floor(parseInt(nowExpire - new Date(pCreateTime).getTime()) / 1000 / 60 / 60 / 24);

    // 3.4 距离密码最长使用期限7天，邮件提醒用户，进行修改密码
    if (findPolicy.useLongTime - days <= 7 && findUserResult.email) {
        console.log("发送邮件提醒")
        sendEmail.sendMail(
            "3",
            findUserResult.username,
            findUserResult.email,
            findPolicy.useLongTime - days,
            (state) => {},
            uuids
        );
    }

    // 3.5 密码已超过最长使用期限，禁止登录
    if (findPolicy.useLongTime - days <= 0) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "密码已超过最长使用期限，请修改后登录"
        };
        return
    }

    // 4.读取本地文件存储的验证码
    let data = fs.readFileSync(dbJson, 'utf-8');
    let dataArr = JSON.parse(data)
    let fsCode = "";
    dataArr.forEach(val => {
        if (val.browserId === browserId) {
            fsCode = val.answer
        }
    })

    // 5.校验验证码(字母转小写，然后对比校验)
    if (code.toUpperCase() !== fsCode) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "验证码不正确!"
        };
        logininforFn({ // 写入登录日志
            userno,
            loginType,
            email,
            status: 1,
            msg: "验证码不正确",
        });
        return;
    }

    // 7.用户存在 - 验证用户状态，如果处于禁用状态，禁止访问
    if (findUserResult.status == 1) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "当前账号已被禁用，请联系管理员"
        };
        return;
    }

    // 8.验证访问时间段是否可操作(超管除外)
    let isGo = false
    const accessResult = await Access.find({ status: "0" })
    let time = new Date()
    accessResult.forEach(val => {
        if (time > new Date(val.startTime) && time < new Date(val.endTime)) {
            isGo = true
        }
    })

    if (isGo && findUserResult.role !== 'admin') {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "系统维护中...",
        };
        return
    }

    // 9.验证黑白名单IP范围的公共方法
    function ip_start_right(stIp, thsIp) {
        // 8.1 当前IP大于等于起始IP
        var arr_st = stIp.split(".");
        var arr_ths = thsIp.split(".");
        for (var i = 0; i < 4; i++) {
            if (arr_st[i] < arr_ths[i]) {
                return true;
            } else if (arr_st[i] == arr_ths[i]) {
                if (i == 3) { return true; }
            } else {
                return false;
            }
        }
    }

    function ip_end_right(enIp, thsIp) {
        // 8.2 当前IP小于等于结束IP
        var arr_en = enIp.split(".");
        var arr_ths = thsIp.split(".");
        for (var i = 0; i < 4; i++) {
            if (arr_ths[i] < arr_en[i]) {
                return true;
            } else if (arr_ths[i] == arr_en[i]) {
                if (i == 3) { return true; }
            } else {
                return false;
            }
        }
    }

    // 10.验证密码（对比密码是否一致）
    var result = await bcrypt.compareSync(
        jsencrypt.decrypt(password),
        findUserResult.password
    );

    // 11. 密码不一致，中止执行
    if (!result) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "密码错误"
        };
        // 写入登录日志
        logininforFn({
            userno,
            loginType,
            email,
            status: 1,
            msg: "密码错误",
        });
        return;
    }

    // 12.验证【IP白名单和IP黑名单】是否可操作(超管除外)
    let isBlack = false,
        isWhite = false,
        thsIp = uuids.ipaddr;
    // 白名单列表
    const whiteResult = await White.find({ status: "0" })
    // 黑名单列表
    const blackResult = await Black.find({ status: "0" })

    // 12.1 判断黑名单
    blackResult.forEach(val => {
        // 当前IP大于等于起始IP，小于等于结束IP，属于黑名单范围
        if (ip_start_right(val.ipStart, thsIp) && ip_end_right(val.ipEnd, thsIp)) {
            isBlack = true
        }
    })

    // 12.2 判断白名单
    whiteResult.forEach(val => {
        // 当前IP大于等于起始IP，小于等于结束IP，属于黑名单范围
        if (ip_start_right(val.ipStart, thsIp) && ip_end_right(val.ipEnd, thsIp)) {
            isWhite = true
        }
    })

    // 12.3 终止执行条件【符合黑名单，但不在白名单内】
    if (!isWhite && isBlack && findUserResult.role !== 'admin') {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "当前IP已被禁用，请申请解封...",
        };
        return
    }

    // 13. 验证新设备登录 - A.使用新设备登录； B.原设备连续7天未登录；
    const remoteResult = await Remote.findOne()

    // 13.1 配置参数
    let browserInfos = findUserResult.browserInfos || [], // 已保存的设备信息
        isCommonEquipment = false, // 是否为常用设备
        isRemote = remoteResult.isRemote, // 开启新设备登录
        isLoginNotice = remoteResult.isLoginNotice, // 新设备通知
        isSecondAuth = remoteResult.isSecondAuth, // 新设备二次认证
        authTime = remoteResult.authTime; // 新设备认证时间

    // 13.2 确认当前设备 是否为 常用设备【已有设备信息且距离上次登录日期小于7天】
    browserInfos.forEach(val => {
        let nowExpire = new Date().getTime(),
            fsExpire = new Date(val.loginDate).getTime();
        let days = Math.floor(parseInt(nowExpire - fsExpire) / 1000 / 60 / 60 / 24)
        if (browserId === val.browserId && days < Number(authTime)) {
            isCommonEquipment = true;
        }
    })

    // 13.3 不允许新设备登录，且当前设备为新设备，返回异常
    if (!isRemote && !isCommonEquipment && findUserResult.role !== 'demoAdmin') {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "新设备，禁止登录"
        };
        return
    }

    // 13.4 允许新设备登录，且开启新设备通知方式
    if (isRemote && isLoginNotice && !isCommonEquipment) {
        // 短信通知
        if (remoteResult.noticeType == '0') {
            console.log("短信通知")
        }

        // 邮件通知
        if (remoteResult.noticeType == '1' && findUserResult.email) {
            sendEmail.sendMail(
                "1",
                findUserResult.username,
                findUserResult.email,
                "",
                (state) => {},
                uuids
            );
        }
    }

    // 13.5 允许新设备登录，且开启新设备二次认证
    if (isRemote && isSecondAuth && !isCommonEquipment && findUserResult.role !== 'demoAdmin') {
        let isSecondAuthTypeOptions = await Dict.findOne({
            dictType: "sys_auth_type"
        })
        let dictList = isSecondAuthTypeOptions.dictList;
        let options = []
        remoteResult.isSecondAuthType.forEach(val => {
            switch (val) {
                case "0":
                    console.log("二维码认证")
                    break;

                case "1":
                    console.log("人脸认证")
                    break;

                case "2":
                    console.log("指纹认证")
                    break;

                case "3":
                    console.log("短信认证")
                    let objPhone = dictList.find((v) => {
                        return v.value == val
                    })
                    objPhone.valueAlias = findUserResult.phone
                    if (findUserResult.phone) {
                        options.push(objPhone)
                    }
                    break;

                case "4":
                    console.log("邮箱认证")
                    let objEmail = dictList.find((v) => {
                        return v.value == val
                    })
                    objEmail.valueAlias = findUserResult.email
                    if (findUserResult.email) {
                        options.push(objEmail)
                    }
                    break;
            }
        })

        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: "新设备，需认证后登录",
            user: {
                userno: findUserResult.userno,
            },
            data: options,
            isSecondAuth: true,
        };
        return;
    }

    // 14.获取角色列表
    const roleResult = await Role.find({
        roleKey: findUserResult.role
    });
    let roles = [...roleResult[0].permissions, ...[findUserResult.role]];

    // 15.生成Jwt的时候Jwt token认证信息
    let tokenId = uuidv4();
    const token = jwt.sign({
            id: findUserResult.id,
            username: findUserResult.username,
            userno: findUserResult.userno,
            tokenId
        },
        keys.secretOrKey, {
            expiresIn: 3600
        }
    );

    // 16.如果当前用户已经登录，根据配置，不允许多台设备同时在线，先踢掉在线设备
    const findOnlines = await Online.find({
        userno: findUserResult.userno
    })
    let usernos = []
    findOnlines.forEach(val => {
        usernos.push(val.userno)
    })
    if (!remoteResult.onceOnline && findOnlines) {
        // 不允许多台设备同时在线，先删除在登录
        await Online.deleteMany({
            userno: { $in: usernos },
        })
    }

    // 17.将jwt token（tokenId）存入在线用户数据集合；
    const newOnline = new Online({
        tokenId,
        username: findUserResult.username,
        userno: findUserResult.userno,
        type: loginType,
        department: findUserResult.departmentAlias,
        ipaddr: uuids.ipaddr,
        location: uuids.location,
        browser: uuids.browser
    });
    await newOnline.save()

    // 18.通过认证，进行登录
    ctx.status = 200;
    ctx.body = {
        code: 200,
        token: "Bearer " + token,
        user: {
            id: findUserResult.id,
            userno: findUserResult.userno,
            username: findUserResult.username,
            role: findUserResult.role,
            avatar: findUserResult.avatar,
            roles,
        },
        message: "登录成功",
    };

    // 19.登录成功以后，写入设备信息
    loginSuccessFn(findUserResult, uuids, browserId, loginType)
});

/**
 * @route POST api/loginOut
 * @desc  退出登录
 * @access 接口是公开的
 */
router.post("/loginOut",
    passport.authenticate("jwt", { session: false }),
    async (ctx, next) => {
        const { userno } = ctx.state.user;
        await Online.deleteOne({
            userno
        }).then((res) => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "退出成功成功",
            };
        });
    });

/**
 * @route POST api/login/by/email
 * @desc  通过邮箱登录
 * @access 接口是公开的
 */
router.post("/login/by/email", async (ctx) => {
    const {
        emailCode,
        uuid,
        email,
        browserId
    } = ctx.request.body;
    const uuids = JSON.parse(jsencrypt.decrypt(uuid));

    // 1.获取用户ip 地理位置  浏览器信息
    global.loginInfo = {
        ipaddr: uuids.ipaddr,
        location: uuids.location,
        browser: uuids.browser,
    };

    // 2.验证当前账号绑定邮箱，是否与登录邮箱一致
    const findUserResult = await User.findOne({
        email
    });

    if (!findUserResult) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "当前邮箱未注册"
        };
        return
    }

    // 3.读取本地文件存储的验证码
    let data = fs.readFileSync(dbJson, 'utf-8');
    let dataArr = JSON.parse(data)
    let fsEmailCode = "",
        fsExpire = "";
    dataArr.forEach(val => {
        if (val.email == email) {
            fsEmailCode = val.answer
            fsExpire = val.expire
        }
    })

    // 4.验证邮箱验证码
    if (fsEmailCode != emailCode.toUpperCase()) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "邮箱验证码不正确"
        };
        return
    }

    // 5.计算分钟时差，大于10分钟，验证码失效
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

    // 6.获取角色列表
    const roleResult = await Role.find({
        roleKey: findUserResult.role
    });
    let roles = [...roleResult[0].permissions, ...[findUserResult.role]];

    // 7.生成Jwt的时候Jwt token认证信息
    let tokenId = uuidv4();
    const token = jwt.sign({
            id: findUserResult.id,
            username: findUserResult.username,
            userno: findUserResult.userno,
            tokenId
        },
        keys.secretOrKey, {
            expiresIn: 3600
        }
    );

    // 8.如果当前用户已经登录，根据配置，不允许多台设备同时在线，先踢掉在线设备
    const findOnlines = await Online.find({
        userno: findUserResult.userno
    })
    let usernos = []
    findOnlines.forEach(val => {
        usernos.push(val.userno)
    })
    if (!remoteResult.onceOnline && findOnlines) {
        // 不允许多台设备同时在线，先删除在登录
        await Online.deleteMany({
            userno: { $in: usernos },
        })
    }

    // 9.将jwt token（tokenId）存入在线用户数据集合；
    const newOnline = new Online({
        tokenId,
        username: findUserResult.username,
        userno: findUserResult.userno,
        type: loginType,
        department: findUserResult.departmentAlias,
        ipaddr: uuids.ipaddr,
        location: uuids.location,
        browser: uuids.browser
    });
    await newOnline.save()

    // 10.通过认证，进行登录
    ctx.status = 200;
    ctx.body = {
        code: 200,
        token: "Bearer " + token,
        user: {
            id: findUserResult.id,
            userno: findUserResult.userno,
            username: findUserResult.username,
            role: findUserResult.role,
            avatar: findUserResult.avatar,
            roles: roles,
        },
        message: "登录成功",
    };

    // 11.登录成功以后，写入设备信息
    loginSuccessFn(findUserResult, uuids, browserId, "email")
});

/**
 * @route POST api/login/by/phone
 * @desc  通过手机号登录
 * @access 接口是公开的
 */
router.post("/login/by/phone", async (ctx) => {
    const {
        phoneCode,
        uuid,
        phone,
        browserId
    } = ctx.request.body;

    const uuids = JSON.parse(jsencrypt.decrypt(uuid));

    // 1.获取用户ip 地理位置  浏览器信息
    global.loginInfo = {
        ipaddr: uuids.ipaddr,
        location: uuids.location,
        browser: uuids.browser,
    };

    // 2.验证当前账号绑定手机号，是否与登录手机号一致
    const findUserResult = await User.findOne({
        phone
    });

    if (!findUserResult) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "当前手机号未注册"
        };
        return
    }

    // 3.读取本地文件存储的验证码
    let data = fs.readFileSync(dbJson, 'utf-8');
    let dataArr = JSON.parse(data)
    let fsPhoneCode = "",
        fsExpire = "";
    dataArr.forEach(val => {
        if (val.phone == phone) {
            fsPhoneCode = val.answer
            fsExpire = val.expire
        }
    })

    // 4.验证手机验证码
    if (fsPhoneCode !== phoneCode) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "手机验证码不正确"
        };
        return
    }

    // 5.计算分钟时差，大于10分钟，验证码失效
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

    // 6.获取角色列表
    const roleResult = await Role.find({
        roleKey: findUserResult.role
    });
    let roles = [...roleResult[0].permissions, ...[findUserResult.role]];

    // 7.生成Jwt的时候Jwt token认证信息
    let tokenId = uuidv4();
    const token = jwt.sign({
            id: findUserResult.id,
            username: findUserResult.username,
            userno: findUserResult.userno,
            tokenId
        },
        keys.secretOrKey, {
            expiresIn: 3600
        }
    );

    // 8.如果当前用户已经登录，根据配置，不允许多台设备同时在线，先踢掉在线设备
    const findOnlines = await Online.find({
        userno: findUserResult.userno
    })
    let usernos = []
    findOnlines.forEach(val => {
        usernos.push(val.userno)
    })
    if (!remoteResult.onceOnline && findOnlines) {
        // 不允许多台设备同时在线，先删除在登录
        await Online.deleteMany({
            userno: { $in: usernos },
        })
    }

    // 9.将jwt token（tokenId）存入在线用户数据集合；
    const newOnline = new Online({
        tokenId,
        username: findUserResult.username,
        userno: findUserResult.userno,
        type: loginType,
        department: findUserResult.departmentAlias,
        ipaddr: uuids.ipaddr,
        location: uuids.location,
        browser: uuids.browser
    });
    await newOnline.save()

    // 10.通过认证，进行登录
    ctx.status = 200;
    ctx.body = {
        code: 200,
        token: "Bearer " + token,
        user: {
            id: findUserResult.id,
            userno: findUserResult.userno,
            username: findUserResult.username,
            role: findUserResult.role,
            avatar: findUserResult.avatar,
            roles: roles,
        },
        message: "登录成功",
    };

    // 11.登录成功以后，写入设备信息
    loginSuccessFn(findUserResult, uuids, browserId, "phone")
});

/**
 * @route GET api/equipment/info
 * @desc  获取电脑信息
 * @access 接口是公开的
 */
router.get("/equipment/info", async (ctx, next) => {
    ctx.body = {
        status: 200,
        success: true,
        body: equipmentInfo,
    };
});

/**
 * @route POST api/forgetPwd
 * @desc  忘记密码？  通过绑定的邮箱找回密码
 * @access 接口是私有的
 */
router.post("/forgetPwd", async (ctx) => {
    const {
        email,
        password,
        emailCode,
        code,
        browserId
    } = ctx.request.body;

    // 1. 读取本地文件存储的验证码
    let data = fs.readFileSync(dbJson, 'utf-8');
    let dataArr = JSON.parse(data)
    let fsCode = "",
        fsEmailCode = "",
        fsExpire = "";
    dataArr.forEach(val => {
        // 读取图片验证码
        if (val.browserId === browserId) {
            fsCode = val.answer
        }
        // 读取邮箱验证码
        if (val.email === email) {
            fsEmailCode = val.answer
            fsExpire = val.expire
        }
    })

    // 2.计算分钟时差，大于10分钟，验证码失效
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

    // 3.校验验证码(字母转小写，然后对比校验)
    if (code.toUpperCase() !== fsCode) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "验证码不正确!"
        };
        return;
    }

    // 4.校验邮箱验证码(字母转小写，然后对比校验)
    if (emailCode.toUpperCase() != fsEmailCode.toUpperCase()) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: "邮箱验证码不正确!"
        };
        return;
    }

    // 5.校验通过，重置密码
    await User.updateOne({
        email
    }, {
        $set: {
            password: tools.enbcrypt(jsencrypt.decrypt(password)),
        },
    });
    ctx.body = {
        code: 200,
        message: "重置密码成功"
    };
    global.log.desc = `重置密码`;
});

module.exports = router.routes();