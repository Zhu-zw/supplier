// pages/myfans/myfans.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //加载
    tip:'点击加载更多',
    show1:true,
    show2:false,
    //粉丝数据
    fanslist:[]
  },


  //加载更多
  jiazai: function(){
    this.setData({
      show1:(!this.data.show1),
      show2:(!this.data.show2),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.putaway();
  },
 /**
   * 数据请求
  */
 putaway:function(value){
  var that =this;
  var data = {"id":app.globalData.userInfo.id}
  wx.request({
    url: app.globalData.url+'service.php/User/friend',
    data:data,
    header: { "Content-Type": "application/x-www-form-urlencoded"},
    method:'POST',
    success: function(res) {
      if(res.data.status=="200"){
         that.setData({
          fanslist:res.data.list,
         })
      }else{
        that.setData({
          loading_tip:'暂无数据',
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
   },fail:function(){
     wx.showModal({
       title: '提示',
       showCancel: false,
       content: '可能网络不太好，请检查网络！',
       success: function () {
       }
     });
   },complete:function(){
     wx.hideLoading()
   }
 })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})