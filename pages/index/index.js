// pages/index2/index2.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    market:[],
  },

  //中心仓库
  centralware: function(e){
    wx.navigateTo({
      url:'../centralware/centralware'
    })
  },

  //发布商品
  release: function(e){
    wx.navigateTo({
      url:'../release/release'
    })
  },
  //备货订单
  stockorder: function(e){
    wx.navigateTo({
      url:'../stockorder/stockorder'
    })
  },
  //销售订单
  order: function(e){
    wx.navigateTo({
      url:'../order/order'
    })
  },
  //在售商品
  selling: function(e){
    wx.navigateTo({
      url:'../selling/selling'
    })
  },

  //共享股东
  shareholders: function(e){
    wx.navigateTo({
      url:'../shareholders/shareholders'
    })
  },

  //我的库存
  myinventory: function(e){
    wx.navigateTo({
      url:'../myinventory/myinventory'
    })
  },
  //我的好友
  myfans: function(e){
    wx.navigateTo({
      url:'../myfans/myfans'
    })
  },
  //车架号
  vin: function(e){
    wx.navigateTo({
      url:'../vin/vin'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that=this;

    getApp().watch(function(v){//微信授权登录，及时获取数据
      that.DataInfo()
   })
  },
  DataInfo:function(){
    if (app.globalData.userInfo) {
      this.setData({
         userInfo: app.globalData.userInfo,
      })
       this.acquire()
       console.log('第一部')
   } else if (this.data.canIUse){
      console.log('第二部')
     if(app.userInfoReadyCallback){
      app.userInfoReadyCallback = res => {
         this.setData({
           userInfo: res,
         })
       }
       this.acquire()
       console.log('有用户信息')
     }else{
      wx.getSetting({
        success: res => {
          // 判断是否授权过
          if (res.authSetting['scope.userInfo']) {
            console.log('授权登录了')
          }else{
            var value = wx.getStorageSync('userinfo')
            if(value){
               var timestamp = Date.parse(new Date());  
               timestamp = timestamp / 1000;
               var time = timestamp-value.past_time
               console.log(time)
              //  console.log('有缓存，执行了')
               if(time>=app.globalData.past_time){
                  wx.removeStorageSync('userinfo')//清除userinfo缓存
                  wx.navigateTo({
                     url: '/pages/newlogin/newlogin'
                  });
               }else{
                  this.setData({
                    userInfo: value,
                  })
                  app.globalData.userInfo=value;
                  this.acquire()
               }
            }else{
               console.log('没有登录2')
               wx.navigateTo({
                  url: '/pages/newlogin/newlogin'
               });
            }
          } 
         }
       })
     }

   }
  },
  acquire:function(){
    var that =this;
    var data = {"id":this.data.userInfo.id}
    wx.request({
      url: app.globalData.url+'service.php/User/earnings',
      data:data,
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
        if(res.data.status=="200"){
           that.setData({
             market:res.data.arr
           })
        }else{
          if(res.data.msg){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
         }
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
    this.DataInfo()
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