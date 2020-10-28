// pages/selling/selling.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //弹框
    popup: true,
    //切换
    currentId: '2',
    section: [
      {name: '出售中',typeId: '2'}, 
      {name: '已下架',typeId: '3'}, 
    ],
    //字母数据
    alphabet:[
      'A','B','C','D','E','F','G','H','I',
      'J','K','L','M','N','O','P','Q','R',
      'S','T','U','V','W','X','Y','Z'
    ],
    //在售商品数据
    listData: [],
    num:'10',//每页显示10条
    pro_find:'',//保存每页数据的最后一条
    brandlist:[],//车型品牌
    batchIds:[],//选中的id
    type:'',//条件类型
    val:'',//条件值
    loading_tip:'',//数据加载中提示
  },

//在售全选
selectall: function (e) {
  console.log(e)
    var that = this;
    var arr = [];   //存放选中id的数组
    for (let i = 0; i < that.data.listData.length; i++) {

      that.data.listData[i].checked = (!that.data.select_all)

      if (that.data.listData[i].checked == true){
        // 全选获取选中的值
        arr = arr.concat(that.data.listData[i].id.toString());
      }
    }
  console.log(arr)
    that.setData({
      listData: that.data.listData,
      select_all: (!that.data.select_all),
      batchIds:arr
    })
  },

  // 在售单选
  checkboxChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      batchIds: e.detail.value  //单个选中的值
    })
  },

  /* 隐藏弹窗 */
  hidePopup(flag = true) {
    this.setData({
        "popup": flag
    });
  },
  /* 显示弹窗 */
  showPopup() {
    this.hidePopup(false);
  },
  toScrollView(e) {
    const {
      selectedSub
    } = this.data
    const {
      index
    } = e.currentTarget.dataset
    let right_ = 0
    if (index > 3) {
      right_ = (index - 3) * 30 // 左边侧栏item高度为50，可以根据自己的item高度设置
    }
    this.setData({
      selectedSub: index,
      toView: `position${index}`,
      scrollTopRight: right_
    })
  },

  //点击每个导航的点击事件
  handleTap: function(e) {
    let id = e.currentTarget.id;
    wx.showLoading({title:'模板加载中'})
    if(id){
      this.setData({
        currentId:id,
        listData:[],
        pro_find:'',
        batchIds:[],
        type:'',
        val:''
      })
      this.putaway(id)
    }
  },

  //修改跳转
  release: function(e){
    wx.switchTab({
      url:'../release/release'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url:app.globalData.url,
      burl:app.globalData.burl
    })
    wx.showLoading({title:'模板加载中'})
    this.putaway(this.data.currentId)
  },
  /**
   * 数据请求
  */
  putaway:function(value){
    var audit = value;
    var that =this;
    var data = {"num":this.data.num,"pro_find":this.data.pro_find,"audit":audit,"zhid":app.globalData.userInfo.id}
    if(this.data.type && this.data.val){
      data['type']=this.data.type
      data['val']=this.data.val
     }
    wx.request({
      url: app.globalData.url+'service.php/Commodity/on_sale',
      data:data,
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
        if(res.data.status=="200"){
           that.setData({
            brandlist:res.data.model,
            listData:res.data.pro,
            pro_find:res.data.pro_find
           })
        }else{
          that.setData({
            loading_tip:'暂无数据'
          })
         console.log(res.data.msg)
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
   * 上架的数据删除
  */
 s_remove:function(){
   var pitch=this.data.batchIds;
   console.log(pitch)
   if(pitch.length>0){
    var that =this;
    wx.showLoading({title:'数据请求中'})
    wx.request({
      url: app.globalData.url+'service.php/Commodity/pro_del',
      data:{"pro_id":pitch,"zhid":app.globalData.userInfo.id},
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
        if(res.data.status=="200"){
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '删除成功',
            success: function () {
              that.setData({
                listData:[],
                pro_find:'',
                batchIds:[],
              })
              that.putaway(that.data.currentId)
            }
          });
        }else{
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
   }else{
    wx.showToast({
      title: '请选择要删除的商品',
      icon: 'none',
        duration: 1500
    })
   }
 },
  /**
   * 下架的商品
  */
 sold_out:function(){
  var audit=this.data.currentId
  if(audit==2){
     audit=3
  }else if(audit==3){
     audit=2
  }else{
    audit=2
  }
  var pitch=this.data.batchIds;
  if(pitch.length>0){
   var that =this;
   wx.showLoading({title:'数据请求中'})
   wx.request({
     url: app.globalData.url+'service.php/Commodity/pro_onoff',
     data:{"pro_id":pitch,"zhid":app.globalData.userInfo.id,'audit':audit},
     header: { "Content-Type": "application/x-www-form-urlencoded"},
     method:'POST',
     success: function(res) {
       if(res.data.status=="200"){
         wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 1500
        })
        that.setData({
          listData:[],
          pro_find:'',
          batchIds:[],
        })
        that.putaway(that.data.currentId)
       }else{
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
  }else{
   wx.showToast({
     title: '请选择要下架的商品',
     icon: 'none',
       duration: 1500
   })
  }
},
  /**
   * 获取搜索的值
  */
  bindKeyInput:function(e){
    var value = e.detail.value
    this.setData({
      type:'search',
      val:value
    })
  },
  /**
   * 点击搜索触发
  */
 search:function(){
  wx.showLoading({title:'模板加载中'})
  this.setData({
    listData:[],
    pro_find:'',
    batchIds:[],
  })
  this.putaway(this.data.currentId)
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