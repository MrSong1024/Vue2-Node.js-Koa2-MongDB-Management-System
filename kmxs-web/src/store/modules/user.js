import {
    login,
    loginByEmail,
    loginByPhone,
    getUserCurrent,
    ssoLogin,
    logout,
    getSSOAuthorizeUrl,
    ssoLogout,
    getSource
} from "@http/login/login.js";
import { getToken, setToken, removeToken } from "@/utils/auth";
const user = {
    state: {
        token: getToken(),
        avatar: null,
        user: {},
        roles: [],
        // 第一次加载菜单时用到
        loadMenus: false
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_USER: (state, user) => {
            state.user = user;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_LOAD_MENUS: (state, loadMenus) => {
            state.loadMenus = loadMenus;
        }
    },

    actions: {
        // 账号登录
        Login({ commit }, userInfo) {
            // const rememberMe = userInfo.rememberMe;
            return new Promise((resolve, reject) => {
                login(userInfo)
                    .then(res => {
                        if (res.code == 200) {
                            setToken(res.token, true);
                            commit("SET_TOKEN", res.token);
                            setUserInfo(res.user, commit);
                            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
                            commit("SET_LOAD_MENUS", true);
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 通过邮箱登录
        LoginByEmail({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                loginByEmail(userInfo)
                    .then(res => {
                        if (res.code == 200) {
                            setToken(res.token, true);
                            commit("SET_TOKEN", res.token);
                            setUserInfo(res.user, commit);
                            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
                            commit("SET_LOAD_MENUS", true);
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 通过手机号登录
        LoginByPhone({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                loginByPhone(userInfo)
                    .then(res => {
                        if (res.code == 200) {
                            setToken(res.token, true);
                            commit("SET_TOKEN", res.token);
                            setUserInfo(res.user, commit);
                            commit("SET_LOAD_MENUS", true);
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },



        // 获取用户信息
        GetInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getUserCurrent()
                    .then(res => {
                        if (res.code == 200) {
                            setUserInfo(res.user, commit);
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // SSO登录
        SSOLogin({ commit }, code) {
            return new Promise((resolve, reject) => {
                ssoLogin(code)
                    .then(res => {
                        setToken(res.token, false);
                        commit("SET_TOKEN", res.token);
                        setUserInfo(res.user, commit);
                        // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
                        commit("SET_LOAD_MENUS", true);
                        // 登录还需要获取用户所属板块
                        getSource().then(res => {
                            localStorage.setItem("source", JSON.stringify(res));
                            commit("SET_SOURCE", JSON.stringify(res));
                            resolve(res);
                        });
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // SSO Authorize
        SSOAuthorize({ commit }, redirect) {
            // 保存SSO跳转前的访问地址
            sessionStorage.setItem("ssoPostRedirect", redirect);
            // 获取SSO Authorize地址并跳转
            return new Promise((resolve, reject) => {
                getSSOAuthorizeUrl()
                    .then(res => {
                        window.location.href = res;
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 登出
        LogOut({ commit }) {
            return new Promise((resolve, reject) => {
                logout()
                    .then(res => {
                        logOut(commit);
                        resolve();
                    })
                    .catch(error => {
                        logOut(commit);
                        reject(error);
                    });
            });
        },

        // SSO登出
        SSOLogOut({ commit }) {
            return new Promise((resolve, reject) => {
                ssoLogout()
                    .then(res => {
                        logOut(commit);
                        window.location.href = res;
                        resolve();
                    })
                    .catch(error => {
                        logOut(commit);
                        reject(error);
                    });
            });
        },

        updateLoadMenus({ commit }) {
            return new Promise((resolve, reject) => {
                commit("SET_LOAD_MENUS", false);
            });
        }
    }
};

export const logOut = commit => {
    commit("SET_TOKEN", "");
    commit("SET_ROLES", []);
    removeToken();
};

export const setUserInfo = (res, commit) => {
    // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
    if (res.roles && res.roles.length === 0) {
        commit("SET_ROLES", ["ROLE_SYSTEM_DEFAULT"]);
    } else {
        commit("SET_ROLES", res.roles);
    }
    commit("SET_USER", res);
    commit('SET_AVATAR', res.avatar)
};

export default user;