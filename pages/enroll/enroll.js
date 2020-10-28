// pages/enroll/enroll.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popup4:true,//经营车型弹框
    cx_name: '点击选择（多选）',//提示文字
    list:{
      store:'',
      region:'',
      address:'',
      name:'',
      phone:'',
      password:'',
      pz:'',
      product:'',
      cx:''
    },
    itemspl:[
      {value: '1', name: '原厂件'},
      {value: '2', name: '品牌件'},
      {value: '3', name: '拆车件'},
    ],
    //经营车型数据
    listData: [],
    jiage: 179,//平台服务费
    find:[],
    sum:[], //价格
    // customItem: '全部',//自定义的项
    disabled:false,//提交disabled
    error: '',
    if_sup:true,//加载经营车型
    userInfo:null,//用户信息
  },
    //获取用户输入的值
  bindKeyInput: function (e) {
    var name = e.currentTarget.dataset.name
    var name="list."+name;
    this.setData({
      [name]: e.detail.value
    })
  },
    //授权登录
    getUserInfo: function(e) {
      var that=this;
      if(e.detail.userInfo){
        wx.showLoading({
          title: '正在登录中',
        })
        app.getUserInfo('without')
        // wx.getSetting({
        //   success: res => {
        //     // 判断是否授权过
        //     if (res.authSetting['scope.userInfo']) {
        //        console.log('授权过了')
        //        that.submit()
        //     }else{
        //       console.log('没有授权过')
              
        //     }
        //   }
        // })
      }else{
         wx.hideLoading()
         wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请授权登录，否则无法进行注册',
          success: function () {
         }
       });
      }
    },
  submit:function(){
    var that=this;
    var data=this.data.list;
      if(!data.store){
        this.toptips('请输入门店名称！');
        return false;
     }
     if(!data.region.length){
       this.toptips('请选择地址！');
       return false;
     }
     if(!data.address){
       this.toptips('请输入详细地址！');
       return false;
     }
     if(!data.name){
       this.toptips('请输入联系人名字！');
       return false;
     }
     if(!data.product){
       this.toptips('请输入经营产品！');
       return false;
     }
     if(!data.cx){
       this.toptips('请输入经营车型！');
       return false;
     }
     if(!data.pz){
       this.toptips('请输入经营产品！');
       return false;
     }
     var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/;
     if(!data.phone){
       this.toptips('请输入手机号码！');
       return false;
     }
     if(!myreg.test(data.phone)){
      this.toptips('输入的手机号码不合法！');
      return false;
     }
     if(!data.password){
       this.toptips('请输入登录密码！');
       return false;
     }
    this.setData({
      disabled:true
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
      console.log(this.data.userInfo)
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res,
          })
          console.log(this.data.userInfo)
      }
    }
    data['region']=data.region.toString();
    data['id']=this.data.userInfo.id;
    wx.showLoading({
      title: '数据正在提交中',
    })
    wx.request({
      url: app.globalData.url+'service.php/user/register',
      data:data,
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
         if(res.data.status=="200"){
           var zf_data={
             'price':res.data.price,
             'order_id':res.data.order_id,
             'order_sn':res.data.order_sn,
             'openid':app.globalData.userInfo.openid,
             'applet_type':3,
           }
           wx.hideLoading()
           wx.showToast({
             title: '正在调起支付',
             icon: 'loading',
             duration: 1500
           })
           that.off_jsp(zf_data);
         }else if(res.data.status=="-200"){
          wx.hideLoading()
            that.toptips(res.data.msg);
            that.setData({
              disabled:false
            })
            return false;
         }else{
          wx.showToast({
            title: res.data.error,
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
        
      }
    })
  },

  //调起支付
  off_jsp:function(zf_data){
    var t=this;
    //获取支付参数
    wx.request({
     url: 'https://m.tianyuauto.com/App/Wxzfapi/example/xcx_jsp_all.php', //仅为示例，并非真实的接口地址
     data:zf_data,
     method:'GET',
     success: function(res_) {
        wx.hideLoading()
        //调起支付
        wx.requestPayment({
         'timeStamp': res_.data.timeStamp,
         'nonceStr': res_.data.nonceStr,
         'package': res_.data.package,
         'signType': res_.data.signType,
         'paySign': res_.data.paySign,
         'success':function(zfres){
                var pay_data={
                  'order_id':zf_data.order_id,
                  "zhid":app.globalData.userInfo.id
                }
                 t.confirm_order(pay_data);
         },'fail':function(zfres){
          //  t.get_order();
           wx.showToast({
             title: '取消支付',
             icon: 'none',
             duration: 1500
           })
         }
        });
    }
   });
 },

 //支付成功回调
 confirm_order:function(pay_data){
  var t=this;
   wx.request({
     url: app.globalData.url+'service.php/User/zhifu_ok',
     data:pay_data,
     header: { "Content-Type": "application/x-www-form-urlencoded"},
     method:'POST',
     success: function(json) {
       if(json.data.status=='200'){
         wx.hideLoading()
        //  wx.showToast({
        //    title: '支付成功', // 标题
        //    icon: 'success',  // 图标类型，默认success
        //    duration: 1500  // 提示窗停留时间，默认1500ms
        //  })
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '注册成功',
          success: function () {
            // wx.switchTab({
            //   url: '/pages/index/index'
            // });
            wx.navigateTo({
              url:'../newlogin/newlogin?url=pages/index/index'
            })
          }
        });
       }else{
         wx.showToast({
           title: json.data.error, // 标题
           icon: 'none',  // 图标类型，默认success
           duration: 2000  // 提示窗停留时间，默认1500ms
         }) 
       }
       

     }
  })
 },

