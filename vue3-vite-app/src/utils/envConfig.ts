console.log('当前环境参数为：', import.meta.env);
const { VITE_APP_NAME, VITE_BASE_URL, MODE } = import.meta.env;

export const C_APP_NAME = VITE_APP_NAME;
export const C_BASE_URL = VITE_BASE_URL || '';
export const C_MODE = MODE;

export default {
    APP_NAME: VITE_APP_NAME,
    BASE_URL: VITE_BASE_URL || '',
    MODE: MODE,
}