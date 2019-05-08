/**
 * Vue Router 扩展 0.1.0
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
import pathToRegexp from 'path-to-regexp';

Vue.use(VueRouter);

const routeComponent = {
    template: '<router-view></router-view>'
};

const slashStartReg = new RegExp('^/+');
const slashEndReg = new RegExp('/+$');

class Router extends VueRouter {
    constructor(options) {
        super(options)
    }

    setRoutes(routes) {
        this.routes = this.initRoutes(routes);
        this.matcher.addRoutes(this.toVueRoutes(this.routes));
    }

    getRoute(key, value) {
        return this.findRoute(this.routes, key, value);
    }

    initRoutes(routes, parentRoute) {
        return routes.map(route => {
            route.parent = parentRoute;

            if (!route.component) {
                route.empty = true;
            }

            if (typeof route.path === 'undefined') {
                if (route.name) {
                    route.path = route.name;
                } else {
                    route.path = '';
                }
            }

            if (typeof route.path === 'string') {
                if (parentRoute && !slashStartReg.test(route.path)) {
                    // 处理相对路径
                    route.path = parentRoute.path.replace(slashEndReg, '') + '/' + route.path.replace(slashStartReg, '');
                } else {
                    route.path = '/' + route.path.replace(slashStartReg, '');
                }
            }

            if (route.children && route.children.length) {
                route.children = this.initRoutes(route.children, route);
            }

            return route;
        });
    }

    toVueRoutes(routes) {
        return routes.map(route => {
            const vueRoute = Object.assign({}, route);

            // 在递归中过滤掉创建的默认子路由
            if (!vueRoute.meta) {
                vueRoute.meta = route;
            }

            if (vueRoute.children && vueRoute.children.length) {
                const children = Object.assign([], vueRoute.children);

                if (vueRoute.component) {
                    const defaultChild = {
                        meta: vueRoute.meta,
                        name: vueRoute.name,
                        path: ''
                    };
                    delete vueRoute.name;

                    if (vueRoute.frame) {
                        defaultChild.component = vueRoute.defaultChild;
                    } else {
                        // 如果该路由不是一个frame，则将自己的组件作为默认页，然后用路由组件替换 component
                        defaultChild.component = vueRoute.component;
                        vueRoute.component = routeComponent;
                    }

                    defaultChild.component && children.unshift(defaultChild);
                } else {
                    vueRoute.component = routeComponent;
                }

                vueRoute.children = this.toVueRoutes(children);
            }

            return vueRoute;
        });
    }

    findRoute(routes, key, value) {
        let targetRoute;
        routes.some(route => {
            if (route[key] === value ||
                key === 'path' &&
                pathToRegexp(route[key]).exec(value)) {
                return targetRoute = route;
            } else if (route.children && route.children.length) {
                return targetRoute = this.findRoute(route.children, key, value);
            }
        });
        return targetRoute;
    }

    deleteRoute(routes, key, value) {
        let targetRoute;
        routes.some((route, i) => {
            if (route[key] === value ||
                key === 'path' &&
                pathToRegexp(route[key]).exec(value)) {
                routes.splice(i, 1);
                return targetRoute = route;
            } else if (route.children && route.children.length) {
                return targetRoute = this.deleteRoute(route.children, key, value);
            }
        });
        return targetRoute;
    }

    matchRoutes(routeInfo) {
        let route = routeInfo.meta || routeInfo;
        let matched = [route];

        while (route.parent) {
            route = route.parent;
            matched.push(route);
        }

        return matched.reverse();
    }
}

export function createRouter(routes) {
    return new Router({
        mode: 'history',
        routes
    });
}

export default createRouter()