// //查询支付成功却没有确认订单的
// get_order:function(){
//   var t=this;
//   wx.request({
//     url: app.globalData.url+'autop.php/Recharge/is_zfok',
//     data:{'zhid':app.globalData.userInfo.id},
//     header: { "Content-Type": "application/x-www-form-urlencoded"},
//     method:'POST',
//     success:function(res){
//         t.setData({
//           orderlist:res.data.list
//         })  
//     }
//   })
//  },
 
//全选与反全选
selectall: function (e) {
    var that = this;
    var arr = [];   //存放选中id的数组
    var cx_name=[]; //选中的车型名字
    let cx  ="list.cx";
    for (let i = 0; i < that.data.listData.length; i++) {

      that.data.listData[i].checked = (!that.data.select_all)

      if (that.data.listData[i].checked == true){
        // 全选获取选中的值
        arr = arr.concat('{'+that.data.listData[i].id+'}');
        cx_name = cx_name.concat(that.data.listData[i].name);
      }
    }
    arr=arr.toString()
    that.setData({
      listData:that.data.listData,
      cx_name:cx_name,
      select_all: (!that.data.select_all),
      [cx]:arr
    })
  },

  // 单选
  checkboxChangecx: function (e) {
    console.log(e)
    var arr=e.detail.value.toString();
    let cx  ="list.cx";
    this.setData({
      [cx]: arr, //单个选中的值
      cx_name:arr
    })
  },

  //经营车型显示
  showPopup4: function(){
    this.setData({
      popup4: false,
    })
    if(this.data.if_sup){
       this.supinfoinfo();
    }
  },
  //点击确认
  confirm: function() {
    this.setData({
      popup4: true,   
    })

  },
  //经营车型关闭
  hidePopup2: function() {
    this.setData({
      popup4: true,   
    })
  },



/**
 * 错误提示
*/
  toptips:function(msg){
    this.setData({
      error: msg
  })
  },
  bindRegionChange: function (e) {//省市区选择器
    let region  ="list.region";
    this.setData({
      [region]: e.detail.value
    })
  },
  checkboxChangepz:function(e){
    let pz  ="list.pz";
    this.setData({
      [pz]: e.detail.value.toString()
    })
    console.log(this.data.list.pz)
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
    var pages = getCurrentPages();//获取页面栈
    console.log(pages)
    var that =this
    getApp().watch(function(v){
      that.submit()
   })
  },
  /**
   * 经营车型
  */
 supinfoinfo:function(){
  wx.showLoading({title:'模板加载中'})
   var that =this;
  wx.request({
    url: app.globalData.url+'service.php/user/supinfoinfo',
    header: { "Content-Type": "application/x-www-form-urlencoded"},
    method:'POST',
    success: function(res) {
       if(res.data.status=="200"){
          that.setData({
            listData:res.data.qc_pps,
            if_sup:false
          })
       }else{
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