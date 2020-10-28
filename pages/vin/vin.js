// pages/vin/vin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'', //输入框内容
    picshow: true, //图片
  },

  //相册
  changeAvatar:function(){
    const _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFilePaths[0];
        _this.setData({
          personImage: tempFilePath
        })
        wx.uploadFile({
           url: config.UPLOADFILE, //图片上传至开发服务器接口
           filePath: tempFilePath,
           name: 'file',
           formData: {},
           success(res) {
             const data = res.data;
             console.log(data);
           }
         })   
      }
    })
  },
  //清空input
  Cancel(){
    this.setData({
      inputValue: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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