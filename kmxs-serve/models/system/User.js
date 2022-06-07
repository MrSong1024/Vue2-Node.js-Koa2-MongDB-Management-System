/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:用户管理
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const UserSchema = new Schema({
    // 用户昵称
    username: {
        type: String,
        required: true,
    },
    // 账号
    userno: {
        type: String,
        required: true,
    },
    // 排序
    orderNum: {
        type: Number
    },
    // 密码
    password: {
        type: String,
        required: true,
    },
    // 头像
    avatar: {
        type: String,
    },
    // 角色
    role: {
        type: String,
    },
    // 性别
    gender: {
        type: String,
    },
    // 账号状态
    status: {
        type: String,
    },
    // 安全等级
    safety: {
        type: String,
        default: "0"
    },
    // 认证状态
    authentication: {
        type: Boolean,
        default: false
    },
    // 邮箱
    email: {
        type: String,
        default: ""
    },
    // 身份证号
    idCard: {
        type: String,
        default: ""
    },
    // 手机号
    phone: {
        type: String,
        default: ""
    },
    // 所属部门
    department: {
        type: String,
        default: ""
    },
    departmentAlias: {
        type: String,
        default: ""
    },
    // 所属岗位
    post: {
        type: String,
        default: ""
    },
    // 常驻地址
    address: {
        type: String,
        default: ""
    },
    // 描述
    desc: {
        type: String,
    },
    // 自定义属性
    extendAttrs: {
        type: String,
        default: ""
    },
    // 创建日期
    date: {
        type: Date,
        default: Date.now,
    },
    // 历史密码记录
    passwords: [{
        // 密码
        password: {
            type: String,
            required: true,
        },
        // 创建日期
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    // 常用设备(新设备)信息列表
    browserInfos: [{
        // 是否常用设备
        isBrowser: {
            type: Boolean,
            default: false
        },
        loginDate: {
            type: Date,
            default: Date.now,
        },
        // 常用设备ID（新设备）
        browserId: {
            type: String,
        },
        // 登录设备的IP
        loginIp: {
            type: String,
        },
        // 地理位置
        location: {
            type: String,
        },
        // 浏览器信息
        browser: {
            type: String,
        },
    }],
    // 密保问题
    securityQuestion: [{
        name: {
            type: String,
        },
        answer: {
            type: String,
        },
        des: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    // 认证信息
    authInfo: {
        // 正面图
        positiveImg: {
            type: String,
        },
        // 背面图
        backImg: {
            type: String,
        },
        // 姓名
        name: {
            type: String,
        },
        // 住址
        address: {
            type: String,
        },
        // 身份证号
        idCard: {
            type: String,
        },
        // 出生
        birth: {
            type: String,
        },
        // 性别
        gender: {
            type: String,
        },
        // 民族
        nation: {
            type: String,
        },
    },
    // 财务信息 、 账户信息（）
    finance: {
        // 可用金额
        availableAmount: {
            required: true,
            type: Number,
            default: 0
        },
        // 消费金额
        cashAmount: {
            required: true,
            type: Number,
            default: 0
        },
        // 充值总额
        amount: {
            required: true,
            type: Number,
            default: 0
        },
        // 短信单价
        smsPrice: {
            required: true,
            type: Number,
            default: 0
        },
        // 可用条数
        usableAmount: {
            required: true,
            type: Number,
            default: 0
        },
        // 发送总数
        sendSmsAmount: {
            required: true,
            type: Number,
            default: 0
        },
    },
});

module.exports = User = mongoose.model("users", UserSchema);