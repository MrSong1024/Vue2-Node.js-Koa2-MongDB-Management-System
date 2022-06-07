/*
 * @Author: Songjq
 * @Date: 2022-04-07 16:52:31
 * @Desscription: 创建全局公共的方法
 */
import { Notification, MessageBox } from "element-ui";
/**
 * 日期格式化
 *
 * @param {*} time 日期/时间
 * @param {*} cFormat 返回的格式,默认精确到秒
 * @returns
 */
function parseTime(time, cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat
    let date
    if (typeof time === 'undefined' || time === null || time === 'null') {
        return ''
    } else if (typeof time === 'object') {
        date = time
    } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
            time = parseInt(time)
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

/**
 * @desc 格式化时间
 * @param {String} value 要格式的时间字符串 时间戳 或者时间格式 1786542452200 / Tue Aug 07 2018 16:11:04 GMT+0800
 * @param {String} format 格式
 * @return {String} 格式化的结果
 *
 * format 说明：
 * ----------------------
 * YY || YYYY 年
 * MM || M 月
 * DD || D 日
 * hh || h 小时
 * mm || m 分钟
 * ss || s 秒
 * 使用`[]`包裹不处理的字符，一般用不到，如：'YYYY[YYYY这是奇葩的需求]-MM-DD hh:mm:ss' => '2018YYYY这是奇葩的需求不过我喜欢-08-07 17:06:32'
 * ----------------------
 */
function formatDate(value, format = 'YYYY-MM-DD hh:mm:ss') {
    const regexp = /(\[[^[]*\])|Y{2,}|M+|D+|h+|m+|s+/g
    const pattern = (value, len, extra) => {
        return extra ?
            value.substr(len * -1) :
            len === value.length ?
            value :
            value * 1
    }
    const date = parseDate(value)
    const maps = {
        Y: 'year',
        M: 'month',
        D: 'date',
        h: 'hours',
        m: 'minutes',
        s: 'seconds'
    }
    return format.replace(regexp, (str) => {
        if (~str.indexOf('[')) return str.slice(1, -1)
        const extra = str[0] === 'Y'
        const len = extra ?
            str.length > 4 ?
            4 :
            Math.ceil(str.length / 2) * 2 :
            str.length > 2 ?
            2 :
            str.length
        return pattern(date[maps[str[0]]], len, extra)
    })
}

/**
 * @desc 格式化时间
 * @param {Object} value 时间戳 或者时间格式 1786542452200/ Fri Mar 24 2017 15:28:42 GMT+0800 (CST)
 * @return {Object} {
    year: 年份,
    month: 月份,
    date: 日期,
    hours: 小时（24小时制）,
    minutes: 分钟,
    seconds: 秒
 }
 */
function parseDate(value) {
    const d = value ? new Date(value * 1) : new Date()
    const fix = (num) => {
        return ('0' + num).slice(-2)
    }
    return {
        year: d.getFullYear().toString(),
        month: fix(d.getMonth() + 1),
        date: fix(d.getDate()),
        hours: fix(d.getHours()),
        minutes: fix(d.getMinutes()),
        seconds: fix(d.getSeconds())
    }
}

/**
 * 获取下拉数据对应的别名
 *
 * @param {*} type 需要查询的value值
 * @param {*} options 下拉数据
 * @param {*} value 默认下拉的value值
 * @param {*} label 默认下拉的label值
 * @returns
 */
function getAlias(type, options, value = 'value', label = 'label') {
    let str = ''
    options.forEach(val => {
        if (val[value] === type) {
            str = val[label]
        }
    })
    return str
}

/**
 * 替换邮箱字符
 *
 * @param {*} email 邮箱
 * @returns
 */
function regEmail(email) {
    if (String(email).indexOf('@') > 0) {
        const str = email.split('@')
        let _s = ''
        if (str[0].length > 3) {
            for (var i = 0; i < str[0].length - 3; i++) {
                _s += '*'
            }
        }
        var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
    }
    return new_email
}

/**
 * 替换手机字符
 *
 * @param {*} mobile 手机
 * @returns
 */
function regMobile(mobile) {
    if (mobile.length > 7) {
        var new_mobile = mobile.substr(0, 3) + '****' + mobile.substr(7)
    }
    return new_mobile
}

/**
 * 下载文件
 *
 * @param {*} obj
 * @param {*} name
 * @param {*} suffix
 */
function downloadFile(obj, name, suffix) {
    const url = window.URL.createObjectURL(new Blob([obj]))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * 对象数组通过id字段去重
 *
 * @param {*} 对象数组 [{},{}]
 * @param {*} arr
 * @param {*} type
 * @returns
 */
function deteleObject(arr, type = 'id') {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i][type] === arr[j][type]) {
                arr.splice(j, 1)
                // 因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
                j--
            }
        }
    }
    return arr
}

/**
 * 字符串数组去重
 * @param {*} arr
 * @returns
 */
function removeDuplicatedItem(arr) {
    var ret = []
    for (var i = 0, j = arr.length; i < j; i++) {
        if (ret.indexOf(arr[i]) === -1) {
            ret.push(arr[i])
        }
    }
    return ret
}

/**
 * @param {string} type
 * @returns {Date}
 */
function getTime(type) {
    if (type === "start") {
        return new Date().getTime() - 3600 * 1000 * 24 * 90;
    } else {
        return new Date(new Date().toDateString());
    }
}

/**
 * Parse the time to string
 * @param {string} time
 * @returns {string}
 */
function getStrTime(time) {
    return `${time.slice(0, 4)}-${time.slice(4,6)}-${time.slice(6, 8)} ${time.slice(8,10)}:${time.slice(10,12)}:${time.slice(12)}`;
}

/**
 * 验证IP合理范围 js判断输入的IP是否合法，IP范围是否正确
 */
function ip_right(st, en) {
    var arr_s = st.split(".");
    var arr_e = en.split(".");
    if (
        st.length < 16 &&
        en.length < 16 &&
        arr_s.length == 4 &&
        arr_e.length == 4
    ) {
        //IP每个段要在0-255内
        for (var i = 0; i < 4; i++) {
            var a = Number(arr_s[i]);
            var b = Number(arr_e[i]);
            if (
                0 <= a &&
                a <= 255 &&
                0 <= b &&
                b <= 255 &&
                arr_s[i] != "" &&
                arr_e[i] != ""
            ) {} else {
                Notification({
                    title: "填写的IP段有误！",
                    type: "warning",
                });
                return false;
            }
        }
        //比对结束IP不能小于开始IP
        for (var i = 0; i < 4; i++) {
            if (arr_s[i] < arr_e[i]) {
                return true;
            } else if (arr_s[i] == arr_e[i]) {
                if (i == 3) {
                    return true;
                }
            } else {
                Notification({
                    title: "结束IP不能在开始IP之前！",
                    type: "warning",
                });
                return false;
            }
        }
        //填写IP的长度超过15||按“.”分段，不是4段，则IP有误
    } else {
        Notification({
            title: "填写的IP有误！",
            type: "warning",
        });
        return false;
    }
}

export default {
    getStrTime,
    parseTime, // 格式化日期
    formatDate, // 格式化日期（推荐）
    getAlias, // 获取下拉数据的别名
    regEmail, // 邮箱脱敏
    regMobile, // 手机号脱敏
    downloadFile, // 下载文件
    deteleObject, // 对象数组，通过指定字段去重
    removeDuplicatedItem, // 字符创数组去重
    ip_right, // js判断输入的IP是否合法，IP范围是否正确
}