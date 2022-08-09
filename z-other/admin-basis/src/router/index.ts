import { App }  from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useRouterGuard } from './guard'

export const constantRoutes: TzRouteRaw[] = [
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name: 'login'
    }
];

const errorRouter: TzRouteRaw[] = [
    {
        path: '/redirect',
        component: () => import('@/views/redirect.vue')
    },
    {path: '/:catchAll(.*)*', name: 'noFind', redirect: '/404'},
    {
        path: '/404',
        component: () => import('@/views/404.vue')
    }
];

/**
 * 动态读取不同模块routes.ts
 */
const generateRoute = () => {
    // 开发环境读取本地配置
    const routerFiles = import.meta.globEager('../views/**/routes.ts');
    const routerList: TzRouteRaw[] = [];
    for (const path in routerFiles) {
        routerList.push(routerFiles[path].default)
    }
    routerList.forEach((item) => (item.name = item.path))

    const firstRoute: TzRouteRaw = {
        path: '/',
        redirect: routerList[0]?.path
    };
    return [firstRoute, ...routerList]
};

export const syncRoutes = generateRoute();

const router = createRouter({
    // history模式
    history: createWebHistory('/'),
    routes: [...constantRoutes, ...syncRoutes, ...errorRouter] as RouteRecordRaw[],
});

// reset router
export function resetRouter() {
    router.getRoutes().forEach((route) => {
        // todo
    })
};

// config router
export function useRouter() {
    return router;
}

// config router
export function setupRouter(app: App<Element>) {
    app.use(router);
    useRouterGuard(router);
    return router;
}