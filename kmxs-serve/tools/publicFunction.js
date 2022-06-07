/*
 * @Author: Songjq
 * @Date: 2022-04-06 22:30:57
 * @Desscription: 公共请求方法
 */
var request = require('request');

/**
 * 获取手机号运营商详情
 * 
 * @param {String} ip IP
 * @param {Function} callback 回调函数
 */
function getLocationInfo(ip, callback) {

    //1. 准备请求url
    var url = `http://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=UO3BZ-IIVCD-EQJ4A-PPTHU-LBT6T-ADF5H`;

    //2. 准备请求头
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'Content-Length': '',
        'Authorization': ""
    }

    //3. 发送请求, 并得到返回的结果, 调用callback
    request({
        method: 'GET',
        url: url,
        headers: headers,
        body: {},
        json: true
    }, (error, response, res) => {
        callback(res);
    });
}
exports.getLocationInfo = getLocationInfo;

/**
 * 数据去重
 * 
 * @param {Array} arr 去重总数据
 * @param {String} type 去重依据字段
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
exports.deteleObject = deteleObject;