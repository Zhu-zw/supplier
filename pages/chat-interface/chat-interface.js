// pages/chat-interface/chat-interface.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    burl:'',
    list:{
      message:'',
      unionid:"",
      recevie:'',
      pid:'',
      type:1,
      zhid:''
    },

    xxlist:[],
    xximg:[],
    user_id:"",
    start:'',
    showView: false,//顶部动画
    scrollTop: 0,//控制上滑距离
    windowHeight: 0,//页面高度
    last_id:0,//最后一条记录的id
    num:12,//每页显示多少条
    hasUserInfo:false,
    userInfo:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    submit:false,
    temp:false,
    temp_name:'',
    circlehiden:true
  },
//获取输入的内容
content:function(e){
  this.setData({
     ['list.message']:e.detail.value
  })
},
upload:function(even,index="false"){
  wx.showLoading({title: '照片正在上传'})
  var t=this;
  wx.chooseImage({
    count: 6, //最多可以选择的图片张数，默认9
    sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
    sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
    success: function(res) {
      wx.uploadFile({
        url: app.globalData.url+"autop.php/inquiry/upload", //仅为示例，非真实的接口地址
        filePath: res.tempFilePaths[0],
        name: 'file',//示例，使用顺序给文件命名
        success:function(e){
            e.data=JSON.parse(e.data);
            let data_message="list.message"
            let data_typee="list.type"
            t.setData({
              [data_message]:'app/store/public/'+e.data.filePath,
              [data_typee]:2
            })
            t.sendImessage()
            wx.hideLoading()
        },
        fail:function(e){
          wx.hideLoading()
        },
        complete:function(e){
          wx.hideLoading()
        }
      })
    },
    fail:function(e){
      wx.hideLoading()
    }
  })
},


sendImessage:function(){
if(!this.data.list.message){
  wx.showToast({
    title: '不能发送空白消息！', // 标题
    icon: 'none',  // 图标类型，默认success
    duration: 1500  // 提示窗停留时间，默认1500ms
  })
  return false;
}
 var t=this;
 var data=t.data.list;
 //发送消息，到最后一行sendImessage
 var len = this.data.xxlist.length //遍历的数组的长度
 if(data.type!=2){
 this.setData({
   scrollTop: 375 * len // 这里我们的单对话区域最高375
 });
 }
 this.setData({
  temp:true,
  temp_name:this.data.list.message,
})
t.pageScrollToBottom();
 wx.request({
   url: app.globalData.url+'autop.php/imessage/send',
   data:data,
   header: { "Content-Type": "application/x-www-form-urlencoded"},
   method:'POST',
   success: function(res) {
     if(res.data.status=="ok"){
       var key=t.data.xxlist.concat(res.data.xx)
       t.setData({
          xxlist:key,
          temp:false,
          ['list.message']:'',
          ['list.type']:1
      })
     }else{
       console.log(res.data.error);
     }
   },
 })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that =this
    getApp().watch(function(v){
     wx.showLoading({title: app.globalData.load_data})
     that.imessage(options)
   })
    this.setData({
      url: app.globalData.url,
      burl: app.globalData.burl,
    })
    //获取用户的值
    if (app.globalData.userInfo) {
      this.setData({
        ['list.zhid']:app.globalData.userInfo.id
      })
      wx.showLoading({title: app.globalData.load_data})
      this.imessage(options)
   } else if (this.data.canIUse){
     if(app.userInfoReadyCallback){
      app.userInfoReadyCallback = res => {
         this.setData({
           ['list.zhid']: res,
         })
       }
       wx.showLoading({title: app.globalData.load_data})
       this.imessage(options)
     }else{
       app.getUserInfo()
     }

   }
  },

