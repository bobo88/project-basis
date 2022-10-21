// index.ts
import Toast from '@vant/weapp/toast/toast';
// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    logo: '/images/yb.png',
    articlesList: [],
    loading: false,
    activeNames: ['1'],
  },
  onChange(event: any) {
    this.setData({
      activeNames: event.detail,
    });
  },
  clickAppItem(e: any) {
    let URL = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail/detail?URL=${URL}`
    })
  },
  onLoad() {
    // Toast.loading({
    //   message: '加载中...',
    //   forbidClick: false,
    //   loadingType: 'circular',
    //   duration: 1000,
    //   mask: false,
    // });
    // @ts-ignore
    let that = this;
    this.setData({
      loading: true,
    });
    wx.request({
      url: 'https://ycy88.com/apis/getAllArticles',
      method: 'GET',
      success: function(res) {
        that.setData({
          articlesList: res.data
        });
        that.setData({
          loading: false,
        })
      }
    });
  },
})
