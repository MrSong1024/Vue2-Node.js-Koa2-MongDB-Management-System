/*
 * @Author: Songjq
 * @Date: 2021-08-13 16:38:30
 * @Desscription:
 */
import Fingerprint2 from "fingerprintjs2"; // 引入fingerprintjs2
import { getWsLocation } from "@http/login/login.js";
import { encrypt } from "@/utils/rsaEncrypt";
import * as sysTool from "@/utils/systemTool"; //  获取浏览器信息
export default {
    data() {
        return {
            ad_info: {
                nation: "",
                province: "",
                city: "",
                district: "",
                adcode: "",
            },
            uuid: "",
            // 浏览器唯一标识
            browserId: "",
        };
    },
    created() {
        // 获取当前访问者的地理位置
        this.getLocation();

        // 您不应在页面加载时或加载后直接运行指纹。 而是使用setTimeout或requestIdleCallback将其延迟几毫秒，以确保指纹一致。
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                this.createFingerprint();
            });
        } else {
            setTimeout(() => {
                this.createFingerprint();
            }, 500);
        }
    },
    methods: {
        // 创建浏览器指纹
        createFingerprint() {
            // 浏览器可选配置信息如下
            // var components = [
            //     { key: 'userAgent', getData: UserAgent }, //用户代理
            //     { key: 'webdriver', getData: webdriver }, //网页内驱动软件
            //     { key: 'language', getData: languageKey }, //语言种类
            //     { key: 'colorDepth', getData: colorDepthKey }, //目标设备或缓冲器上的调色板的比特深度
            //     { key: 'deviceMemory', getData: deviceMemoryKey }, //设备内存
            //     { key: 'pixelRatio', getData: pixelRatioKey }, //设备像素比
            //     { key: 'hardwareConcurrency', getData: hardwareConcurrencyKey }, //可用于运行在用户的计算机上的线程的逻辑处理器的数量。
            //     { key: 'screenResolution', getData: screenResolutionKey }, //当前屏幕分辨率
            //     { key: 'availableScreenResolution', getData: availableScreenResolutionKey }, //屏幕宽高（空白空间）
            //     { key: 'timezoneOffset', getData: timezoneOffset }, //本地时间与 GMT 时间之间的时间差，以分钟为单位
            //     { key: 'timezone', getData: timezone }, //时区
            //     { key: 'sessionStorage', getData: sessionStorageKey }, //是否会话存储
            //     { key: 'localStorage', getData: localStorageKey }, //是否具有本地存储   
            //     { key: 'indexedDb', getData: indexedDbKey }, //是否具有索引DB
            //     { key: 'addBehavior', getData: addBehaviorKey }, //IE是否指定AddBehavior
            //     { key: 'openDatabase', getData: openDatabaseKey }, //是否有打开的DB
            //     { key: 'cpuClass', getData: cpuClassKey }, //浏览器系统的CPU等级
            //     { key: 'platform', getData: platformKey }, //运行浏览器的操作系统和(或)硬件平台
            //     { key: 'doNotTrack', getData: doNotTrackKey }, //do-not-track设置
            //     { key: 'plugins', getData: pluginsComponent }, //浏览器的插件信息
            //     { key: 'canvas', getData: canvasKey }, //使用 Canvas 绘图
            //     { key: 'webgl', getData: webglKey }, //WebGL指纹信息
            //     { key: 'webglVendorAndRenderer', getData: webglVendorAndRendererKey }, //具有大量熵的WebGL指纹的子集
            //     { key: 'adBlock', getData: adBlockKey }, //是否安装AdBlock
            //     { key: 'hasLiedLanguages', getData: hasLiedLanguagesKey }, //用户是否篡改了语言
            //     { key: 'hasLiedResolution', getData: hasLiedResolutionKey }, //用户是否篡改了屏幕分辨率
            //     { key: 'hasLiedOs', getData: hasLiedOsKey }, //用户是否篡改了操作系统
            //     { key: 'hasLiedBrowser', getData: hasLiedBrowserKey }, //用户是否篡改了浏览器
            //     { key: 'touchSupport', getData: touchSupportKey }, //触摸屏检测和能力
            //     { key: 'fonts', getData: jsFontsKey, pauseBefore: true }, //使用JS/CSS检测到的字体列表
            //     { key: 'fontsFlash', getData: flashFontsKey, pauseBefore: true }, //已安装的Flash字体列表
            //     { key: 'audio', getData: audioKey }, //音频处理
            //     { key: 'enumerateDevices', getData: enumerateDevicesKey } //可用的多媒体输入和输出设备的信息。
            // ];

            // 选择哪些信息作为浏览器指纹生成的依据
            const options = {
                fonts: {
                    extendedJsFonts: true,
                },
                excludes: {
                    audio: true,
                    enumerateDevices: true,
                    touchSupport: true,
                    platform: true,
                    cpuClass: true,
                    deviceMemory: true,
                },
            };

            // 浏览器指纹
            const fingerprint = Fingerprint2.get((components) => {
                // 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
                const values = components.map((component) => component.value); // 配置的值的数组
                const murmur = Fingerprint2.x64hash128(values.join(""), 31); // 生成浏览器指纹
                // console.log(components);
                // console.log(values);
                console.log(murmur);
                this.browserId = murmur;
                this.getCode();
            });
        },

        /**
         * @Author: Songjq
         * @Date: 2021-12-16 21:37:53
         * @Fn: 获取验证码
         */
        getCode() {
            this.codeUrl = `${
          process.env.VUE_APP_BASE_API
        }api/code?${Math.random()}&&browserId=${this.browserId}`;
        },

        /**
         * @Author: Songjq
         * @Date: 2022-01-23 16:16:02
         * @Fn: 获取当前访问者的地理位置
         */
        getLocation() {
            getWsLocation({
                    ip: returnCitySN["cip"],
                    key: "UO3BZ-IIVCD-EQJ4A-PPTHU-LBT6T-ADF5H",
                })
                .then((res) => {
                    if (res.result) {
                        this.ad_info = res.result.ad_info;

                        this.uuid = encrypt(
                            JSON.stringify({
                                ipaddr: returnCitySN["cip"],
                                location: `${this.ad_info.nation},${this.ad_info.province},${this.ad_info.city}`,
                                browser: sysTool.GetCurrentBrowser(),
                            })
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    }
};