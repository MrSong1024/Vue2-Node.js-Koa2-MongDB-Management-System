/*
 * @Author: Songjq
 * @Date: 2021-12-05 15:13:26
 * @Desscription: 长链接绑定
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const DnsSchema = new Schema({
    user: {
        // 关联数据表
        type: String,
        ref: "users",
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "0"
    },
    name: {
        type: String,
    },
    des: {
        type: String,
    },
    longUrlLists: [{
        label: {
            type: String,
        },
        url: {
            type: String,
        },
        className: {
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
    expirationTime: {
        type: Date,
    },
    // 绑定在线客服
    isOpenServicePc: {
        type: Boolean,
        default: false
    },
    isOpenServicePhone: {
        type: Boolean,
        default: false
    },
    serviceColor: {
        type: String,
    },
    servicePosition: {
        type: String,
        required: true,
        default: "right"
    },
    serviceShow: {
        type: Boolean,
        default: false
    },
    serviceListsPc: [{
        label: {
            type: String,
        },
        value: {
            type: String,
            requied: true,
        },
        status: {
            type: String,
        },
        url: {
            type: String,
        },
        remark: {
            type: String,
        },
        picture: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    serviceListsPhone: [{
        label: {
            type: String,
        },
        value: {
            type: String,
            requied: true,
        },
        status: {
            type: String,
        },
        url: {
            type: String,
        },
        remark: {
            type: String,
        },
        picture: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    serviceStartTime: {
        type: String,
    },
    serviceEndTime: {
        type: String,
    },
    serviceTheme: {
        type: String,
    },
    serviceIt: {
        type: String,
        default: "http://wpa.qq.com/msgrd?v=3&uin=1224939357&site=qq&menu=yes"
    },
    des: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Dns = mongoose.model("dns", DnsSchema);