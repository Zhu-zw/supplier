
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
//弹框
// modalHidden: true,
//更换门店
// gender: {},
showModal:false,
storelist:[
  // {name:'金贵村站旁双燕汽贸园天域汽车门店',range:'2.5km'},
],
    url:'',
    burl:'',
  addres: [
      // {'zhid':5,'username':'小廖','phone':'18609336827','province':'广东省','city':'广州市','area':'太和镇','address':'广东省广州市白云区太和镇老街北路5巷1001号'},
  ],
  goods:[
    //  {'pro_name':'广汽本田雅阁2.3助力泵','img':'../../image/fdj.png','price':'10','id':2088,'number':2},
  ],
  list:{
    address:{
       zhid:"",
       username:"",
       phone:"",
       address:""
    },
    goods:{
      // '2088':{
      //   "id":"2088",
      //   "number":"2"
      // },
    },
      gys:0,
      province:"",
      city:"",
      area:"",
      freight:1,
      freight_price:0.00,
      pay_action:1,//1线上 2线下
  },
  freight_price:'0.00',//运费
  price:0.00,//金额
  num_price:0.00,
  casIndex: 0,
  parameter: [
    { name: '1', value: '代发快递' ,'text':'0.00(到付)',price:'0.00', checked:true},
    { name: '2', value: '到店自提','text':'0.00',price:'0.00'},
    { name: '3', value: '送货上门','text':'15.00',price:'15.00'},
  ],
    items:[
      { name: 'WX', value: '微信支付', checked:true},
    ],
    aa:'WX',
    num:1,
  },


//添加地址的显示
showCancelOrder: function() {
  this.setData({
    showModal:true
  })
},
//添加地址的隐藏
modal_click_Hidden: function () {
  this.setData({
    showModal: false,
  })
},



