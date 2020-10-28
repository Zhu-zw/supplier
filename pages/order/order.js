// pages/order/order.js
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
    //切换
    currentId: 'all',
    //导航栏数据
    section: [
      {name: '全部',typeId: 'all'}, 
      {name: '待付款',typeId: 'wait'}, 
      {name: '待发货',typeId: 'pay'},
      {name: '待收货',typeId: 'delivery'},
      {name: '完成',typeId: 'comments'},
    ],
    //全部订单数据
    goodslist: [],
    num:10,
    pro_find:'',
    loading_tip:''
  },

  //点击每个导航的点击事件
  handleTap: function(e) {
    let id = e.currentTarget.id;
    if(id){
      this.setData({
        currentId:id,
        pro_find:'',
        goodslist:[],
        loading_tip:''
      })
      wx.showLoading({title:'模板加载中'})
      this.putaway(id)
    }
  },

  //复制地址
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              duration:1000
            })
          }
        })
      }
    })
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
    wx.showLoading({title:'模板加载中'})
    this.putaway(this.data.currentId)
  },
  /**
   * 数据请求
  */
 putaway:function(value){
  var that =this;
  var data = {"num":this.data.num,"pro_find":this.data.pro_find,"type":value,"zhid":app.globalData.userInfo.id}
  wx.request({
    url: app.globalData.url+'service.php/Order/sell_order',
    data:data,
    header: { "Content-Type": "application/x-www-form-urlencoded"},
    method:'POST',
    success: function(res) {
      if(res.data.status=="200"){
         that.setData({
          goodslist:res.data.orderdata,
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