import axios, { type AxiosRequestConfig } from "axios";
interface PlAxiosRequestConfig extends AxiosRequestConfig {
  loading?: boolean;
  ignoreCodes?: Array<number>;
}
const http = axios.create({
  timeout: 80000, // request timeout
});
type RequestConfig = Required<AxiosRequestConfig>;

//请求拦截
http.interceptors.request.use(
  (config: PlAxiosRequestConfig) => {
    const token: string = ""; //放自己的token
    if (token) {
      (config as RequestConfig).headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//respone拦截

http.interceptors.response.use(
  (response) => {
    const { headers, data } = response;
    const res = data;
    // res.headers = headers;
    if (res.code && res.code !== 0) {
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  (error) => {
    const data = error?.response?.data;
    if (!data) {
      if (error.messge.includes("timeout of")) {
        alert(error.config.url + "----请求超时");
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
export default http;
