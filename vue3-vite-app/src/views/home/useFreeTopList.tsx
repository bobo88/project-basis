import { computed, ref } from "vue";
import { getFreeTop } from "./api";
import type { SimpleTopList, StateType } from "./type";

export const useFreeTopList = (state: StateType) => {
  const finished = ref(false);
  const loading = ref(false);
  const freeTopList = ref<SimpleTopList[]>([]);
  // 最终合并后的数据
  // keyword过滤后的数据
  const topListFilter = computed(() => {
    return freeTopList.value.filter((item) => {
      return !state.keyword
        ? item
        : `${item.name}${item.sellerName}${item.description}`.includes(
            state.keyword
          );
    });
  });

  // 100
  const getFreeTopList = () => {
    getFreeTop(100).then(async (res) => {
      // 根据ids进行详情查询
      const tempArr = state.operateDetailsByIds && await state.operateDetailsByIds(res.ids.join(","), res.list);
      freeTopList.value = [].concat(tempArr as []);
      finished.value = true;
    });
  };
  getFreeTopList();

  return () => (
    <van-list
      v-model:loading={loading.value}
      finished={finished.value}
      finished-text="没有更多了"
    >
      {topListFilter.value && topListFilter.value.map((item, index) => {
        return (
          <van-cell class="cell-item" key={item.id}>
            <span class="seq">{index + 1}</span>
            <img
              class={index % 2 === 0 ? "icon" : "icon circle"}
              alt={item.name}
              v-lazy={item.icon}
            />
            <div class="cont">
              <span class="name">{item.name}</span>
              <span class="category">{item.category}</span>
              <div class="star-cont">
                <van-rate
                  class="star-rate"
                  v-model={item.averageUserRating}
                  color="#faca20"
                  size="14"
                />
                <span class="rate-count">({item.userRatingCount})</span>
              </div>
            </div>
          </van-cell>
        );
      })}
    </van-list>
  );
};
