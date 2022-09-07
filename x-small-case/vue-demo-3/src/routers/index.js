import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/pages/home-xx.vue')
    },
    {
        path: '/about',
        component: () => import('@/pages/AboutPage.vue')
    },
    {
        path: '/user',
        name: 'user',
        component: () => import('@/pages/UserPage.vue'),
        props: true,
        beforeEnter: (to, from) => {
            // reject the navigation
            console.log('========= 路由独享beforeEnter: ', to, from)
            return true
            // return false
        },
        children: [
            {
                path: 'details',
                name: 'user-details',
                component: () => import('@/pages/UserDetails.vue'),
            },
        ]
    },
    {
        path: '/user/:id(\\d+)',
        name: 'userid',
        component: () => import('@/pages/UserPage.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
    },
    // 任何不匹配成功的页面都重定向 login 页面
    {
        path: '/:other',
        name: 'otherPage',
        redirect: '/login',
    },

];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    console.log('========== BeforeEach: ', to, from)
    next(); // next 的作用 ？
});
router.beforeResolve((to, from) => {
    console.log('========== BeforeResolve: ', to, from)
});
router.afterEach((to, from) => {
    console.log('========== AfterEach: ', to, from)
})

/***
 * export 'default' (imported as 'VueRouter') was not found in 'vue-router' (possible exports: 
 * NavigationFailureType, RouterLink, 
 * RouterView, START_LOCATION, createMemoryHistory, createRouter, createRouterMatcher, createWebHashHistory, createWebHistory, 
 * isNavigationFailure, loadRouteLocation, matchedRouteKey, onBeforeRouteLeave, onBeforeRouteUpdate, parseQuery, routeLocationKey, 
 * routerKey, routerViewLocationKey, stringifyQuery, useLink, useRoute, useRouter, viewDepthKey)
 */

export default router