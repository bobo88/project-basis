interface GroupItem {
  title: string;
  icon: string;
  color: string;
  desc: string;
  date: string;
  interpret: string;
}

export const groupItems: GroupItem[] = [
  {
    title: 'setup',
    icon: '',
    color: '',
    desc: '「设置」',
    interpret: '类似 beforeCreate / created',
    date: '2021-04-01',
  },
  {
    title: 'ref',
    icon: '',
    color: '#3fb27f',
    desc: '作用： 让变量响应式 - 定义 「基本数据类型」',
    interpret: 'Object.defineProperty实现响应式',
    date: '2021-04-01',
  },
  {
    title: 'reactive',
    icon: '',
    color: '#e18525',
    desc: '用来定义：「对象或数组类型数据」',
    interpret: 'Proxy实现响应式, 搭配Reflect',
    date: '2021-04-01',
  },
  {
    title: 'toRef / toRefs',
    icon: '',
    color: '#bf0c2c',
    desc: '作用：解构 reactive声明的响应式数据，解构导出，在template里面直接使用',
    interpret: 'TODO',
    date: '2021-04-01',
  },
  {
    title: 'expose',
    icon: '',
    color: '#00d8ff',
    desc: 'TODO',
    interpret: 'expose 只能被调用一次',
    date: '2021-04-01',
  },
  {
    title: 'watch / watchEffect',
    icon: '',
    color: '#4daf1bc9',
    desc: '路是走出来的，而不是空想出来的。',
    interpret: '架构组',
    date: '2021-04-01',
  },
];
