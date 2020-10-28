// pages/enquiry/enquiry.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //汽车数据
    brandlist:[],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:null,//用户信息
    hasUserInfo: false,//用于判断是否授权
    selectedSub: 0, // 选中的分类
    loadingHidden: true,//加载中
    end:0,
    num:12,
    enqlist:[],
    tip:'正在加载',
    xj_dz:'', //地址条件
    xj_cx:'',//车型条件
    //弹框
    popup: true,
    model_:'车型',
    //字母数据
    alphabet:[
      'A','B','C','D','E','F','G','H','I',
      'J','K','L','M','N','O','P','Q','R',
      'S','T','U','V','W','X','Y','Z'
    ],
    submit:false,
    realScrollTop: 0,//页面滚动距离
　　driveHeight:0,　　//屏幕高度可初始化设置
    circlehiden:true,
    region: ['广东省', '广州市', '越秀区'],
  },

  scroll(e){
    if(e.detail.scrollTop > this.data.realScrollTop){
        this.setData({
            realScrollTop: e.detail.scrollTop
        });
    }
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

  //充值
  inquiry: function(e){
    var user_id = e.currentTarget.dataset.zhid;
    var inquiry = e.currentTarget.dataset.xj_id;
    wx.navigateTo({
      url:'../chat-interface/chat-interface?xj_user_id='+user_id+'&inquiry='+inquiry
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
    burl: app.globalData.burl,
    url: app.globalData.url,
  })
      // 获取设备信息
      wx.getSystemInfo({
        success: res => {
          this.setData({
            driveHeight: res.windowHeight,
          })
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
   if (app.globalData.userInfo) {
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo:false,
    })
  } else if (this.data.canIUse){
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    console.log('2a')
    app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res,
          hasUserInfo:false,
        })
    }
  } else {
    console.log('3a')
    // 在没有 open-type=getUserInfo 版本的兼容处理
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo:true
        })
      }
    })
  }
  wx.showLoading({title: app.globalData.load_data})
  this.obtain()
  },
  obtain:function(){
    var data={};
    var that=this;
    data['end']=this.data.end
    data['num']=this.data.num
    if(this.data.xj_dz){
      data['address']=this.data.xj_dz
    }
    if(this.data.xj_cx){
      data['model']=this.data.xj_cx
    }
    wx.request({
      url:app.globalData.url+"autop.php/Inquiry/inquiry_list",
      data:data,
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
        if(res.data.status=="ok"){
           var list=that.data.enqlist.concat(res.data.list);
           wx.hideLoading()
            that.setData({
              brandlist:res.data.model,
              enqlist:list,
              end:res.data.last_id,
              submit:false
            })
          }else{
          wx.hideLoading()
            that.setData({
              tip:res.data.error,
              submit:true,
              circlehiden:false,
              loadingHidden:false
            })
          }
      },fail:f=>{
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '可能网络不太好，请重试！',
          success: function () {
            that.obtain();
          }
        });
    }
  })
  },
    /**   
     * 预览图片  
     */
    previewImg:function(e){
      const imgArr = e.target.dataset.src  //获取当前点击的 图片 url
      const current2 = [imgArr]  //获取当前点击的 图片 url
      // const current2 = e.currentTarget.dataset.previewurls
      // console.log(imgArr,current2);return;
      wx.previewImage({
        current:imgArr,  // 当前显示图片的http链接
        urls: current2  // 需要预览的图片http链接列表
      })
    },
  //车型搜索
  handleTap:function(e){
    wx.showLoading({title: app.globalData.load_data})
     var data = e.currentTarget.dataset
     this.setData({
      xj_cx:data.val,
      enqlist:[],
      end:0,
      model_:data.value
     })
     this.hidePopup(true);
     this.obtain();
  },
  //地址搜索
  bindRegionChange: function (e) {
    wx.showLoading({title: app.globalData.load_data})
    this.setData({
      xj_dz: e.detail.value[0],
      enqlist:[],
      end:0,
    })
    this.obtain();
  },
  //全部
  whole:function(){
    wx.showLoading({title: app.globalData.load_data})
    this.setData({
      xj_dz: '',
      xj_cx: '',
      enqlist:[],
      end:0,
    })
    this.obtain();
  },
  //到底
  scrollBottom: function() {
    if(!this.data.submit){
    this.setData({
      loadingHidden: false,
      submit:true
    });
    var that = this;
    this.obtain();
  }
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      xj_dz: '',
      xj_cx: '',
      enqlist:[],
      end:0,
    })
    this.obtain();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //分享
    onShareAppMessage: function () {
        return {
          title: '汽配供应商询价订单',
    
        }
       },
  //分享朋友圈
  onShareTimeline: function (res) {
    return {
      title: '汽配供应商询价订单',
    }
},
})