export {};

declare global {
  interface Window {
    example: any; // 👈️ turn off type checking
    __POWERED_BY_QIANKUN__: any;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__: any;
  }
}