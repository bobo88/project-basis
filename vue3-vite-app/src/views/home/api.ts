import api from "@/plugins/plAxios/index";
import type { TopListRes, AppDetailsInfoRes, TopResItem, SimpleTopList } from "./type";

interface RtnType {
  ids: string[];
  list: SimpleTopList[]
}

type PromiseTopListResType = PL_AXIOS.PlAxiosPromise<TopListRes>;
type PlResponsePromise = PL_AXIOS.PlResponsePromise;

// 对原始数据进行过滤处理
const topDataFilter = async (res: PromiseTopListResType) => {
  let topDataList = await res.then((data: PlResponsePromise) => {
    return data.feed?.entry || []
  });
  const rtn: RtnType = {
    ids: [],
    list: []
  };
  // 数据瘦身
  rtn.list = topDataList.map((item: TopResItem) => {
    // ids集合
    rtn.ids.push(item.id.attributes["im:id"]);
    return {
      category: item.category.attributes.label,
      id: item.id.attributes["im:id"],
      icon: item["im:image"][2].label,
      // 应用名
      name: item["im:name"].label,
      // 开发者名
      artist: item["im:artist"],
      // 应用描述
      summary: item.summary.label,
    };
  });
  return Promise.resolve(rtn)
};

// 热门 Top10
export const getHotTop = (limit: number) => {
  const option = {
    url: `rss/topgrossingapplications/limit=${limit}/json`,
  };

  return topDataFilter(api.get<TopListRes>(option) as PromiseTopListResType);
};
// 免费 Top100
export const getFreeTop = (limit: number) => {
  const option = {
    url: `rss/topfreeapplications/limit=${limit}/json`,
  };
  return topDataFilter(api.get<TopListRes>(option) as PromiseTopListResType); // PlAxiosPromise<T>
};
// 搜索结果
export const getDetailsByIds = (ids: string) => {
  const option = {
    url: `lookup?id=${ids}`,
  };
  return api.post<AppDetailsInfoRes>(option);
};
