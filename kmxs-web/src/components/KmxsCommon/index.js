/*
 * @Author: Songjq
 * @Date: 2022-04-02 17:11:01
 * @Desscription: 公共组件,自动引入所有的vue文件
 */
//  ./为当前目录， true为是否匹配当前文件夹    /\.vue$/为匹配插件(匹配.vue结尾的插件)
const requireComponent = require.context('./', true, /\.vue$/);
const install = (Vue) => {
    // 判断有没有被注册
    // 如果注册过，就直接返回，否则就再注册一遍
    if (install.installed) {
        return;
    } else {
        install.installed;
    }

    requireComponent.keys().forEach(fileName => {
        // 拿到第i个
        const config = requireComponent(fileName) // 拿到的是vue文件的文件名
        const componentName = config.default.name // 拿到的是vue文件中export default 下的name
        Vue.component(componentName, config.default || config)
    });

    // 自定义指令 , 自动获取焦点去input上执行 v-focus
    Vue.directive('focus', {
        bind: function() {},
        // 当元素被插入界面的时候，就会被出发
        inserted: function(el) {
            el.focus();
        }
    })
}

// 确保是正常环境
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install
}