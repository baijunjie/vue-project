// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
Vue.config.productionTip = false;

// http 模块
import VueResource from 'vue-resource';
Vue.use(VueResource);

// 路由
import router from '@/assets/js/router';
import routes from '@/routes';
router.setRoutes(routes);

// 国际化
import i18n from '@/assets/js/i18n';
i18n.config({
    paths: {
        'zh-CN': './static/data/i18n/zh-CN.json',
        'en-US': './static/data/i18n/en-US.json'
    }
});

i18n.on('change', function(langType) {
    console.log('语言变更为：', langType);
});

i18n.setLangType('zh-CN');

// UI 框架
import ElementUI from 'element-ui';
import ELUI_ZHCN from 'element-ui/lib/locale/lang/zh-CN';
import ELUI_EN from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-default/index.css';
Vue.use(ElementUI, {
    i18n: key => i18n.t(key)
});

i18n.on('requireLangDone', langType => {
    switch (langType) {
    case 'zh-CN':
        i18n.setAllLang(langType, ELUI_ZHCN);
        break;
    case 'en-US':
        i18n.setAllLang(langType, ELUI_EN);
        break;
    }
});

import '@/assets/js/patch';
import App from '@/App';

i18n.on('ready', function(langType) {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        template: '<app/>',
        components: { App },
        router,
        i18n
    });
});

