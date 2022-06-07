/*
 * @Author: Songjq
 * @Date: 2022-01-26 09:14:34
 * @Desscription: 获取设备信息
 */
let data = {};

//获取mac地址
const getMAC = require("getmac");
const MACAddr = getMAC.default();

//获取ip地址
const os = require("os");

function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (
                alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal
            ) {
                return alias.address;
            }
        }
    }
}
const ipaddr = getIPAdress();

// CPU/内核的信息
const cpus = os.cpus();

// 默认临时文件夹：
const tmpdir = os.tmpdir();

// CPU 的字节序
const endianness = os.endianness();

// 操作系统主机名
const hostname = os.hostname();

// 操作系统名
const type = os.type();

// 返回操作系统名
const platform = os.platform();

// 系统 CPU 架构
const arch = os.arch();

// 操作系统的发行版本
const release = os.release();

// 操作系统运行的时间，以秒为单位
const uptime = os.uptime();

// 一个包含 1、5、15 分钟平均负载的数组
const loadavg = os.loadavg();

// 系统内存总量，单位为字节
const totalmem = os.totalmem();

// 操作系统空闲内存量，单位是字节
const freemem = os.freemem();

// 网络接口列表
const networkInterfaces = os.networkInterfaces();

// Log.instance.info("默认临时文件夹："+os.tmpdir());
// Log.instance.info("CPU 的字节序："+os.endianness());
// Log.instance.info("操作系统的主机名："+os.hostname());
// Log.instance.info("操作系统名："+os.type());
// Log.instance.info("返回操作系统名："+os.platform());
// Log.instance.info("系统 CPU 架构："+os.arch());
// Log.instance.info("操作系统的发行版本："+os.release());
// Log.instance.info("操作系统运行的时间，以秒为单位："+os.uptime());
// Log.instance.info("一个包含 1、5、15 分钟平均负载的数组："+os.loadavg());
// Log.instance.info("系统内存总量，单位为字节："+os.totalmem());
// Log.instance.info("操作系统空闲内存量，单位是字节："+os.freemem());
// Log.instance.info("CPU/内核的信息：");
// Log.instance.info(os.cpus());
// Log.instance.info("网络接口列表：");
// Log.instance.info(os.networkInterfaces());

data = {
    MACAddr,
    ipaddr,
    cpus,
    tmpdir,
    endianness,
    hostname,
    type,
    platform,
    arch,
    release,
    uptime,
    loadavg,
    totalmem,
    freemem,
    networkInterfaces,
};

module.exports = data;