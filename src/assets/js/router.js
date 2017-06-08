/**
 * Vue Router 扩展
 * @author Junjie.Bai
 *
 * router  返回一个 VueRouter 的实例对象，扩展了以下方法与属性。
 *
 * 方法：
 * - setRoutes   为路由实例设置 routes 配置对象
 * - getRoute    根据 key、value 获取在 routes 中对应的配置对象
 * - findRoute   根据 key、value 获取传入的 routes 中对应的配置对象（用于权限控制的修改，只有在调用 setRoutes 之前修改才有效）
 * - deleteRoute 根据 key、value 删除传入的 routes 中对应的配置对象（用于权限控制的删除，只有在调用 setRoutes 之前删除才有效）
 * - matchRoutes 传入 vue-router 的路由信息对象，返回一个路由数组，表示从根路由开始到该路由结束，所经过的所有路由组成的数组（用于生成面包屑）
 *
 * 属性：
 * - routes      指向路由的配置对象 routes
 *
 * 注意，每一个路由配置对象都会挂载到对应的 vue-router 路由信息对象的 meta 属性下
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const parentComponent = {
    template: '<router-view></router-view>'
};

const slashStartReg = new RegExp('^/+');
const slashEndReg = new RegExp('/+$');

const router = Object.assign(new VueRouter(), {
    setRoutes(routes) {
        router.routes = toVueRoutes(routes);
        router.matcher.addRoutes(router.routes);
    },

    getRoute(key, value) {
        return findRoute(router.routes, key, value).meta;
    },

    findRoute,
    deleteRoute,
    matchRoutes
});

function toVueRoutes(routes, parentRoute) {

    routes.forEach(function(route) {
        route.parent = parentRoute;

        if (!route.component) {
            route.empty = true;
        }

        if (typeof route.path === 'undefined' && route.name) {
            route.path = route.name;
        }

        // 在递归中过滤掉创建的默认子路由
        if (!route.meta) {
            route.meta = route;
            route.path = route.path || '';

            if (parentRoute && !slashStartReg.test(route.path)) {
                // 处理相对路径
                route.path = parentRoute.path.replace(slashEndReg, '') + '/' + route.path.replace(slashStartReg, '');
            } else {
                route.path = '/' + route.path.replace(slashStartReg, '');
            }
        }

        if (route.children && route.children.length) {
            if (route.component) {
                route.children.unshift({
                    meta: route,
                    name: route.name,
                    path: '',
                    component: route.component
                });
                delete route.name;
            }

            route.component = parentComponent;
            route.children = toVueRoutes(route.children, route);
        }
    });

    return routes;
}

function findRoute(routes, key, value) {
    let targetRoute;
    routes.some((route) => {
        if (route[key] === value) {
            return targetRoute = route;
        } else if (route.children && route.children.length) {
            return targetRoute = findRoute(route.children, key, value);
        }
    });
    return targetRoute;
}

function deleteRoute(routes, key, value) {
    let targetRoute;
    routes.some((route, i) => {
        if (route[key] === value) {
            routes.splice(i, 1);
            return targetRoute = route;
        } else if (route.children && route.children.length) {
            return targetRoute = deleteRoute(route.children, key, value);
        }
    });
    return targetRoute;
}

function matchRoutes(routeInfo) {
    let route = routeInfo.meta;
    let matched = [route];

    while (route.parent) {
        route = route.parent;
        matched.push(route);
    }

    return matched.reverse();
}

export default router;
