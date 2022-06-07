/*
 * @Author: Songjq
 * @Date: 2021-08-04 17:11:14
 * @Desscription:
 */
import router from "./routers";
import store from "@/store";
import Config from "@/settings";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // getToken from cookie
import { getMenusBuild } from "@http/system/menu";
import { filterAsyncRouter } from "@/store/modules/permission";
NProgress.configure({ showSpinner: false }); // NProgress Configuration
const whiteList = ["/login", "/ssoLogin", "/register", "/forgetPassword", "/loginAuth"]; // 路由白名单

router.beforeEach((to, from, next) => {
    if (
        to.path.indexOf("%26") !== -1 ||
        to.path.indexOf("%3D") !== -1 ||
        to.path.indexOf("%3F") !== -1
    ) {
        const reg1 = new RegExp("%26", "g");
        const reg2 = new RegExp("%3D", "g");
        const reg3 = new RegExp("%3F", "g");
        const newPath = JSON.stringify(to)
            .replace(reg1, "&")
            .replace(reg2, "=")
            .replace(reg3, "?");
        next(JSON.parse(newPath));
    } else {
        if (to.meta.title) {
            document.title = to.meta.title + " - " + Config.title;
        }
        NProgress.start();
        if (getToken()) {
            // 已登录且要跳转的页面是登录页
            if (to.path === "/login") {
                next({ path: "/" });
                NProgress.done();
            } else {
                if (store.getters.roles && store.getters.roles.length === 0) {
                    // 判断当前用户是否已拉取完user_info信息
                    store
                        .dispatch("GetInfo")
                        .then(res => {
                            // 拉取user_info
                            // 动态路由，拉取菜单
                            loadMenus(next, to);
                        })
                        .catch(err => {
                            console.log(err);
                            // const redirect = encodeURIComponent(to.fullPath);
                            // next(`/ssoLogin?redirect=${redirect}`); // 重定向到SSO登录
                        });
                    // 登录时未拉取 菜单，在此处拉取
                    NProgress.done();
                } else if (store.getters.loadMenus) {
                    // 修改成false，防止死循环
                    store.dispatch("updateLoadMenus").then(res => {});
                    loadMenus(next, to);
                } else {
                    next();
                }
            }
        } else {
            if (whiteList.indexOf(to.path) !== -1) {
                // 在免登录白名单，直接进入
                next();
            } else {
                next(`/login`); // 否则全部重定向到登录页
                NProgress.done();
            }
        }
    }
});

export const loadMenus = (next, to) => {
    // 如果是二次认证界面，不调接口
    if (to.path == "/loginAuth") {
        next()
        return
    }
    getMenusBuild().then(res => {
        const asyncRouter = filterAsyncRouter(res.data);
        asyncRouter.push({ path: "*", redirect: "/404", hidden: true });
        store.dispatch("GenerateRoutes", asyncRouter).then(() => {
            router.addRoutes(asyncRouter); // 动态添加可访问路由表
            next({ ...to, replace: true });
        });
    });
};

router.afterEach(() => {
    NProgress.done(); // finish progress bar
});