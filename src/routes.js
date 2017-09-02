let login = {
    i18n: 'views.login.name',
    name: 'login',
    component: resolve => require(['@/views/login'], resolve)
};

let home = {
    i18n: 'views.home.name',
    name: 'home',
    path: '',
    hide: true,
    component: resolve => require(['@/components/frame'], resolve),
    defaultChild: resolve => require(['@/views/home'], resolve)
};

let p404 = {
    name: '404',
    path: '/*',
    hide: true,
    component: resolve => require(['@/views/404'], resolve)
};

let foo = {
    i18n: 'menu.goToFoo',
    name: 'foo',
    icon: 'el-icon-menu',
    component: resolve => require(['@/views/demo/foo'], resolve)
};

let bar = {
    i18n: 'menu.goToBar',
    name: 'bar',
    icon: 'el-icon-menu',
    component: resolve => require(['@/views/demo/bar'], resolve)
};

// 定义页面之间的父子关系
export default [
    {
        ...home,
        children: [
            {
                ...foo,
                children: [
                    bar
                ]
            },
            p404
        ]
    },
    login
];
