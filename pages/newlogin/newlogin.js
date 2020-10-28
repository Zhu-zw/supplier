// pages/newlogin/newlogin.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:{
    phone:'',
    password:'',
    error:'错误',
   },
   skipUrl:'pages/index/index'
  },

  //注册账号
  enroll: function(e){
    wx.navigateTo({
      url:'../enroll/enroll'
    })
  },
  //获取用户输入的值
  bindKeyInput: function (e) {
    var name = e.currentTarget.dataset.name
    var name="list."+name;
    this.setData({
      [name]: e.detail.value
    })
  },
  //绑定账号
  binding: function(e){
    wx.navigateTo({
      url:'../binding/binding'
    })
  },
    //微信授权登录
    getUserInfo: function(e) {
      if(e.detail.userInfo){
        wx.showLoading({
          title: '正在登录中',
        })
        app.getUserInfo('wx_login')
      }else{
         wx.hideLoading()
          wx.showToast({
            title: '取消登录',
            icon: 'none',
            duration: 1500
          })
      }
    },
  submit:function(){
    var data = this.data.list
    if(!data.phone){
      this.setData({error: '请输入账号'});return false;
    }
    if(!data.password){
      this.setData({error: '请输入密码'});return false;
    }
    wx.showLoading({title:'数据正在请求中...'})
    var that =this;
    wx.request({
      url: app.globalData.url+'service.php/user/login',
      data:data,
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
         if(res.data.status=="200"){

              wx.setStorageSync('userinfo',res.data.info)
              app.globalData.hasUserInfo=false
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '登陆成功！',
                success: function () {
                  wx.switchTab({
                    url: '/'+that.data.skipUrl
                  });
                }
              });
         }else{
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg,
          });
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();//获取页面栈
    let prevpage = pages[pages.length - 2]; //上一个页面对象
    let path = prevpage.route; //上一个页面路由地址
    if(!options){
    this.setData({
      skipUrl:path
    })
  }
    console.log(this.data.skipUrl)
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