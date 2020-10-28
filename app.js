//app.js
App({
/**
 * 
 */
watch: function (method) {
  var obj = this.globalData;
  Object.defineProperty(obj, "hasUserInfo", {  //这里的 data 对应 上面 globalData 中的 data
    configurable: true,
    enumerable: true,
    set: function (value) {  //动态赋值，传递对象，为 globalData 中对应变量赋值
      this._showPictureDetail = value.showPictureDetail;
      this._pictureTime = value.pictureTime;
      this._pictureAddress = value.pictureAddress;
      method(value);
    },
    get: function () {  //获取全局变量值，直接返回全部
      return this.globalData;
    }
  })
},
onLaunch: function (options) {
  const updateManager = wx.getUpdateManager()

  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log(res.hasUpdate)
  })
  
  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
  
  updateManager.onUpdateFailed(function () {
    // 新版本下载失败
    wx.showToast({
      title: '新版本下载失败',
      icon: 'none',
      duration: 1500
    })
  })
  this.getUserInfo()//更新数据
},
  //获取用户相关信息
  getUserInfo:function(options){
    if(options=="without"){
      this.globalData.without=options
    }
    if(options=="wx_login"){
      this.globalData.wx_login=options
    }
    var _this =this;
    wx.getSetting({
      success: res => {
        // 判断是否授权过
        if (res.authSetting['scope.userInfo']) {
          _this.loginCode();
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: ress => {
              let data={"language":ress.userInfo.language,"avatarUrl":ress.userInfo.avatarUrl,"gender":ress.userInfo.gender,"nickName":ress.userInfo.nickName,"encryptedData":ress.encryptedData,"iv":ress.iv}
              console.log('授权过了')
              _this.if_session_key(data);
            }
          })
        }else{
          var value = wx.getStorageSync('userinfo')
          if(value){
             var timestamp = Date.parse(new Date());  
             timestamp = timestamp / 1000;
             var time = timestamp-value.past_time
             console.log('有缓存，执行了')
             console.log(time)
             if(time>=this.globalData.past_time){
                wx.removeStorageSync('userinfo')//清除userinfo缓存
                wx.navigateTo({
                   url: '/pages/newlogin/newlogin'
                });
             }else{
                console.log('fz')
                _this.globalData.userInfo=value;
                _this.globalData.hasUserInfo=false
             }
          }
          //else{
          //    console.log('没有登录1')
          //    if(this.globalData.submit_z){
          //      this.globalData.submit_z=false;
          //      wx.navigateTo({
          //        url: '/pages/newlogin/newlogin'
          //      });
          //    }
          //    return false;
          // }
        } 
      },fail:f=>
      {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '可能网络不太好，请检查网络！',
          success: function () {
            wx.navigateTo({
              url: '/pages/newlogin/newlogin'
           });
          }
        });
      }
    })
  },

    //检查session_key是否过期
    if_session_key:function(data){
      var _this = this
      //检查session_key是否过期
      wx.checkSession({
        success () {
          console.log('session_key ok')
          _this.getUnionId(data)
        },
        fail () {
          // session_key 已经失效，需要重新执行登录流程
          console.log('session_key 已经失效')
          wx.removeStorageSync('userinfo')//清除userinfo缓存
          _this.loginCode();
        }
      })
    },

    loginCode:function(){
      var _this = this
        // 登录
        wx.login({
          success: res => {
            if(res.code){
              _this.globalData.code=res.code
            }else{
              _this.if_session_key();
              console.log('code值获取不到')
            }
          },fail:f=>
          {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '可能网络不太好，请检查网络！',
              success: function () {
              }
            });
          }
        })
    },

  //获取openId, sessionKey, unionId
  getUnionId: function(e) {
    let data={"code":this.globalData.code,"encryptedData":e.encryptedData,"iv":e.iv}
    let _this=this;
    var value = wx.getStorageSync('userinfo')
    if(value){//判断是否有缓存
      //授权了，但不是注册账号，也不是门店会员
      if(_this.globalData.without=='' && value.types!=2){
        wx.navigateTo({
          url: '/pages/enroll/enroll'
        });
      }
      //点击微信登录，不是门店
      if(_this.globalData.wx_login!='' && value.types!=2){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '你不是门店，请注册开通！',
          success: function () {
            wx.navigateTo({
              url: '/pages/enroll/enroll'
            });
          }
        });
      } 
     _this.globalData.userInfo=value;
     _this.globalData.hasUserInfo=false
     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
     // 所以此处加入 callback 以防止这种情况
     if (_this.userInfoReadyCallback) {
       _this.userInfoReadyCallback(value)
     }
     //微信登录，是门店
     if(_this.globalData.wx_login!='' && value.types==2){
      wx.switchTab({
        url: '/pages/index/index'
      });
    } 
    console.log('使用缓存')
    wx.hideLoading()
    }else{
      console.log('没有缓存')
      //查询数据库是否有该用户，没有就添加
      wx.request({
        url: _this.globalData.url+'service.php/User/code',
        data:data,
        header: { "Content-Type": "application/x-www-form-urlencoded"},
        method:'POST',
        success: function(res) {
          if(res.data.errcode){
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none',
              duration: 2000
            })
            return;
          }
          let user = {"language":e.language,"avatarUrl":e.avatarUrl,"gender":e.gender,"nickName":e.nickName,"unionid":res.data.unionid,"openid":res.data.openid}
          //查询数据库是否有该用户
          if(user.unionid){
            _this.member(user);
          }
        },
      })
    }
  },
    //查数据库是否有该用户，没有就添加
    member:function(data){
      let _this=this;
      let list={"openid":data.openid,"unionid":data.unionid,"nickName":data.nickName,"gender":data.gender,"language":data.language,"avatarUrl":data.avatarUrl}
      wx.request({
        url: _this.globalData.url+'service.php/User/wx_user',
        data:list,
        header: { "Content-Type": "application/x-www-form-urlencoded"},
        method:'POST',
        success: function(res) {
          if(res.data.status=="ok"){
            wx.hideLoading()
            var result = res.data;
            list['id']=result.id
            list['types']=result.types
            list['address']=result.dizhi
            //授权了，但不是注册账号，也不是门店会员
            if(_this.globalData.without=='' && list.types!=2){
              wx.navigateTo({
                url: '/pages/enroll/enroll'
              });
            }

            //点击微信登录，不是门店
            if(_this.globalData.wx_login!='' && list.types!=2){
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '你不是门店，请注册开通！',
                success: function () {
                  wx.navigateTo({
                    url: '/pages/enroll/enroll'
                  });
                }
              });
            }

          _this.globalData.userInfo=list
          if (_this.userInfoReadyCallback) {
              _this.userInfoReadyCallback(list)
            }
           wx.setStorageSync('userinfo',list)//设置缓存
           _this.globalData.hasUserInfo=false
            
            //微信登录，是门店
            if(_this.globalData.wx_login!='' && list.types==2){
              wx.switchTab({
                url: '/pages/index/index'
              });
            } 
            console.log('请求成功')
          }else{
            wx.hideLoading()
            console.log(res.data.error)
          }
        },fail:f=>
        {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '可能网络不太好，请重试！',
            success: function () {
            }
          });
        }
      })
    },

  globalData: {
    url: "https://m.tianyuauto.com/app/store/public/",//服务器请求地址
    burl:"https://m.tianyuauto.com",//商品的照片地址
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code:'',
    without:'',
    wx_login:'',
    load_data:'数据正在加载中...',
    // submit_z:true
    past_time:36000//登录过期时间
  }
})