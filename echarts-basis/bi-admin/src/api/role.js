import request from '@/utils/request'

// 获取操作日志列表
export function systemOper_logList(options) {
  return request({
    url: '/system/oper_log/list',
    method: 'get',
    params: options
  })
}
// 修改角色
export function editSystemRole(options) {
  return request({
    url: '/system/role',
    method: 'put',
    data: options
  })
}
// 新增角色
export function addSystemRole(options) {
  return request({
    url: '/system/role/addRole',
    method: 'post',
    data: options
  })
}
// 获取角色列表
export function getSystemRoleList(options) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: options
  })
}
// 获取角色权限列表
export function getSystemRoleListRolePerms(options) {
  return request({
    url: '/system/role/list_role_perms',
    method: 'get',
    params: options
  })
}
// 根据角色编号获取详细信息
export function getSystemRoleByRoleId(options) {
  return request({
    url: '/system/role/' + options.roleId,
    method: 'get'
    // params: options
  })
}
// 删除角色
export function deleteRoleById(options) {
  return request({
    url: '/system/role/' + options.roleId,
    method: 'delete',
    params: options
  })
}
// 修改用户
export function editSystemUser(options) {
  return request({
    url: '/system/user',
    method: 'put',
    data: options
  })
}
// 添加用户
export function addSystemUser(options) {
  return request({
    url: '/system/user/add',
    method: 'post',
    data: options
  })
}
// 获取用户列表
export function getSystemUserList(options) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: options
  })
}
// 重置密码
export function systemUserResetPwd(options) {
  return request({
    url: '/system/user/reset_pwd',
    method: 'put',
    data: options
  })
}
// 删除用户
export function deleteSystemUser(options) {
  return request({
    url: '/system/user/' + options.user_ids,
    method: 'delete'
    // params: options
  })
}
export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
