import { usePermissionStoreHook } from '@/store/modules/permission'
import { Router } from 'vue-router'
import { getToken, setToken } from '../utils/storage'
const whiteList = ['/login']

export const useRouterGuard = (router: Router) => {
    router.beforeEach(async (to, from, next) => {
        // 兼容第三方跳入，带入tzToken
        const token = to.query.tzToken as string;
        if (token) {
            setToken(token)
        }

        const isWhite = whiteList.includes(to.path); // 是否白名单
        if (isWhite || getToken()) {
            // 全局拦截ut
            const permisStore = usePermissionStoreHook();
            if (isWhite || Object.keys(permisStore.roles || {}).length > 0) {
                if (to.query.ut) {
                    next();
                    return;
                }
                to.query.ut = from.query.ut || to.meta.ut as string || '1';
                next({ ...to, replace: true });
            } else {
                try {
                    await permisStore.generatePermits(to.path);
                    next({ ...to, replace: true });
                } catch (err) {
                    console.log(err)
                    next('/login')
                }
            }
        } else {
            next('/login')
        }
    });

    router.afterEach(() => {
        // todo
    })
}