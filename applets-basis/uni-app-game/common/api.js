const { http } = uni.$u
// 获取菜单
export const fetchMenu = (params, config = {}) => http.post('/xxx/index', params, config)
