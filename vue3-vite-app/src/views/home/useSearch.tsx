import { ref } from "vue";
import { Toast } from "vant";
import type { StateType } from "./type";

// 基於本地應⽤數據的【應⽤名】、【開發者名】和【應⽤描述】來進⾏搜索並展示搜索結果
export const useSearch = (state: StateType) => {
  const text = ref("");

  const onSearch = (val: string) => {
    state.keyword = val;
    // console.log(state.keyword, val);
  };
  const onCancel = () => Toast("取消");

  return () => {
    return (
      <van-search
        v-model={text.value}
        placeholder="Search..."
        onUpdate:modelValue={onSearch}
        onCancel={onCancel}
      />
    );
  };
};
