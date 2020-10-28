// pages/details/details.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',//商品id
    list:[],//产品信息
    medium:{},//适用车型
    burl:'',//服务器url地址
    unionid:'',
    status:true,
    //浮窗
    showView: true,

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:null,//用户信息
    hasUserInfo: false,//用于判断是否授权
  },
  //分享
    onShareAppMessage: function () {
    // console.log(this.data.list.cat_name)
        return {
          title: this.data.list.cat_name,
    
        }
       },
  //分享朋友圈
  onShareTimeline: function (res) {
    return {
      title: this.data.list.cat_name, // 自定义标题 (default:当前小程序名称)

    }
},

  /**
   * 生命周期函数--监听页面加载
   */
  imessage:function(e){
    wx.getSetting({
      success: res => {
        // 判断是否授权过
        if (res.authSetting['scope.userInfo']) {
          var data=e.currentTarget.dataset;
          if(!data.gysid && !data.pid){
             return
          }
           wx.navigateTo({
             url:'../chat-interface/chat-interface?gys='+data.gysid+"&pid="+data.pid,
           })
        }else{
          this.setData({
            hasUserInfo:true
          })
          return false;
        }
      }
    })
      },
    //授权登录
    getUserInfo: function(e) {
      if(e.detail.userInfo){
        wx.showLoading({
          title: '正在登录中',
        })
        app.getUserInfo()
      }else{
         wx.hideLoading()
      }
    },

  Collection:function(e){
    wx.getSetting({
      success: res => {
        // 判断是否授权过
        if (res.authSetting['scope.userInfo']) {
          if(!this.data.list.id){
            return;
          }
          var that = this;
          if(this.data.status){
            that.Collection_cl()
          }else{
            wx.showModal({
              title: '温馨提示',
              content: '确认取消收藏吗',
              success:function(res){
                if(res.confirm){
                  that.Collection_cl()
                }else{
                  console.log('继续收藏')
                  return;
                }
              }
            })
          }
        }else{
          this.setData({
            hasUserInfo:true
          })
          return false;
        }
      }
    })

  },

  /**   
     * 预览图片  
     */
    previewImg:function(e){
      const imgArr = e.target.dataset.src  //获取当前点击的 图片 url
      const current2 = e.currentTarget.dataset.previewurls
      // console.log(imgArr,current2);return;
      wx.previewImage({
        current:imgArr,  // 当前显示图片的http链接
        urls: current2  // 需要预览的图片http链接列表
      })
    },
  onLoad: function (options) {
    //监听app的hasUserInfo
    var that =this
  getApp().watch(function(v){
    that.setData({
     hasUserInfo:v
   })
 })
    var user = app.globalData.userInfo
    if(user){
      this.setData({
        zhid:app.globalData.userInfo.id
     })
    }else if(this.data.canIUse){
      app.userInfoReadyCallback = res => {
          this.setData({
            unionid: res.unionid,
          })
      }
    }
    this.setData({
      id: options.id,
      burl:app.globalData.burl,
   })
   
  //调用请求对应的详细数据
  this.detailed();
  },
//判断是否授权登录
auth_login:function(){
  if (app.globalData.userInfo) {
    console.log('1a')
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  } else if (this.data.canIUse){
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    console.log('2a')
    app.userInfoReadyCallback = res => {
      console.log('有值')
        this.setData({
          userInfo: res,
        })
    }
    if(!this.data.userInfo){
      console.log('没有值')
      this.setData({
        hasUserInfo:true
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
},
//请求对应的详细数据
detailed:function(){
  var loca =  app.globalData.address
  if(loca){
    var dz=loca.result.location
    var data={id:this.data.id,"zhid":this.data.zhid,"lat":dz.lat,"lng":dz.lng};
  }else{
    var data={id:this.data.id,"zhid":this.data.zhid,"lat":'',"lng":''};
  }

  var _this=this;
  wx.showLoading({title: app.globalData.load_data})
  wx.request({
    url: app.globalData.url+'/service.php/details/index',
    data:data,
    header: { "Content-Type": "application/x-www-form-urlencoded"},
    method:'POST',
    success: function(res) {
      if(res.data.status=="ok"){
        _this.setData({
          list: res.data.data,
          status:res.data.tip,
          medium: res.data.medium
       })
       wx.hideLoading()
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.error,
          showCancel:false,
        })
        wx.hideLoading()
      }
    },
  })
},

//去结算
getconfirm:function(){
   

    wx.getSetting({
      success: res => {
        // 判断是否授权过
        if (res.authSetting['scope.userInfo']) {
            var data=this.data.list.id;
            if(!data){
              return
            }
                  var json={}
            json['pro_id']=this.data.list.id
            json['number']=1
            var id=JSON.stringify(json);
            wx.navigateTo({
              url: '../commodity/commodity?id='+id,
            })
        }else{
          console.log('没有')
          this.setData({
            hasUserInfo:true
          })
          return false;
        }
      }
    })
},


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
//显示弹窗
// buttonTap: function() {
//   this.setData({
//     modalHidden: false
//   })
// },
//更换门店
// bandleChange(e){
//   // 1 获取单选框中的值
//   let gender = e.detail.value;
//   let offer=this.data.storelist[gender];
  // 2 把值赋值给 data 中的数据
//   let list="list.gys";
//   this.setData({
//     // gender:gender
//     gender:offer,
//     [list]:offer.zhid
    
//   })

// },
// //点击取消
// modalCandel: function() {
//   this.setData({
//     modalHidden: true
//   })
// },
// //点击确认
// modalConfirm: function() {
//   this.setData({
//     modalHidden: true
//   })
// },
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

})