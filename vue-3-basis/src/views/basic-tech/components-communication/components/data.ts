import type { InjectionKey, Ref } from 'vue';
// InjectionKey ?????  --> : InjectionKey<string>
interface GroupItem {
  title: string;
  icon: string;
  color: string;
  desc: string;
  date: string;
  interpret: string;
  childSlotName: string;
}

export const groupItems: GroupItem[] = [
  {
    title: 'props / emits',
    icon: '',
    color: '',
    desc: '描述1111',
    interpret: 'TODO',
    date: '2021-04-01',
    childSlotName: 'One',
  },
  {
    title: 'v-model / emits',
    icon: '',
    color: '#3fb27f',
    desc: '描述2222',
    interpret: 'TODO',
    date: '2021-04-01',
    childSlotName: 'Two',
  },
  // {
  //   title: 'ref / emits',
  //   icon: '',
  //   color: '#e18525',
  //   desc: 'ref「特殊attribute」 被用来给元素或子组件注册引用信息',
  //   interpret: 'TODO',
  //   date: '2021-04-01',
  //   childSlotName: 'Three',
  // },
  {
    title: 'provide / inject',
    icon: '',
    color: '#bf0c2c',
    desc: '描述4444',
    interpret: 'TODO',
    date: '2021-04-01',
    childSlotName: 'Four',
  },
  {
    title: 'EventBus(mitt)',
    icon: '',
    color: '#00d8ff',
    desc: '描述5555',
    interpret: 'TODO',
    date: '2021-04-01',
    childSlotName: 'Five',
  },
  {
    title: 'Vuex / pinia',
    icon: '',
    color: '#4daf1bc9',
    desc: '描述6666',
    interpret: 'TODO',
    date: '2021-04-01',
    childSlotName: 'Six',
  },
  // {
  //   title: 'expose / ref',
  //   icon: '',
  //   color: '#4daf1bc9',
  //   desc: '路是走出来的，而不是空想出来的。',
  //   interpret: 'TODO',
  //   date: '2021-04-01',
  //   childSlotName: 'Seven',
  // },
];

