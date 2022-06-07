/*
 * @Author: Songjq
 * @Date: 2021-08-04 17:11:14
 * @Desscription:
 */
import { constantRouterMap } from "@/router/routers.js";
import Layout from "@/layout/index";
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      // 默认展开第一个菜单 start
      const childrenLists = [];
      routers.forEach(val => {
        if (val.children && val.children.length > 0) {
          const str = `${val.path}/${val.children[0].path}`;
          childrenLists.push(str);
        }
      });

      if (childrenLists.length > 0) {
        routers.push({
          path: "/",
          component: Layout,
          hidden: true,
          redirect: childrenLists[0]
        });
      }

      // end
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit("SET_ROUTERS", asyncRouter);
    }
  }
};

export const filterAsyncRouter = routers => {
  // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(router => {
    if (router.component) {
      if (router.component === "Layout") {
        // Layout组件特殊处理
        router.component = Layout;
      } else {
        const component = router.component;
        router.component = loadView(component);
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children);
    }
    return true;
  });
};

export const loadView = view => {
  // return () => import(`@/views/${view}`);
  return resolve => require([`@/views/${view}`], resolve);
};
// console.log("permission", permission);
export default permission;
