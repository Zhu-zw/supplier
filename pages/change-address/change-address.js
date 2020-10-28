// pages/change-address/change-address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    list:{
      zhid:'',
      name:'',
      phone:'',
      address:'',
      dizhi:{},
      defaults:false
    },
    find:[]
  },
  bindRegionChange: function (e) {  // picker值发生改变都会触发该方法
    // console.log('picker发送选择改变，携带值为', e)
    let region  ="list.dizhi";
    this.setData({
      [region]: e.detail.value
    })
  },
  radiocon: function (e) {
    var check = this.data.list.defaults;
    // console.log(e)
      check=!check;
    let defaults  ="list.defaults";
    this.setData({
      [defaults]: check
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let zhid ="list.zhid"
    this.setData({
      [zhid]:app.globalData.userInfo.unionid
   })
  },
submit:function(){
  let _this=this;
  var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/;
  if(this.data.list.name=="" || this.data.list.phone=="" || this.data.list.dizhi==""|| this.data.list.address==""){
    wx.showModal({
      title: '提示',
      content: '存在空值！',
      showCancel:false,
    })
    return false;
  }
  if(!myreg.test(this.data.list.phone)){
    wx.showModal({
      title: '提示',
      content: '输入的手机号码不合法！',
      showCancel:false,
    })
    return false;
  }
  wx.request({
    url: 'https://m.tianyuauto.com/app/store/public/index.php/user/shaddress',
    data:_this.data.list,
    header: { "Content-Type": "application/x-www-form-urlencoded"},
    method:'POST',
    success: function(res) {
      if(res.data.status=="ok"){
        wx.showToast({
          title: res.data.error,
          icon: 'success',
          duration: 2000,
          success: function(ress) {
              _this.setData({
                find:res.data.data
              })
          }
        })
      }else{
        wx.showModal({
          title: '错误',
          content: res.data.error,
          showCancel:false,
        })
      }
    },
  })
},
value:function(e){
    let key=e.currentTarget.id;
    let name="list."+key;
    let val=e.detail.value;
    this.setData({
      [name]:val
   })
  //  console.log(this.data.list)
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
    var that = this;
    var pages = getCurrentPages(); 
    var prevPage = pages[pages.length - 2];   //上一页
    var t=prevPage.data.addres
    if(that.data.find!=0){
      var list=t.concat(that.data.find)
      prevPage.setData({
        addres: list
      })
    }
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