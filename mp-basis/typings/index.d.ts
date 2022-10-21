/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface IResponseOption<T = any> {
  results: never[];
  code: number;
  data: T extends Record<string, any> ? T : any;
  feed?: T extends Record<string, any> ? T : any;
  // results?: T extends Record<string, any> ? T : any;
  msg: string;
  success?: string;
  notSuccess?: string;
}
interface ITopResItem {
  category: Record<string, any>;
  id: Record<string, any>;
  ["im:artist"]: Record<string, any>;
  ["im:contentType"]: Record<string, any>;
  ["im:image"]: Record<string, any>;
  ["im:name"]: Record<string, any>;
  ["im:price"]: Record<string, any>;
  ["im:releaseDate"]: Record<string, any>;
  link: any[];
  rights: Record<string, any>;
  summary: Record<string, any>;
  title: Record<string, any>;
}

interface ISimpleTopList {
  category: string;
  id: string;
  icon: string;
  name: string;
  artist: string;
  summary: string;
  averageUserRating?: number;
  userRatingCount?: number;
  description?: string;
  sellerName?: string;
  [props: string]: any;
}

interface IAppDetailsInfoRes {
  resultCount: number;
  results: any[];
}

interface IAppDetailsInfo {
  trackId: number;
  userRatingCount: number;
  averageUserRating: number;
  description: string;
  sellerName: string;
  [props: string]: any;
}