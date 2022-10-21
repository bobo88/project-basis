// pages/hot/hot.ts
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    loadingHK: false,
    appFreeList: [],
    appFreeListHK: [],
  },
  operateDetailsByIds (ids: string[], list: any, key: string) {
    let that = this;
    // ids: number[], topList
    // getDetailsByIds
    wx.request({
      url: `https://itunes.apple.com/cn/lookup?id=${ids}`,
      method: 'POST',
      success: function(res) {
        console.log(6666, res)
        let resData = res.data || {};
        let detailsObj = {};
        if (resData.resultCount > 0) {
          detailsObj = resData.results.reduce((prev, curr) => {
            prev[curr.trackId] = {
              averageUserRating: curr.averageUserRating,
              userRatingCount: curr.userRatingCount,
              description: curr.description,
              sellerName: curr.sellerName,
            };
            return prev;
          }, {}) || {};
        }

        const appList = list.map((sItem) => {
          return {
            ...detailsObj[sItem.id],
            ...sItem
          }
        });
        if (key === 'cn') {
          that.setData({
            appFreeList: appList
          });
          that.setData({
            loading: false,
          })
        } else {
          that.setData({
            appFreeListHK: appList
          });
          that.setData({
            loadingHK: false,
          })
        }
      }
    })
  },
  // 对原始数据进行过滤处理
  topDataFilter (entryData: any[]) {
    // @ts-ignore
    const rtn = {
      ids: [],
      list: []
    };
    // 数据瘦身
    rtn.list = entryData.map((item) => {
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
    return rtn;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // @ts-ignore
    let that = this;
    this.setData({
      loading: true
    });
    // 大陆
    wx.request({
      url: 'https://itunes.apple.com/cn/rss/topfreeapplications/limit=100/json',
      method: 'GET',
      success: function(res) {
        let resData: any = res.data;
        let simpleEntryData = that.topDataFilter(resData.feed.entry || []);
        that.operateDetailsByIds(simpleEntryData.ids, simpleEntryData.list, 'cn')
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  getHKAppData () {
    let that = this;
    this.setData({
      loadingHK: true
    });
    // 香港
    wx.request({
      url: 'https://itunes.apple.com/hk/rss/topfreeapplications/limit=100/json',
      method: 'GET',
      success: function(res) {
        let resData: any = res.data;
        let simpleEntryData = that.topDataFilter(resData.feed.entry || []);
        that.operateDetailsByIds(simpleEntryData.ids, simpleEntryData.list, 'hk')
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // console.log(12212121, this.data.appFreeListHK && this.data.appFreeListHK.length > 0)
    if (this.data.appFreeListHK && this.data.appFreeListHK.length > 0) {
      Toast.loading({
        message: '已加载完毕',
        forbidClick: false,
        loadingType: 'circular',
        duration: 1000,
        mask: false,
      });
      return false;
    } else {
      this.getHKAppData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})