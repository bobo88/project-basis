/**
 * 登录response
 */
export interface LoginResp {
    'access_token': string,
    'refresh_token': string,
    'expires_in': string,
    'token_type': string,
    scope: string
}

export interface loginReq {
    username: string,
    password: string,
    grant_type: string,
    scope: string,
}

export interface userInfo extends Record<string, any> {
    username: string,
    avatar: string
}

export interface PermitButton {
    id: string,
    systemRoleId?: any;
    systemRolePermissionId?: any;
    orgPermissionId?: any;
    moduleId: string,
    moduleButtonId?: any;
    buttonId: string;
    code: string,
    name: string,
    icon: string,
    script?: string,
    eventJs?: string,
    method?: string,
    buttonType?: number,
    orderSort?: number
}

export interface PermitMenu {
    id: string,
    parentId: string,
    code: string,
    icon: string,
    openWith?: number,
    openUrl?: string,
    area?: string,
    controller?: string,
    action?: string,
    queryString?: string,
    menuClass?: number,
    haveDataPermission?: boolean,
    haveFieldPermission: boolean,
    menuFlag: boolean,
    apiFlag?: boolean,
    logFlag?: boolean,
    enabledFlag?: boolean,
    orderSort: number,
    orderString: string,
    parentIds: string,
    parent?: any[],
    children: PermitMenu[],
    buttons: PermitButton[],
}