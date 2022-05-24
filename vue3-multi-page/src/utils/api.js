// 封装后台接口方法
import { get, post, put, del, uploader } from './http'

// test
export const getPhotos = (params) => get('/api/photos/' + params.num, false)

// 随便写写
export const LOGIN = (params) => get('service-core/wechat/serviceAccount/qrCode/create', params, false)
export const REGISTER = (params) => put('service-core/user_register', params, false)
export const USER_LIST = (params) => post('service-core/user_list', params)
export const USER_LIST_ID = (params) => get(`service-core/user_list/${params.id}`)
export const UPLOAD_USER_CARD = (params) => uploader('service-core/user_upload_card', params)
export const DELETE_BOOK = (params) => del(`service-core/book_list/${params.id}`)