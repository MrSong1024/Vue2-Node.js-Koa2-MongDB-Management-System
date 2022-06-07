/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:
 */
const koa = require("koa");
const Router = require("koa-router");
const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");
const passport = require("koa-passport");
const cors = require("koa2-cors");
const corsConfigs = require("./config/cors");
const interval = require("./tools/intervalFunction")

// 实例化koa
const app = new koa();

// 处理跨域的配置
app.use(cors(corsConfigs));

// koa-bodyparser主要针对请求报文的处理
app.use(bodyParser());

// 配置路由及请求接口
const router = new Router();

/**
 * 引入Models数据表模块定义
 */
// 登录管理
const login = require("./routes/login/login");
const white = require("./routes/login/white");
const black = require("./routes/login/black");
const access = require("./routes/login/access");
const remote = require("./routes/login/remote");
const policy = require("./routes/login/policy");
// 系统管理
const config = require("./routes/system/config");
const users = require("./routes/system/users");
const dict = require("./routes/system/dict");
const role = require("./routes/system/role");
const menu = require("./routes/system/menu");
const dept = require("./routes/system/dept");
const post = require("./routes/system/post");
const online = require("./routes/system/online");
const attr = require("./routes/system/attr");
// 日志管理
const log = require("./routes/log/log");
// 信息管理
const notice = require("./routes/information/notice");
// 财务管理
const order = require("./routes/finance/order");
// 域名管理
const dns = require("./routes/domain/dns");
// 短信管理
const sms = require("./routes/sms/sms");

/**
 * 定义请求接口Api
 */
// 登录管理
router.use("/api", login);
router.use("/api/white", white);
router.use("/api/black", black);
router.use("/api/access", access);
router.use("/api/remote", remote);
router.use("/api/policy", policy);
// 系统管理
router.use("/api/config", config);
router.use("/api/users", users);
router.use("/api/dict", dict);
router.use("/api/role", role);
router.use("/api/menu", menu);
router.use("/api/dept", dept);
router.use("/api/post", post);
router.use("/api/online", online);
router.use("/api/attr", attr);
// 日志管理
router.use("/api/log", log);
// 信息管理
router.use("/api/notice", notice);
// 财务管理
router.use("/api/order", order);
// 域名管理
router.use("/api/dns", dns);
// 短信管理
router.use("/api/sms", sms);


// 操作日志中间件
const logAsync = require("./middleware/log-async");
app.use(logAsync());

// 打印日志中间件
const Koa_Logger = require("koa-logger");
const logger = Koa_Logger();
app.use(logger);

// passport权限认证 回调到config文件中 passport.js，用于生成token，判断用户是否登录，以及阻断请求的发起
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// 连接数据库 配置数据库连接地址
const db = require("./config/keys").mongoURI;
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Mongodb Connectd...");
    })
    .catch((err) => {
        console.log(err);
    });

// 配置路由
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3889;

app.listen(port, () => {
    console.log(`server started on ${port}`);
});