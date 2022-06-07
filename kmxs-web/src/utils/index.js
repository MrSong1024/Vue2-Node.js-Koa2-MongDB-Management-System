/**
 * @Author: Songjq
 * @Date: 2021-12-20 16:28:38
 * @Fn: 常用函数方法
 */
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    // const format = cFormat || "{y}-{m}-{d}";
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "undefined" || time === null || time === "null") {
        return "";
    } else if (typeof time === "object") {
        date = time;
    } else {
        if (typeof time === "string" && /^[0-9]+$/.test(time)) {
            time = parseInt(time);
        }
        if (typeof time === "number" && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        if (result.length > 0 && value < 10) {
            value = "0" + value;
        }
        return value || 0;
    });
    return time_str;
}

/**
 * Parse the time to string
 * @param {string} time
 * @returns {string}
 */
export function getStrTime(time) {
    return `${time.slice(0, 4)}-${time.slice(4,6)}-${time.slice(6, 8)} ${time.slice(8,10)}:${time.slice(10,12)}:${time.slice(12)}`;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
    if (("" + time).length === 10) {
        time = parseInt(time) * 1000;
    } else {
        time = +time;
    }
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return "刚刚";
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 2) {
        return "1天前";
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            "月" +
            d.getDate() +
            "日" +
            d.getHours() +
            "时" +
            d.getMinutes() +
            "分"
        );
    }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf("?") + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
    // returns the byte length of an utf8 string
    let s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xdc00 && code <= 0xdfff) i--;
    }
    return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
    if (!json) return "";
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return "";
            return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
        })
    ).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = url.split("?")[1];
    if (!search) {
        return {};
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, " ") +
        '"}'
    );
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
    const div = document.createElement("div");
    div.innerHTML = val;
    return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
    if (typeof target !== "object") {
        target = {};
    }
    if (Array.isArray(source)) {
        return source.slice();
    }
    Object.keys(source).forEach(property => {
        const sourceProperty = source[property];
        if (typeof sourceProperty === "object") {
            target[property] = objectMerge(target[property], sourceProperty);
        } else {
            target[property] = sourceProperty;
        }
    });
    return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
    if (!element || !className) {
        return;
    }
    let classString = element.className;
    const nameIndex = classString.indexOf(className);
    if (nameIndex === -1) {
        classString += "" + className;
    } else {
        classString =
            classString.substr(0, nameIndex) +
            classString.substr(nameIndex + className.length);
    }
    element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
    if (type === "start") {
        return new Date().getTime() - 3600 * 1000 * 24 * 90;
    } else {
        return new Date(new Date().toDateString());
    }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function(...args) {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
    if (!source && typeof source !== "object") {
        throw new Error("error arguments", "deepClone");
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === "object") {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
    return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
    const timestamp = +new Date() + "";
    const randomNum = parseInt((1 + Math.random()) * 65536) + "";
    return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        ele.className = ele.className.replace(reg, " ");
    }
}

// 替换邮箱字符
export function regEmail(email) {
    if (String(email).indexOf("@") > 0) {
        const str = email.split("@");
        let _s = "";
        if (str[0].length > 3) {
            for (var i = 0; i < str[0].length - 3; i++) {
                _s += "*";
            }
        }
        var new_email = str[0].substr(0, 3) + _s + "@" + str[1];
    }
    return new_email;
}

// 替换手机字符
export function regMobile(mobile) {
    if (mobile.length > 7) {
        var new_mobile = mobile.substr(0, 3) + "****" + mobile.substr(7);
    }
    return new_mobile;
}

// 下载文件
export function downloadFile(res, name, suffix) {
    // const url = window.URL.createObjectURL(new Blob([obj]));
    // const link = document.createElement("a");
    // link.style.display = "none";
    // link.href = url;
    // const fileName = parseTime(new Date()) + "-" + name + "." + suffix;
    // link.setAttribute("download", fileName);
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    let uploadExcel = (fileName) => {
        const blob = new Blob([res], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const aLink = document.createElement("a");
        aLink.setAttribute("download", fileName);
        aLink.setAttribute("href", url);
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
        URL.revokeObjectURL(blob);
    };
    uploadExcel(`${name}.${suffix}`);
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
export function parseDate(value) {
    const d = value ? new Date(value * 1) : new Date();
    const fix = num => {
        return ("0" + num).slice(-2);
    };
    return {
        year: d.getFullYear().toString(),
        month: fix(d.getMonth() + 1),
        date: fix(d.getDate()),
        hours: fix(d.getHours()),
        minutes: fix(d.getMinutes()),
        seconds: fix(d.getSeconds())
    };
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

export function formatDate(value, format = "YYYY-MM-DD hh:mm:ss") {
    const regexp = /(\[[^[]*\])|Y{2,}|M+|D+|h+|m+|s+/g;

    const pattern = (value, len, extra) => {
        return extra ?
            value.substr(len * -1) :
            len === value.length ?
            value :
            value * 1;
    };

    let date = parseDate(value);

    const maps = {
        Y: "year",
        M: "month",
        D: "date",
        h: "hours",
        m: "minutes",
        s: "seconds"
    };

    return format.replace(regexp, str => {
        if (~str.indexOf("[")) return str.slice(1, -1);
        const extra = str[0] === "Y";
        const len = extra ?
            str.length > 4 ?
            4 :
            Math.ceil(str.length / 2) * 2 :
            str.length > 2 ?
            2 :
            str.length;
        return pattern(date[maps[str[0]]], len, extra);
    });
}

// 数组对象 id 字段去重
export function deteleObject(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i].id == arr[j].id) {
                arr.splice(j, 1);
                //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
                j--;
            }
        }
    }
    return arr;
}