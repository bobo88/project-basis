// pages/hot/hot.ts
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    articlesList: [],
  },

  clickAppItem(e: any) {
    let URL = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail/detail?URL=${URL}`
    })
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