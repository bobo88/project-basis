// pages/req/req.ts
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
  // 对原始数据进行过滤处理
  topDataFilter (resData: any[]) {
    // @ts-ignore
    // let topDataList = await res.then((data: PlResponsePromise) => {
    //   return data.feed?.entry || []
    // });
    const rtn = {
      ids: [],
      list: []
    };
    // 数据瘦身
    rtn.list = resData.map((item) => {
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // @ts-ignore
    let that = this;
    this.setData({
      loading: true,
      loadingHK: true
    });
    wx.request({
      url: 'https://itunes.apple.com/cn/rss/topfreeapplications/limit=100/json',
      method: 'GET',
      success: function(res) {
        let resData: any = res.data;
        that.setData({
          appFreeList: resData.feed.entry
        });
        that.setData({
          loading: false,
        })
      }
    })
    // 香港
    wx.request({
      url: 'https://itunes.apple.com/hk/rss/topfreeapplications/limit=100/json',
      method: 'GET',
      success: function(res) {
        let resData: any = res.data;
        that.setData({
          appFreeListHK: resData.feed.entry
        });
        that.setData({
          loadingHK: false,
        })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})