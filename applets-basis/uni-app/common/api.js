const { http } = uni.$u
// 获取菜单
export const fetchMenu = (params, config = {}) => http.post('xxxxx/index', params, config)
