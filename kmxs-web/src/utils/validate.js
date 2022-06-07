/**
 * @Author: Songjq
 * @Date: 2021-12-20 16:22:37
 * @Fn: 表单校验规则
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
    const valid_map = ["admin", "editor"];
    return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
    const reg = /^[A-Za-z0-9-]+$/;
    return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
    if (typeof str === "string" || str instanceof String) {
        return true;
    }
    return false;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
    if (typeof Array.isArray === "undefined") {
        return Object.prototype.toString.call(arg) === "[object Array]";
    }
    return Array.isArray(arg);
}

/**
 * 是否合法IP地址
 * @param rule
 * @param value
 * @param callback
 */
export function validateIP(rule, value, callback) {
    if (value === "" || value === undefined || value == null) {
        callback();
    } else {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!reg.test(value) && value !== "") {
            callback(new Error("请输入正确的IP地址"));
        } else {
            callback();
        }
    }
}

/* 是否手机号码或者固话*/
export function validatePhoneTwo(rule, value, callback) {
    const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
    if (value === "" || value === undefined || value == null) {
        callback();
    } else {
        if (!reg.test(value) && value !== "") {
            callback(new Error("请输入正确的电话号码或者固话号码"));
        } else {
            callback();
        }
    }
}

/* 是否固话*/
export function validateTelephone(rule, value, callback) {
    const reg = /0\d{2}-\d{7,8}/;
    if (value === "" || value === undefined || value == null) {
        callback();
    } else {
        if (!reg.test(value) && value !== "") {
            callback(new Error("请输入正确的固话（格式：区号+号码,如010-1234567）"));
        } else {
            callback();
        }
    }
}

/* 是否手机号码*/
export function validatePhone(rule, value, callback) {
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (value === "" || value === undefined || value == null) {
        callback(new Error("请输入手机号码"));
    } else {
        if (!reg.test(value) && value !== "") {
            callback(new Error("请输入正确的手机号码"));
        } else {
            callback();
        }
    }
}

/* 是否身份证号码*/
export function validateIdNo(rule, value, callback) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!value) {
        callback(new Error("请输入身份证号码"));
    } else {
        if (!reg.test(value) && value !== "") {
            callback(new Error("请输入正确的身份证号码"));
        } else {
            callback();
        }
    }
}

/* 是否身份证号 */
export function validEmail(rule, value, callback) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!value) {
        callback(new Error("请输入邮件地址"));
    } else {
        if (!reg.test(value) && value !== "") {
            callback(new Error("请输入正确的邮件地址"));
        } else {
            callback();
        }
    }
}

export function isValidPhone(phone) {
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    return reg.test(phone);
}

export function isValidMail(mail) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(mail);
}

export function isValidIdNo(idNo) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(idNo);
}

// 名称规则（不含特殊字符）
export function isValidName(name) {
    const reg = /^[\u0391-\uFFE5a-zA-Z0-9_-]+$/;
    return reg.test(name);
}

// 纯数字
export function isValidNumber(num) {
    const reg = /^[0-9]+$/;
    return reg.test(num);
}


// 全局校验

// 字段名称(大小写字母)
export function validFieldName(rule, value, callback) {
    if (!validAlphabets(value)) {
        callback(new Error("仅限数字、横线、大小写字母"));
    } else if (value.length > 100) {
        callback(new Error("最大长度100个字母"));
    } else {
        callback();
    }
}

// 名称规则（不含特殊字符）
export function validName(rule, value, callback) {
    // if (!isValidName(value)) {
    //   callback(new Error("仅限中英文、数字、下划线"));
    // } else
    if (value.length > 100) {
        callback(new Error("最大长度100个字符"));
    } else {
        callback();
    }
}

// 属性长度(纯数字)
export function validNumber(rule, value, callback) {
    if (!isValidNumber(value)) {
        callback(new Error("仅限数字"));
    } else if (value.length > 3) {
        callback(new Error("最大长度3个数字"));
    } else {
        callback();
    }
}

// 排序(纯数字)
export function validOrderNum(rule, value, callback) {
    if (!isValidNumber(value)) {
        callback(new Error("仅限数字"));
    } else {
        callback();
    }
}

// 描述(最大长度)
export function validDesc(rule, value, callback) {
    if (value.length > 255) {
        callback(new Error("最大长度255个字符"));
    } else {
        callback();
    }
}