/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:字典管理模块
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const DictSchema = new Schema({
    createBy: {
        // 关联数据表
        type: String,
        ref: "users",
        required: true,
    },
    dictName: {
        type: String,
        required: true,
    },
    dictType: {
        type: String,
        required: true,
    },
    // 排序
    orderNum: {
        type: Number
    },
    remark: {
        type: String,
    },
    searchValue: {
        type: String,
    },
    status: {
        type: String,
        required: true,
    },
    updateBy: {
        type: String,
    },
    updateTime: {
        type: Date,
    },
    dictList: [{
        label: {
            type: String,
        },
        value: {
            type: String,
            requied: true,
        },
        valueAlias: {
            type: String,
        },
        status: {
            type: String,
        },
        remark: {
            type: String,
        },
        picture: {
            type: String,
        }
    }, ],
    createTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Dict = mongoose.model("dict", DictSchema);