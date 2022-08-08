import api from '@/plugins/tzAxios'
import { loginReq, LoginResp, PermitMenu } from './types'

/**
 * 用户登录
 */
export const login = (params: loginReq) => {
    const option = {
        url: 'auth/oauth/token',
        params,
        headers: {
            Authorization: 'Basic dHo6dHo=',
        },
    };
    return api.post(option) as unknown as Promise<LoginResp>;
};

/**
 * 获取用户信息
 */
export const getInfo = (params = {}) => {
    const option = {
        url: '{uc}/account/getUserInfo',
        params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };
    return api.post(option)
}

/**
 * 获取用户权限
 */
export const getAllPermission = (data: {}) => {
    const option = {
        url: '{uc}/permission/getAllMenusByUser',
        data,
    };
    return api.post<PermitMenu[]>(option);
}

/**
 * 获取切换系统列表
 */
export const getSystemsByFirm = (data: Object) => {
    const option = {
        url: '{uc}/account/getSystemByFirm',
        data,
    }
    return api.post(option)
}

/**
 * 退出登录
 */
export const logout = (data: Object) => {
    return Promise.resolve(data);
    // ...
}
