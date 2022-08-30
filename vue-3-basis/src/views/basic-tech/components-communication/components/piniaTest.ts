import { defineStore } from 'pinia';
import { store } from '/@/store';

interface BasicTechState {
  title: string;
  desc: string;
}

export const useBasicTechStore = defineStore({
  id: 'app-basic-tech-test',
  state: (): BasicTechState => ({
    title: 'Default title test',
    desc: '描述',
  }),
  getters: {
    getTitle(): string {
      return this.title || ''
    },
    getDesc: (state: BasicTechState) => {
      return (prev: string) => prev + state.desc
    }
  },
  actions: {
    setTitle (info: string) {
      this.title = info ? info : '';
    },
    setDesc (info: string) {
      this.desc = info ? info : '';
    }
  },
});

// Need to be used outside the setup
export function useBasicTechStoreWithOut() {
  return useBasicTechStore(store);
}
