/*
 * @Author: Songjq
 * @Date: 2021-08-11 11:17:31
 * @Desscription:
 */
import Vue from "vue";

import Cookies from "js-cookie";
Vue.prototype.cookies = Cookies; // 全局cookies
import "normalize.css/normalize.css";

import Element from "element-ui";
// 
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";

// 数据字典
import dict from "./components/Dict";

// 权限指令
import permission from "./components/Permission";
import "./assets/styles/element-variables.scss";

// global css
import "./assets/styles/index.scss";

import thottles from "@/utils/thottles";
Vue.prototype.thottles = new thottles(); // 节流函数

// 代码高亮
import VueHighlightJS from "vue-highlightjs";
import "highlight.js/styles/atom-one-dark.css";

import App from "./App";
import store from "./store";
import router from "./router/routers";

import "./assets/icons"; // icon
import "./router/index"; // permission control

// 增加全局水印
import watermark from "./utils/watermark.js";
Vue.prototype.$watermark = watermark;

// Kmxs公共组件引入
import kmxs from '@/components/KmxsCommon/index.js'
Vue.use(kmxs)

// 定义全局可用方法
import utils from '@/utils/utils.js'
Vue.prototype.$utils = utils

// // matomo
// import VueMatomo from "vue-matomo";
// // 运行环境
// const nodeEnv = process.env.NODE_ENV;
// let matomoHost = "";
// let matomoSiteId = "";
// if (nodeEnv === "production") {
//     matomoHost = "//statistics.cifi.com.cn/matomo";
//     matomoSiteId = 70;
// } else if (nodeEnv === "development") {
//     matomoHost = "//statistics-dev.cifi.com.cn/matomo";
//     matomoSiteId = 70;
// }
// Vue.use(VueMatomo, {
//     host: matomoHost,
//     siteId: matomoSiteId,
//     trackerFileName: "piwik",
//     router: router,
//     enableLinkTracking: false,
//     requireConsent: false,
//     trackInitialView: false,
//     debug: true
// });

// table滚动加载
import elTableInfiniteScroll from "el-table-infinite-scroll";
Vue.use(elTableInfiniteScroll);
Vue.use(VueHighlightJS);
Vue.use(mavonEditor);
Vue.use(permission);
Vue.use(dict);
Vue.use(Element, {
    size: Cookies.get("size") || "small" // set element-ui default size
});
Vue.config.productionTip = false;

new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
});