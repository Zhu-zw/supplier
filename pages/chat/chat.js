// pages/chat/chat.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    burl:'',
    hasUserInfo:false,
    userInfo:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loading_tip:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    getApp().watch(function(v){
      that.DataInfo()
   })
    this.setData({
      burl: app.globalData.burl,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  DataInfo:function(){
    if (app.globalData.userInfo) {
      this.setData({
         userInfo: app.globalData.userInfo,
         loading_tip:''
      })
       this.chat_list();
   } else if (this.data.canIUse){
     if(app.userInfoReadyCallback){
      app.userInfoReadyCallback = res => {
         this.setData({
           loading_tip:'',
           userInfo: res,
         })
       }
       this.chat_list();
     }else{
       app.getUserInfo()
     }

   }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   this.DataInfo()
  },
  chat_list:function(){
    var t=this;
    wx.showLoading({title: app.globalData.load_data})
    wx.request({
      url: app.globalData.url+'service.php/imessage/imessage_list',
      data:{'unionid':this.data.userInfo.unionid},
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
        if(res.data.status=="ok"){
          wx.hideLoading()
            t.setData({
               list:res.data.list
            })
            // console.log(t.data.list);
        }else{
          wx.hideLoading()
          t.setData({
            loading_tip:'暂无消息!',
         })
          console.log(res.data.error)
        }
      },
    })
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
})