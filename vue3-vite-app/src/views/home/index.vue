<script lang="tsx">
import { computed, defineComponent, reactive, ref } from "vue";
import { useSearch } from "./useSearch";
import { useFreeTopList } from "./useFreeTopList";
import TopSwipe from "@/components/TopSwipe.vue";

import { getHotTop, getDetailsByIds } from "./api";
import type { SimpleTopList, AppDetailsInfo, StateType } from "./type";

export default defineComponent({
  name: "IndexView",
  components: {
    TopSwipe,
  },
  setup() {
    //页面全局状态数据
    const state = reactive<StateType>({
      keyword: "",
    });
    const hotTopList = ref<SimpleTopList[]>([]);
    // keyword过滤后的数据
    const topListFilter = computed(() => {
      return hotTopList.value.filter((item) => {
        return !state.keyword
          ? item
          : `${item.name}${item.sellerName}${item.description}`.includes(
              state.keyword
            );
      });
    });

    /**
     * 处理详情数据
     * @params {ids} 每个数据的id集合
     * @params {topList} 需要处理的数据对象 
     */
    state.operateDetailsByIds = async (ids, topList) => {
      // 根据ids请求app详情（比如【评论人数】以及【评分等级】等内容）
      const res = await getDetailsByIds(ids).then((res) => {
        let detailsObj = res.results.reduce((prev, curr) => {
          prev[curr.trackId] = {
            averageUserRating: curr.averageUserRating,
            userRatingCount: curr.userRatingCount,
            description: curr.description,
            sellerName: curr.sellerName,
          };
          return prev;
        }, {}) || {};

        return topList.map((sItem) => {
          return {
            ...detailsObj[sItem.id],
            ...sItem
          }
        });
      });
      return res
    }
    /**
     * 获取滑轮区域数据
     */
    const getHotList = () => {
      getHotTop(10).then(async (res) => {
        // 根据ids进行详情查询
        let tempArr = await state.operateDetailsByIds(res.ids.join(","), res.list);
        hotTopList.value = [].concat(tempArr);
      });
    };
    getHotList();

    //搜索区域Hook
    const searchHook = useSearch(state);
    //免费前100列表区域Hook
    const freeTopListHook = useFreeTopList(state);
    return () => {
      return (
        <div class="home-page">
          {searchHook()}
          {
            hotTopList.value.length > 0 && <>
              <h3>Recommend</h3>
              <TopSwipe list={topListFilter.value} />
            </>
          }
          {freeTopListHook()}
          
          {
            /*
            <div class="env-test">
              <van-button plain hairline type="primary" size="mini" class="linkto">
                <router-link to='/about'>To About Page</router-link>
              </van-button>
            </div>
            */
          }
        </div>
      );
    };
  },
});
</script>
<style lang="scss">
.home-page {
  padding-top: 55px;
  .van-search {
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-bottom: 1px solid var(--color-border);
    overflow: hidden;
    .van-search__content {
      border-radius: 10px;
    }
  }
  h3 {
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: var(--color-text);
  }
  .van-list {
    .van-cell__value {
      display: flex;
      justify-items: flex-start;
      align-items: center;
      .seq {
        width: 25px;
        color: var(--color-text-light);
      }
      .icon {
        width: 70px;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.1);
        &.circle {
          border-radius: 50%;
        }
      }
      .cont {
        padding-left: 10px;
        width: 200px;
        flex: 1;
        .name,
        .category {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .category {
          line-height: 20px;
          color: var(--color-text-light);
          font-size: 12px;
        }
      }
      .star-cont {
        display: flex;
        align-items: center;
        .star-rate {
          margin-right: 6px;
        }
        .rate-count {
          font-size: 12px;
          color: var(--color-text-light);
        }
      }
    }
  }
  .env-test {
    padding: 10px;
    text-align: center;
  }
}
</style>
