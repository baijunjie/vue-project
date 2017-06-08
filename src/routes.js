let home = {
    i18n: 'pages.home.name',
    name: 'home',
    path: '',
    redirect: function(to) {
        console.log(to);
    },
    component: resolve => require(['@/pages/home/home'], resolve)
};

let p404 = {
    name: '404',
    path: '/*',
    component: resolve => require(['@/pages/demo/404/404'], resolve)
};

let foo = {
    i18n: 'menu.goToFoo',
    name: 'foo',
    component: resolve => require(['@/pages/demo/foo/foo'], resolve)
};

let bar = {
    i18n: 'menu.goToBar',
    name: 'bar',
    component: resolve => require(['@/pages/demo/bar/bar'], resolve)
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
            }
        ]
    },

    p404
];
