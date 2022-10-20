// index.ts
import Toast from '@vant/weapp/toast/toast';
// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    logo: '/images/yb.png',
    appList: [],
    appListHK: [],
    loading: false,
    loadingHK: false,
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
      loadingHK: true
    });
    wx.request({
      url: 'https://itunes.apple.com/cn/rss/topgrossingapplications/limit=20/json',
      method: 'GET',
      success: function(res) {
        let resData: any = res.data;
        that.setData({
          appList: resData.feed.entry
        });
        that.setData({
          loading: false,
        })
      }
    });
    wx.request({
      url: 'https://itunes.apple.com/hk/rss/topgrossingapplications/limit=20/json',
      method: 'GET',
      success: function(res) {
        let resData: any = res.data;
        that.setData({
          appListHK: resData.feed.entry
        });
        that.setData({
          loadingHK: false,
        })
      }
    })
  },
})
