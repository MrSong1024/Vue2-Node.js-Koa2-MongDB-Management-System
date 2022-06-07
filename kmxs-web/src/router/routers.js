/*
 * @Author: Songjq
 * @Date: 2021-12-05 22:20:10
 * @Desscription:
 */
import Vue from "vue";
import Router from "vue-router";
import Layout from "../layout/index";
Vue.use(Router);
export const constantRouterMap = [{
        path: "/login",
        meta: { title: "登录", noCache: true },
        component: () => import("@/views/login"),
        hidden: true
    },
    {
        path: "/register",
        meta: { title: "注册", noCache: true },
        component: () => import("@/views/register"),
        hidden: true
    },
    {
        path: "/forgetPassword",
        meta: { title: "忘记密码", noCache: true },
        component: () => import("@/views/forgetPassword"),
        hidden: true
    },
    {
        path: "/ssoLogin",
        meta: { title: "SSO登录", noCache: true },
        component: () => import("@/views/ssoLogin"),
        hidden: true
    },
    {
        path: "/404",
        component: () => import("@/views/features/404"),
        hidden: true
    },
    {
        path: "/401",
        component: () => import("@/views/features/401"),
        hidden: true
    },
    // {
    //     name: "访问中心",
    //     path: "/home",
    //     hidden: false,
    //     redirect: "home/index",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: {
    //         title: "访问中心",
    //         icon: "dashboard",
    //         noCache: true
    //     },
    //     children: [{
    //         name: "首页",
    //         path: "index",
    //         hidden: false,
    //         component: () => import("@/views/home/index"),
    //         meta: {
    //             title: "首页",
    //             icon: null,
    //             noCache: true
    //         }
    //     }, {
    //         name: "概览",
    //         path: "overview",
    //         hidden: false,
    //         component: () => import("@/views/home/overview"),
    //         meta: {
    //             title: "概览",
    //             icon: null,
    //             noCache: true
    //         }
    //     }, {
    //         name: "个人中心",
    //         path: "profile",
    //         hidden: false,
    //         component: () => import("@/views/home/profile"),
    //         meta: {
    //             title: "个人中心",
    //             icon: null,
    //             noCache: true
    //         }
    //     }]
    // },
    // {
    //     name: "财务管理",
    //     path: "/finance",
    //     hidden: false,
    //     redirect: "finance/order",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: {
    //         title: "财务管理",
    //         icon: "app",
    //         noCache: true
    //     },
    //     children: [{
    //         name: "充值订单",
    //         path: "order",
    //         hidden: false,
    //         component: () => import("@/views/finance/order"),
    //         meta: {
    //             title: "充值订单",
    //             icon: null,
    //             noCache: true
    //         }
    //     }]
    // },
    // {
    //     name: "短信管理",
    //     path: "/smsMgr",
    //     hidden: false,
    //     redirect: "smsMgr/sendMessage",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: {
    //         title: "短信管理",
    //         icon: "app",
    //         noCache: true
    //     },
    //     children: [{
    //         name: "发送短信",
    //         path: "sendMessage",
    //         hidden: false,
    //         component: () => import("@/views/smsMgr/sendMessage"),
    //         meta: {
    //             title: "发送短信",
    //             icon: null,
    //             noCache: true
    //         }
    //     }, {
    //         name: "表格提交",
    //         path: "submitByTable",
    //         hidden: false,
    //         component: () => import("@/views/smsMgr/submitByTable"),
    //         meta: {
    //             title: "表格提交",
    //             icon: null,
    //             noCache: true
    //         }
    //     }, {
    //         name: "短信模板",
    //         path: "templateMessage",
    //         hidden: false,
    //         component: () => import("@/views/smsMgr/templateMessage"),
    //         meta: {
    //             title: "短信模板",
    //             icon: null,
    //             noCache: true
    //         }
    //     }, {
    //         name: "发送记录",
    //         path: "sendRecord",
    //         hidden: false,
    //         component: () => import("@/views/smsMgr/sendRecord"),
    //         meta: {
    //             title: "发送记录",
    //             icon: null,
    //             noCache: true
    //         }
    //     }, {
    //         name: "发送回执",
    //         path: "returnRecord",
    //         hidden: false,
    //         component: () => import("@/views/smsMgr/returnRecord"),
    //         meta: {
    //             title: "发送回执",
    //             icon: null,
    //             noCache: true
    //         }
    //     }, {
    //         name: "定时短信",
    //         path: "scheduledMessage",
    //         hidden: false,
    //         component: () => import("@/views/smsMgr/scheduledMessage"),
    //         meta: {
    //             title: "定时短信",
    //             icon: null,
    //             noCache: true
    //         }
    //     }, ]
    // },
    // {
    //   name: "组件管理",
    //   path: "/components",
    //   hidden: false,
    //   redirect: "components/echarts",
    //   component: Layout,
    //   alwaysShow: true,
    //   meta: {
    //     title: "组件管理",
    //     icon: "app",
    //     noCache: true
    //   },
    //   children: [
    //     {
    //       name: "图表库",
    //       path: "echarts",
    //       hidden: false,
    //       component: () => import("@/views/components/Echarts"),
    //       meta: {
    //         title: "图表库",
    //         icon: null,
    //         noCache: true
    //       }
    //     },
    //     {
    //       name: "图标库",
    //       path: "icon",
    //       hidden: false,
    //       component: () => import("@/views/components/icons/index"),
    //       meta: {
    //         title: "图标库",
    //         icon: null,
    //         noCache: true
    //       }
    //     },
    //     {
    //       name: "富文本",
    //       path: "tinymce",
    //       hidden: false,
    //       component: () => import("@/views/components/Editor"),
    //       meta: {
    //         title: "富文本",
    //         icon: null,
    //         noCache: true
    //       }
    //     },
    //     {
    //       name: "Markdown",
    //       path: "markdown",
    //       hidden: false,
    //       component: () => import("@/views/components/MarkDown"),
    //       meta: {
    //         title: "Markdown",
    //         icon: null,
    //         noCache: true
    //       }
    //     },
    //     {
    //       name: "Yaml编辑器",
    //       path: "yaml",
    //       hidden: false,
    //       component: () => import("@/views/components/YamlEdit"),
    //       meta: {
    //         title: "Yaml编辑器",
    //         icon: null,
    //         noCache: true
    //       }
    //     }
    //   ]
    // }
    // {
    //   name: "信息管理",
    //   path: "/information",
    //   hidden: false,
    //   redirect: "information/notice",
    //   component: Layout,
    //   alwaysShow: true,
    //   meta: {
    //     title: "信息管理",
    //     icon: "app",
    //     noCache: true
    //   },
    //   children: [
    //     {
    //       name: "通知公告",
    //       path: "notice",
    //       hidden: false,
    //       component: () => import("@/views/information/notice"),
    //       meta: {
    //         title: "通知公告",
    //         icon: null,
    //         noCache: true
    //       }
    //     },
    //     {
    //       name: "消息审批",
    //       path: "approve",
    //       hidden: false,
    //       component: () => import("@/views/information/approve"),
    //       meta: {
    //         title: "消息审批",
    //         icon: null,
    //         noCache: true
    //       }
    //     }
    //   ]
    // }
    // {
    //   name: "域名管理",
    //   path: "/domain",
    //   hidden: false,
    //   redirect: "domain/dns",
    //   component: Layout,
    //   alwaysShow: true,
    //   meta: {
    //      title: "域名管理",
    //      icon: "app",
    //      noCache: true
    //   },
    //   children: [
    //     {
    //       name: "长链接绑定",
    //       path: "dns",
    //       hidden: false,
    //       component: () => import("@/views/domain/dns"),
    //       meta: {
    //         title: "长链接绑定",
    //         icon: null,
    //         noCache: true
    //       }
    //     }
    //   ]
    // },
    // {
    //     name: "系统设置",
    //     path: "/system",
    //     hidden: false,
    //     redirect: "system/users",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: {
    //         title: "系统设置",
    //         icon: "app",
    //         noCache: true
    //     },
    //     children: [{
    //             name: "用户管理",
    //             path: "users",
    //             hidden: false,
    //             component: () => import("@/views/system/users"),
    //             meta: {
    //                 title: "用户管理",
    //                 icon: null,
    //                 noCache: true
    //             }
    //         },
    //         {
    //             name: "字典管理",
    //             path: "dicts",
    //             hidden: false,
    //             component: () => import("@/views/system/dicts"),
    //             meta: {
    //                 title: "字典管理",
    //                 icon: null,
    //                 noCache: true
    //             }
    //         },
    //         {
    //             name: "角色管理",
    //             path: "roles",
    //             hidden: false,
    //             component: () => import("@/views/system/roles"),
    //             meta: {
    //                 title: "角色管理",
    //                 icon: null,
    //                 noCache: true
    //             }
    //         },
    //         {
    //             name: "菜单管理",
    //             path: "menus",
    //             hidden: false,
    //             component: () => import("@/views/system/menus"),
    //             meta: {
    //                 title: "菜单管理",
    //                 icon: null,
    //                 noCache: true
    //             }
    //         }
    //     ]
    // },
    // {
    //   name: "日志管理",
    //   path: "/log",
    //   hidden: false,
    //   redirect: "log/operlog",
    //   component: Layout,
    //   alwaysShow: true,
    //   meta: {
    //     title: "日志管理",
    //     icon: "app",
    //     noCache: true
    //   },
    //   children: [
    //     {
    //       name: "operlog",
    //       path: "operlog",
    //       hidden: false,
    //       component: () => import("@/views/log/operlog"),
    //       meta: {
    //         title: "操作日志",
    //         icon: null,
    //         noCache: true
    //       }
    //     },
    //     {
    //       name: "loginlog",
    //       path: "loginlog",
    //       hidden: false,
    //       component: () => import("@/views/log/loginlog"),
    //       meta: {
    //         title: "登录日志",
    //         icon: null,
    //         noCache: true
    //       }
    //     }
    //   ]
    // }
];

export default new Router({
    base: "/",
    mode: "hash",
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
});