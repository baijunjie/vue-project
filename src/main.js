// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from '@/assets/js/router';
import routes from '@/routes';
import i18n from '@/assets/js/i18n';
import ElementUI from 'element-ui';
import ELUI_ZHCN from 'element-ui/lib/locale/lang/zh-CN';
import ELUI_EN from 'element-ui/lib/locale/lang/en';
import 'jquery.animate';
import '@/assets/js/patch';
import { utils } from 'G';
import App from '@/App';

Vue.config.productionTip = process.env.NODE_ENV === 'production';

// 路由
router.setRoutes(routes);

// 读取本地缓存的用户数据
if (!utils.sessionTimeoutValidate('userData')) {
    utils.removeStorage('userData');
}
// 登录验证钩子
router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !utils.getStorage('userData')) {
        router.push({
            name: 'login'
        });
    } else {
        document.title = i18n.t(to.meta.i18n);
        next();
    }
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

// UI 框架
Vue.use(ElementUI, {
    i18n() {
        return i18n.t.apply(i18n, arguments);
    }
});

i18n.on('requireLangDone', (e, langType) => {
    switch (langType) {
    case 'zh-CN':
        i18n.setAllLang(langType, ELUI_ZHCN);
        break;
    case 'en':
        i18n.setAllLang(langType, ELUI_EN);
        break;
    }
});

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
