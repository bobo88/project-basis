declare namespace PL_AXIOS {
  interface PlResponsePromise<T = any> {
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
  interface PlAxiosPromise<T> extends Promise<PlResponsePromise<T>> {}
  type PlMethod = Method;

}
