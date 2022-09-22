import type { AxiosRequestConfig, AxiosResponseHeaders, Method } from "axios";

export interface PlAxiosRequestConfig<T = any> extends AxiosRequestConfig<T> {
  url: string;
}
interface PlResponseHeaders {
  "content-encoding": string;
  "content-type": string;
}
export interface PlResponsePromise<T = any> {
  results: never[];
  code: number;
  data: T extends Record<string, any> ? T : any;
  feed?: T extends Record<string, any> ? T : any;
  // results?: T extends Record<string, any> ? T : any;
  msg: string;
  success?: string;
  notSuccess?: string;
  headers: Partial<PlResponseHeaders> & AxiosResponseHeaders;
}
export interface PlAxiosPromise<T> extends Promise<PlResponsePromise<T>> {}
export type PlMethod = Method;