//跳转新增地址页面
addup: function (e){
  wx.navigateTo({
    url:'../change-address/change-address'
  })
},
  address:function(e){
    // console.log(e);return
    var t=this.data.addres[e.currentTarget.dataset.index];
    if(t){
      this.setData({
        casIndex:e.currentTarget.dataset.index,
        ['list.province']:t.province,
        ['list.city']:t.city,
        ['list.area']:t.area,
        ['list.address.zhid']:t.zhid,
        ['list.address.username']:t.username,
        ['list.address.phone']:t.phone,
        ['list.address.address']:t.address,
         showModal: false,
      })
    }
  },
  //提交数据
  submit:function(e){
    var _this=this
    var data={};
    data=this.data.list
    data['payment']=e.currentTarget.dataset.payment
    data['zhid']=app.globalData.userInfo.id
    console.log(this.data.list);
    data.address=(typeof(data.address)=='string'?data.address:JSON.stringify(data.address))
    data.goods=(typeof(data.goods)=='string'?data.goods:JSON.stringify(data.goods))
    wx.showLoading({title: app.globalData.load_data})
 
   //创建订单
     wx.request({
       url: app.globalData.url+'/service.php/order/index',
       data:data,
       header: { "Content-Type": "application/x-www-form-urlencoded"},
       method:'POST',
       success: function(res) {
           if(res.data.status=="ok"){
             if(e.currentTarget.dataset.payment==4){
              wx.showToast({
                title: "支付成功",
                icon: 'success',
                 duration: 3000
              }); 
              return
             }
             var zf_data={};
             zf_data['price']=res.data.price;
             zf_data['order_sn']=res.data.order_sn;
             zf_data['openid']=app.globalData.userInfo.openid;
             zf_data['applet_type']=3;
           //获取支付参数
             wx.request({
               url: 'https://m.tianyuauto.com/App/Wxzfapi/example/xcx_jsp_all.php', //仅为示例，并非真实的接口地址
               data:zf_data,
               method:'GET',
               success: function(res_) {
                  //console.log(res)
 
               //调起支付
                  wx.requestPayment({
                   'timeStamp': res_.data.timeStamp,
                   'nonceStr': res_.data.nonceStr,
                   'package': res_.data.package,
                   'signType': res_.data.signType,
                   'paySign': res_.data.paySign,
                   'success':function(zfres){
                     // console.log(zfres.data.status.typeOf());
                     //   if(zfres.data.status && zfres.data.status=="fail"){
                     //     //支付调起失败返回错误
                     //       wx.showToast({
                     //          title: res.data.error,
                     //          icon: 'none',
                     //          duration: 1500
                     //       })
                     //       return;
                     //   }
 
                       var pay_data={};
                       pay_data['order_id']=res.data.order_id;//支付订单表id
                       pay_data['order_sn']=res.data.order_sn;//支付订单1表订单号
                       pay_data['price']=res.data.price;//支付金额
                       pay_data['pay_time']=res_.data.timeStamp;
                       pay_data['pay_result']="SUCCESS";
                       wx.request({
                          url: app.globalData.url+'/service.php/order/zhifu_ok',
                          data:pay_data,
                          header: { "Content-Type": "application/x-www-form-urlencoded"},
                          method:'GET',
                          success: function(json) {
 
                                 wx.showToast({
                                   title: json.data.error,
                                   icon: 'success',
                                    duration: 3000
                                 }); 
 
                          }
                       })
                          
                   },
                   'fail':function(zfres){
                     console.log('fail');
                     console.log(zfres);
                   },
                   'complete':function(zfres){
                     console.log('complete');
                     console.log(zfres);
                   }
                 });
 
 
               },
             })
             wx.hideLoading()
           }else{
             wx.showModal({
               title:'提示',
               content:res.data.error,
               showCancel:false,
             })
             wx.hideLoading()
           }
       },
     })
  },
  bindtap1:function(e){
    var items = this.data.items;
    for (var i = 0; i < items.length; i++){
      if (items[i].name == this.data.aa){
        for (var j = 0; j < items.length; j++) {

          if (items[j].checked && j != i) {
              items[j].checked = false;
            }
        }
        items[i].checked = !(items[i].checked);
 
      }
    }
    this.setData({
      items: items
    });
  },
  radioChange: function (e) {
    // for(var i = 0;i<this.data.items.length;i++){
    //   if (this.data.items[i].checked){
    //     // console.log('radio发生change事件，携带value值为：', this.data.items[i].name)
    //   }
    // }
      this.data.aa = e.detail.value;
      console.log(this.data.aa);
    },
  
  clicks: function (e){
    let index = e.currentTarget.dataset.index;
    let arrs = this.data.checks;
    if (arrs[index].checked == false){
      arrs[index].checked = true;
    }else{
      arrs[index].checked = false;
    }
    this.setData({
      checks: arrs
    })
  },
// //显示弹窗
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
//   // 2 把值赋值给 data 中的数据
//   let list="list.gys";
//   // console.log(this.data.list);
//   this.setData({
//     // gender:gender
//     gender:offer,
//     [list]:offer.zhid
    
//   })

