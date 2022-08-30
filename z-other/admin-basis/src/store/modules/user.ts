import { defineStore } from 'pinia'
import { store } from '@/store'
import {
    getToken,
    setToken,
    removeToken,
    setUserInfo,
    getUserInfo,
    setUserId,
    getUserId,
    clear,
} from '@/utils/storage'
import { login, logout, getInfo } from '@/api/user/userApi'
import { loginReq, userInfo } from '@/api/user/types'

interface userStore {
    userInfo: Partial<userInfo> | null,
    username: string,
    token?: string
}

export const useUserStore = defineStore({
    id: 'app-user',
    state: (): userStore => ({
        userInfo: getUserInfo(),
        username: 'vite',
        token: undefined,
    }),
    getters: {},
    actions: {
        // 根据账号密码获取token
        async getToken(loginReq: loginReq) {
            const result = await login(loginReq);
            if (result && result.access_token) {
                setToken(result.access_token);
                return await this.getInfo();
            } else {
                return result;
            }
        },
        // 根据token获取用户信息
        async getInfo () {
            return getInfo()
                .then((res) => {
                    const { data, code, msg } = res;
                    setUserInfo(data);
                    return { msg, code };
                })
                .catch(() => { });
        },
        async setInfo (info) {
            this.userInfo = info;
            this.username = info.username;
            setUserInfo(info);
            setUserId(info.userId);
        },
        // logout
        async logout(goLogin = false) {
            // todo
        }
    }
});

export function useUserStoreWithOut() {
    return useUserStore(store);
}