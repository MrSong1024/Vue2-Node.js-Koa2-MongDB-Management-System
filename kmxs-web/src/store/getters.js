/*
 * @Author: Songjq
 * @Date: 2022-01-23 21:17:53
 * @Desscription: 
 */
const getters = {
    deployUploadApi: state => state.api.deployUploadApi,
    databaseUploadApi: state => state.api.databaseUploadApi,
    size: state => state.app.size,
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    roles: state => state.user.roles, // 角色
    user: state => state.user.user, // 用户信息
    avatar: state => state.user.avatar, // 头像
    loadMenus: state => state.user.loadMenus,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    socketApi: state => state.api.socketApi,
    imagesUploadApi: state => state.api.imagesUploadApi,
    baseApi: state => state.api.baseApi,
    fileUploadApi: state => state.api.fileUploadApi,
    updateAvatarApi: state => state.api.updateAvatarApi,
    qiNiuUploadApi: state => state.api.qiNiuUploadApi,
    sqlApi: state => state.api.sqlApi,
    swaggerApi: state => state.api.swaggerApi,
    ssoPostRedirect: state => state.user.ssoPostRedirect
}
export default getters