// },
//点击取消
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
  /* 点击减号 */  
  bindMinus: function(e) {  
    var key=e.currentTarget.dataset.key;
    var num = this.data.goods[key].number;  
    var number="goods["+key+"].number"
    var list_goods="list.goods."+this.data.goods[key].id+".number"
    // 如果大于1时，才可以减  
    if (num > 1) {
      num --;  
    }  
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';  
    // 将数值与状态写回  
    this.setData({  
      [number]: num,  
      [list_goods]:num,
      minusStatus: minusStatus  
    });  
    
      var price=0.00;
      for(var i in this.data.goods){
         price+=parseFloat(this.data.goods[i].price)*parseFloat(this.data.goods[i].number)
      }
      var num_price=parseFloat(this.data.list.freight_price)+parseFloat(price);
      this.setData({  
        price:price,  
        num_price:num_price
      });
      
  },  
  /* 点击加号 */  
  bindPlus: function(e) {  
    var key=e.currentTarget.dataset.key;
    var num = this.data.goods[key].number;  
    var number="goods["+key+"].number"
    var list_goods="list.goods."+this.data.goods[key].id+".number"
    // 不作过多考虑自增1  
    num ++;  
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';  
    // 将数值与状态写回  
    this.setData({  
        [number]: num,  
        [list_goods]:num,
        minusStatus: minusStatus  
    });  

    var price=0.00;
      for(var i in this.data.goods){
         price+=parseFloat(this.data.goods[i].price)*parseFloat(this.data.goods[i].number)
      }
     
      var num_price=parseFloat(price)+parseFloat(this.data.list.freight_price);
      this.setData({  
        price:price,  
        num_price:num_price
      });
  },  
  /* 输入框事件 */  
  bindManual: function(e) {  
    var num = e.detail.value;  
    // 将数值与状态写回  
    this.setData({  
        num: num 
    });  
  },
  
   //取货方式
   parameterTap: function (e) {
    var that = this
    var this_checked = e.target.dataset.id
    var parameterList = this.data.parameter//获取Json数组
    for (var i = 0; i < parameterList.length; i++) {
      if (i == this_checked) {
        parameterList[i].checked = true;//当前点击的位置为true即选中
        this.setData({
           checkboxgroupList: this_checked,
           ['list.freight']:parameterList[i].name,
           ['list.freight_price']:parameterList[i].price,
           freight_price:parameterList[i].text
        })
      }
      else {
        parameterList[i].checked = false;//其他的位置为false
      }
    }
    var num_price=parseFloat(this.data.list.freight_price)+parseFloat(this.data.price);
    that.setData({
      parameter: parameterList,
      num_price:num_price
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.is_cart){
       options.is_cart=false;
    }

    this.setData({
      id:options.id,
      is_cart:options.is_cart,//用于判断是详情页下单还是购物车下单 true是购物车下单 false是详情页下单
      url: app.globalData.url,
      burl: app.globalData.burl,
      freight_price:this.data.parameter[0].text
    })
    this.address_data()
    //    var _this=this;
    // var dizhi = app.globalData.address
    //   //  if(dizhi){
    //   //    var url1 = this.data.url+"/order/offer";
    //   //    var data = {lng:dizhi.result.location.lat,lat:dizhi.result.location.lng,addres:dizhi.result.address_component.city,key:'city'}
    //   //  }else{
    //      var url1 = this.data.url+"/order/information";
    //      var data ={};
    //   //  }
    //     wx.request({
    //       url:url1,
    //       data:data,
    //       header: { "Content-Type": "application/x-www-form-urlencoded"},
    //       method:'POST',
    //       success: function(list) {

    //         _this.setData({
    //          storelist:list.data.offer,
    //          gender:list.data.offer[0],
    //          ['list.gys']:list.data.offer[0].zhid
    //       })
    //         // console.log(_this.data.list)
    //       },
    //     })
  },
 address_data:function(){
  let _this=this
 wx.showLoading({title: app.globalData.load_data})


 var dizhi_data= {
  zhid:app.globalData.userInfo.id,
  pro_id:this.data.id
};

if(this.data.is_cart){
  dizhi_data['is_cart']=this.data.is_cart;
}
  wx.request({
    url: app.globalData.url+'/service.php/order/dizhi',
    data:dizhi_data,
    header: { "Content-Type": "application/x-www-form-urlencoded"},
    method: "post",
    success: function (res) {
      if(res.data.status=="ok"){
        _this.setData({
           goods:res.data.product,
           ['list.goods']:res.data.goods,
           price:res.data.price,
           num_price:res.data.price,
       })
       if(res.data.address){
        let dizhi=res.data.address[0]
        if(dizhi!=undefined){
          _this.setData({
            addres:res.data.address,
            ['list.province']:dizhi.province,
            ['list.city']:dizhi.city,
            ['list.area']:dizhi.area,
            ['list.address.zhid']:dizhi.zhid,
            ['list.address.username']:dizhi.username,
            ['list.address.phone']:dizhi.phone,
            ['list.address.address']:dizhi.address,
          })
       }
      }
      wx.hideLoading()
      }else{
          wx.showModal({
            title: '错误',
            content: res.data.error,
            showCancel:false,
          }) 
          wx.hideLoading()
      }
    },
    fail:function(error){
       console.log(error);
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
    var that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页
    // if (currPage.data.prize_id) {
    //     //调取接口操作
    // }
    // console.log(currPage.data)
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