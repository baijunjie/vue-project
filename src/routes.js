let ListRedirect = {
    path: '',
    redirect: { name: 'list' }
};

let Frame = {
    name: 'frame',
    path: '',
    frame: true,
    component: resolve => require(['@/components/Frame'], resolve)
};

let List = {
    i18n: 'views.List.name',
    name: 'list',
    component: resolve => require(['@/views/List'], resolve)
};

let Video = {
    i18n: 'views.Video.name',
    name: 'video',
    path: 'video/:type/:room',
    component: resolve => require(['@/views/Video'], resolve)
};

let P404 = {
    name: '404',
    path: '/*',
    hide: true,
    component: resolve => require(['@/views/404'], resolve)
};

// 定义页面之间的父子关系
export default [
    ListRedirect,
    {
        ...Frame,
        children: [
            List
        ]
    },
    Video,
    P404
];