imessage:function(data_){
  var data=data_
  var t=this;
  this.setData({
     ['list.recevie']:data.gys,
     ['list.pid']:data.pid,
     ['list.zhid']:this.data.list.zhid
  })
  data['zhid']=this.data.list.zhid;
  wx.request({
    url: this.data.url+'service.php/imessage/index',
    data:data,
    header: { "Content-Type": "application/x-www-form-urlencoded"},
    method:'POST',
    success: function(res) {
      if(res.data.status=="ok"){
         t.setData({
             xxlist:res.data.list,
             user_id:res.data.user_id,
             last_id:res.data.last
         })
         t.pageScrollToBottom();
         if(data.message_pid){
          t.setData({
            ['list.recevie']:res.data.recevie,
            ['list.pid']:res.data.pid
          })
          var json={'send_id':t.data.user_id,'receive_id':res.data.recevie};
        }else{
          var json={'send_id':t.data.user_id,'receive_id':data.gys};
        }
         t.data.start=setInterval(function() {
           
          wx.request({
            url: app.globalData.url+'autop.php/imessage/xx_find',
            data:json,
            header: { "Content-Type": "application/x-www-form-urlencoded"},
            method:'POST',
            success: function(ress) { 
                  if(ress.data.status!="fail"){
                    t.pageScrollToBottom();
                    var key=t.data.xxlist.concat(ress.data.list)
                    t.setData({
                       xxlist:key
                   })
                  }
            },
          })
        },1000);
      }else if(res.data.status="no_gold"){
        t.setData({
          money_:true
        })
        wx.showModal({
          title: '提示',
          showCancel: true,
          cancelText:"取消",//默认是“取消”
          confirmText:"充值",//默认是“确定”
          // confirmColor: 'skyblue',//确定文字的颜色
          content: '余额不足请充值',
          success: function (res) {
            if (res.cancel) {
              wx.switchTab({
                url:'../enquiry/enquiry'
              })
           }else{
            wx.redirectTo({
              url:'../recharge/recharge'
            })
           }

          }
        });
      }else{
        console.log(res.data.error);
      }
      t.setData({
        xximg:res.data.img,
        ['list.recevie']:res.data.recevie,
        ['list.pid']:res.data.pid
      })
      wx.setNavigationBarTitle({
        title: res.data.title
      })
    },fail:f=>{
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '可能网络不太好，请重试！',
        success: function () {
          wx.switchTab({
            url:'../enquiry/enquiry'
          })
        }
      });
  },complete:f=>{
    wx.hideLoading()
  }
  })
},

  /**   
     * 预览图片  
     */
    previewImg:function(e){
      const imgArr = e.target.dataset.src  //获取当前点击的 图片 url
      const current2 = [imgArr]
      // console.log(imgArr,current2);return;
      wx.previewImage({
        current:imgArr,  // 当前显示图片的http链接
        urls: current2  // 需要预览的图片http链接列表
      })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // var height = wx.getSystemInfoSync().windowHeight;
    // this.setData({
    //   windowHeight: height
    // })
    
  },
 // 获取容器高度，使页面滚动到容器底部
 pageScrollToBottom: function() {
  var that = this;
  var height = wx.getSystemInfoSync().windowHeight;
  wx.createSelectorQuery().select('#scrollview').boundingClientRect(function(rect) {
    if (rect){
      that.setData({
        scrollTop: rect.height*9
      })
    }
  }).exec()
},


  //到顶
  scrolltop: function(){
    if(!this.data.submit){
    var that = this;
    console.log("滑到顶部了")
    that.setData({
      showView: true,
      submit:true
    })
    this.AskData();
  }else{
    console.log('正在请求')
  }
  },
  AskData:function(){
    
    var that =this;
    var json={'send_id':this.data.user_id,'receive_id':this.data.list.recevie,'last_id':this.data.last_id,'num':this.data.num};
    wx.request({
      url: app.globalData.url+'autop.php/imessage/fy_data',
      data:json,
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(ress) { 
        if(ress.data.status=="ok"){
          var value =that.data.xxlist;
          var value_ = ress.data.list;
          for(var i in value_){
            value.unshift(value_[i])
          }
          that.setData({
             xxlist:value,
             last_id:ress.data.last_id,
             showView: false,
             submit:false
         })
        }else{
          that.setData({
            showView: false,
            submit:true
          })
        }
      },
    })
  },
/**   
     * 预览图片  
     */
    previewImage:function(e){
      const current = e.target.dataset.src  //获取当前点击的 图片 url
      console.log(current)
      var imgArr = [current];   
      wx.previewImage({
        current,  // 当前显示图片的http链接
        urls: imgArr  // 需要预览的图片http链接列表
      })
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
    var t=this;
    clearInterval(t.data.start)
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