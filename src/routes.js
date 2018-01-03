let Login = {
    i18n: 'views.Login.name',
    name: 'login',
    component: resolve => require(['@/views/Login'], resolve)
};

let Home = {
    i18n: 'views.Home.name',
    name: 'home',
    path: '',
    hide: true,
    frame: true,
    component: resolve => require(['@/components/Frame'], resolve),
    defaultChild: resolve => require(['@/views/Home'], resolve)
};

let P404 = {
    name: '404',
    path: '/*',
    hide: true,
    component: resolve => require(['@/views/404'], resolve)
};

let Foo = {
    i18n: 'menu.goToFoo',
    name: 'foo',
    icon: 'el-icon-menu',
    component: resolve => require(['@/views/demo/Foo'], resolve)
};

let Bar = {
    i18n: 'menu.goToBar',
    name: 'bar',
    icon: 'el-icon-menu',
    component: resolve => require(['@/views/demo/Bar'], resolve)
};

// 定义页面之间的父子关系
export default [
    {
        ...Home,
        children: [
            {
                ...Foo,
                children: [
                    Bar
                ]
            },
            P404
        ]
    },
    Login
];
