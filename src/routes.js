let home = {
    i18n: 'views.home.name',
    name: 'home',
    path: '',
    redirect: function(to) {
        console.log(to);
    },
    component: resolve => require(['@/views/home'], resolve)
};

let p404 = {
    name: '404',
    path: '/*',
    component: resolve => require(['@/views/404'], resolve)
};

let foo = {
    i18n: 'menu.goToFoo',
    name: 'foo',
    component: resolve => require(['@/views/demo/foo'], resolve)
};

let bar = {
    i18n: 'menu.goToBar',
    name: 'bar',
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
            }
        ]
    },

    p404
];
