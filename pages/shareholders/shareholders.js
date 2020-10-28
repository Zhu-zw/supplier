// pages/shareholders/shareholders.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputshow2: true,
    showView2: true,//设置共享股东
  
    //加载
    tip:'点击加载更多',
    show1:true,
    show2:false,

    showView: true, //修改保存
    isDisabled:false, //表示页面加载完成时disabled为启用状态

    number1: 3000, //入股资金
    number2: 30, //入股资金
    number3: 0, //累计分红
    
    //股东数据
    fanslist:[],
    loading_tip:'',
    search:'',
    list:{
      fund:'',
      ratio:'',
      zhid:'',
      m_id:''
    },
    money:0
  },

  bindKeyInput:function(e){
    var value = e.detail.value
    this.setData({
      search:value
    })
    console.log(this.data.search)
  },
  //加载更多
  jiazai: function() {
    this.setData({
      show1:(!this.data.show1),
      show2:(!this.data.show2),
    })
  },

  //设置共享股东
  // onChangeShowState1: function (e) {
  //   var that = this;
  //   //首先获取到表单提交上来的值,此时input的name是不同的,为a0,a1,a2,a3...
  //   var eValue = e.detail.value;
  //   //将value对象转为map
  //   var mapValue = this.objToStrMap(eValue);
  //   console.log(mapValue)
  //   //获取list,此处的目的为获取list的长度,并通过循环拼接需要取出的names列表
  //   var list = that.data.fanslist;
  //   //设置需要接收数据的数组
  //   var aList = [];
  //   var bList = [];
  //   for(var i = 0;i < list.length;i++){
  //      var ai = "fund" + i;
  //      var bi = "ratio" + i;
  //      var a = mapValue.get(ai);
  //      var b = mapValue.get(bi);
  //      aList.push({"fund":a,"ratio":b});
  //      bList.push(b);
  //   }
  //  //完事
  //  console.log(aList);
  //  console.log(bList);
  // },
  // objToStrMap:function(obj) {
  //   let strMap = new Map();
  //   for (let k of Object.keys(obj)) {
  //     strMap.set(k, obj[k]);
  //   }
  //   return strMap;
  // },
    //获取用户输入的值
    bindKeyValue: function (e) {
      var name = e.currentTarget.dataset.name
      var name="list."+name;
      this.setData({
        [name]: e.detail.value
      })
    },
    submit:function(e){
      var that = this;
      var list = this.data.list
      var zhid = e.currentTarget.dataset.zhid
      var gd_id = e.currentTarget.dataset.gd_id
      if(list.fund=="" || list.fund<=0){
        wx.showToast({
          title: '入股资金,不能小于0',
          icon: 'none',
          duration: 1500
        })
        return false
      }
      if(list.ratio=="" || list.ratio<=0){
        wx.showToast({
          title: '请输入分红比例',
          icon: 'none',
          duration: 1500
        })
        return false
      }else if(list.ratio>100){
        wx.showToast({
          title: '分红比例不能超过100%',
          icon: 'none',
          duration: 1500
        })
        return false
      }
      if(!gd_id){
      if(zhid==app.globalData.userInfo.id){
        wx.showToast({
          title: '不能把自己设置为股东',
          icon: 'none',
          duration: 1500
        })
        return false
      }
     }
      if(!gd_id){
        list['zhid']=zhid;
        list['m_id']=app.globalData.userInfo.id;
        var url=app.globalData.url+'service.php/User/add_shares'
      }else{
        list['gd_id']=gd_id;
        var url=app.globalData.url+'service.php/User/amend_shares'
      }

      wx.showLoading({title:'数据请求中'})
      wx.request({
        url: url,
        data:list,
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
             fanslist:[],
             search:'',
             loading_tip:'',
             list:[]
           })
           that.acquire();
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
    },
  //取消
  cancel: function (e) {
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id
    if(!id){
      return false;
    }
    wx.showModal({
      title: '温馨提示',
      content: '确认取消共享股东吗',
      success:function(res){
        if(res.confirm){
          wx.showLoading({title:'数据请求中'})
          wx.request({
            url: app.globalData.url+'service.php/User/cancel',
            data:{"id":id},
            header: { "Content-Type": "application/x-www-form-urlencoded"},
            method:'POST',
            success: function(res) {
              if(res.data.status=="200"){
               that.setData({
                 fanslist:[],
                 search:'',
                 loading_tip:'',
                 list:[]
               })
               that.acquire();
               wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1500
              })
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
          console.log('继续关注')
        }
      }
    })
  },

  search:function(){
    this.setData({
      fanslist:[]
    })
    this.acquire();
  },
  acquire:function(){
    var that =this;
    that.setData({
      loading_tip:'',
    })
    var data = {"id":app.globalData.userInfo.id}
    if(this.data.search){
      data['search']=this.data.search
    }
    wx.showLoading({title:'模板加载中'})
    wx.request({
      url: app.globalData.url+'service.php/User/shares',
      data:data,
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
        if(res.data.status=="200"){
           that.setData({
            fanslist:res.data.list,
            money:res.data.money
           })
        }else{
          that.setData({
            loading_tip:'暂无数据',
          })
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
       wx.hideLoading()
     }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.acquire()
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