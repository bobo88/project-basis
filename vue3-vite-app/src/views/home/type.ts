export interface TopResItem {
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
export interface SimpleTopList {
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

export interface TopListRes {
  entry: any[];
}

export interface AppDetailsInfoRes {
  resultCount: number;
  results: any[];
}

export interface AppDetailsInfo {
  trackId: number;
  userRatingCount: number;
  averageUserRating: number;
  description: string;
  sellerName: string;
  [props: string]: any;
}

export interface StateType {
  keyword: string;
  operateDetailsByIds?: (x: string, y: any[]) => Promise<[]>;
}
