/*
 * @Author: Songjq
 * @Date: 2021-12-05 22:20:08
 * @Desscription:
 */
module.exports = {
    /**
     * @description 网站标题
     */
    title: "Kmxs后台管理系统",
    /**
     * @description 是否显示 tagsView
     */
    tagsView: false,
    /**
     * @description 固定头部
     */
    fixedHeader: true,
    /**
     * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
     */
    tokenCookieExpires: 1,
    /**
     * @description 记住密码状态下的密码在Cookie中存储的天数，默认1天s
     */
    passCookieExpires: 1,
    /**
     * @description 是否只保持一个子菜单的展开
     */
    uniqueOpened: true,
    /**
     * @description token key
     */
    TokenKey: "DNS-TOEKN",
    /**
     * @description 请求超时时间，毫秒（默认2分钟）
     */
    timeout: 1200000,
    /**
     * @description 是否显示logo
     */
    sidebarLogo: true,
    /**
     * 是否显示设置的底部信息
     */
    showFooter: false,
    /**
     * 底部文字，支持html语法
     */
    footerTxt: "© 2022 SMS Group, All Rights Reserved 版权所有 孔明先生前端交流网",
    /**
     * 备案号
     */
    caseNumber: "蜀ICP备19002715号"
};