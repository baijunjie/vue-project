// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from '@/assets/js/router';
import routes from '@/routes';
import i18n from '@/assets/js/i18n';
import { utils } from 'G';
import App from '@/App';

Vue.config.productionTip = process.env.NODE_ENV === 'production';

// 路由
router.setRoutes(routes);

// 读取本地缓存的用户数据
// if (!utils.sessionTimeoutValidate('userData')) {
//     utils.removeStorage('userData');
// }

// 更换title
router.beforeEach((to, from, next) => {
    document.title = i18n.t(to.meta.i18n);
    next();
});

// 国际化
i18n.config({
    fallbackLocale: 'zh-CN',
    paths: {
        'zh-CN': './static/data/i18n/zh-CN.json',
        'en': './static/data/i18n/en.json'
    }
});

i18n.on('change', function(e, langType) {
    console.log('语言变更为：', langType);
    utils.setStorage('language', langType);
});

i18n.setLangType(utils.getStorage('language') || 'zh-CN');

i18n.on('ready', function(e, langType) {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        template: '<app/>',
        components: { App },
        router,
        i18n
    });
});
