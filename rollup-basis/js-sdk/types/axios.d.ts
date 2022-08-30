import * as axios from 'axios'

declare module 'axios' {
  interface AxiosInstance {
    [props: string]: any
    // (config: AxiosRequestConfig): Promise<any>
  }
  interface AxiosResponse {
    [props: string]: any
  }
}