// pages/centralware2/centralware2.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //弹框
    popup: true,
    popup2: true,
    popup3: true,
    popup4: true,
    qc_check2:0,
    qc_check3:0,
    qc_check4:0,
    //第二层汽车数据
    qc2list:[
      {id:1,name:'奥迪（一汽）'},
      {id:2,name:'奥迪（进口）'},
    ],
    //第三层汽车数据
    qc3list:[
      {id:1,name:'A6(C5/4Y8)1999-2006'},
      {id:2,name:'A6L(C6/4Z8)2005-2012'},
      {id:3,name:'A4 quattor(B6/8E2)2002-2005'},
      {id:4,name:'A4 quattor(B8/828)2008-2016'},
    ],
    //第四层汽车数据
    listData: [
      { code: "1", text: "1.8T AWL" },
      { code: "2", text: "1.8L ANQ"},
      { code: "3", text: "1.8T BGC"},
      { code: "4", text: "2.8L ATX"},
    ],
    select4: false, //搜索分类
    search_name: '产品名称', //分类名
    search_id:'cat_name',
    //分类数据
    fl_list:[
      {id:'cat_name',name:"产品名称"},
      {id:'code',name:"编码"},
    ],
    //搜索关键字
    keywords:'',
    //字母数据
    alphabet:[
      'A','B','C','D','E','F','G','H','I',
      'J','K','L','M','N','O','P','Q','R',
      'S','T','U','V','W','X','Y','Z'
    ],
    //车型
    model:[],

    select: false, //品质下拉框
    select2: false, //品牌件下拉框
    select3: false, //品牌件下拉框
    ppshow: false, //品牌件2级
    ccshow: false, //拆车件2级
    pz_name: '品质筛选',
    pp_name: '同质件',
    cc_name: '9成新',
    //加载
    tip:'点击加载更多',
    show1:true,
    show2:false,

    //品质数据
    pz_list:[
      {id:1,name:"原厂件"}, {id:2,name:"品牌件"}, {id:3,name:"拆车件"},
      {id:4,name:"原厂下线"}, {id:5,name:"再制造"}, {id:6,name:"厂家配套"}
    ],
    //品牌件2级列表数据
    pp_list:[
      {id:1,name:"博世"},{id:2,name:"海拉"},
      {id:3,name:"伟世通Vistron"},{id:4,name:"菲罗多"},
      {id:5,name:"VDO"},{id:6,name:"天合TRW"},
    ],    
    //拆车件2级列表数据
    cc_list:[
      {id:1,name:"9成新"},{id:2,name:"8成新"},{id:3,name:"7成新"},
      {id:4,name:"6成新"},{id:5,name:"5成新"},
    ],


    cateItems:[

      {cate_id:1,cate_name:'悬挂',
        children: [
          {child_id: 1, name: '助力泵', image: "https://m.tianyuauto.com/Uploads/gzh_img/202010121147029008.JPG"}, 
          {child_id: 2, name: '刹车泵', image: "https://m.tianyuauto.com/Uploads/gzh_img/202010102153167440.jpeg"},
          {child_id: 3, name: '管柱锁', image: "https://m.tianyuauto.com/Uploads/gzh_img/202010102137074288.jpeg"}, 
          {child_id: 4, name: '发动机', image: "https://m.tianyuauto.com/Uploads/gzh_img/202010101440404800.jpeg"},
        ]
      },

      {cate_id:2, cate_name:'滤清',
        children: [
          {child_id: 1, name: '卸妆', image: "http://img2.imgtn.bdimg.com/it/u=2773684370,2662418416&fm=26&gp=0.jpg"},
          {child_id: 2, name: '洁面皂', image: "http://img11.360buyimg.com/n0/jfs/t304/257/1326356931/91893/cf5d3987/5437d505Neb85319a.jpg"}, 
        ]
      },
    ],
    fl:[
      {cate_id: 3,cate_name: '制动'},
      {cate_id: 4,cate_name: '照明'},
      {cate_id: 5,cate_name: '养护'},
      {cate_id: 6,cate_name: '点火'},
      {cate_id: 7,cate_name: '电池'},
      {cate_id: 8,cate_name: '油水'},
      {cate_id: 9,cate_name: '雨刷'},
      {cate_id: 10,cate_name: '皮带'},
      {cate_id: 11,cate_name: '悬挂'},
      {cate_id: 12,cate_name: '滤清'} 
    ],
    curNav:0,
    curIndex:0,
    num:5,
    is_wh:false,
    wh:{},
    cart:{}//购物车
  },

  //点击其他地方
  hideicon:function(){
    this.setData({
      select: false, //品质下拉框
      select2: false, //品牌件下拉框
      select3: false, //品牌件下拉框
      select4: false, //产品名称
      ppshow: false, //品牌件2级
      ccshow: false, //拆车件2级
    })
  },
  
//全选
selectall: function (e) {
  console.log(e)
    var that = this;
    var arr = [];   //存放选中id的数组
    for (let i = 0; i < that.data.model[4][that.data.qc_check4].length; i++) {

      that.data.model[4][that.data.qc_check4][i].checked = (!that.data.select_all)

      if (that.data.model[4][that.data.qc_check4][i].checked == true){
        // 全选获取选中的值
        arr=arr.concat(that.data.model[4][that.data.qc_check4][i].id);
      }
    }
    that.setData({
       model: that.data.model,
       select_all: (!that.data.select_all),
       batchIds:arr
    })
  },

  // 单选
  checkboxChange: function (e) {
    this.setData({
      batchIds: e.detail.value  //单个选中的值
    })
  },


 // 第二层显示
  showPopup2: function(e){
    console.log(e);
    this.setData({
      popup: true,
      popup2: false,   
      qc_check2:e.currentTarget.dataset.val 
    })
  },
  // 第三层显示
  showPopup3: function(e){
    this.setData({
      popup: true,
      popup2: true,
      popup3: false,  
      qc_check3:e.currentTarget.dataset.val   
    })
  },
  //第四层显示
  showPopup4: function(e){
    this.setData({
      popup: true,
      popup2: true,
      popup3: true,
      popup4: false,
      qc_check4:e.currentTarget.dataset.val 
    })
  },
  //确认车型
  confirmcx: function(){
    this.setData({
      popup4: true,  
      ['cateItems.'+this.data.curNav+'.pro']:[],
      ['cateItems.'+this.data.curNav+'.last_id']:0,
    })
    this.data.is_wh=true;
    this.data.wh['model']=this.data.batchIds
    this.jiazai();
  },

  //返回第一层
  fanhui2: function(){
    this.setData({
      popup: false,
      popup2: true,    
    })
  },
  //返回第二层
  fanhui3: function(){
    this.setData({
      popup: true,
      popup2: false,
      popup3: true,  
    })
  },
  //返回第三层
  fanhui4: function(){
    this.setData({
      popup: true,
      popup2: true,
      popup3: false,
      popup4: true,
      select_all:false,
    })
  },

  //其他层关闭
  hidePopup2: function() {
    this.setData({
      popup2: true,
      popup3: true,
      popup4: true,  
      select_all:false, 
    })
  },
 //搜索下拉框下拉框选择
 bindShowMsg4() {
  this.setData({
    select4: !this.data.select4
  })
},
//获取搜索关键字
getkeywords:function(e){
     this.setData({
         keywords:e.detail.value
     })
},

//点击搜索
search:function(){
    if(!this.data.keywords){
      wx.showToast({
        title:'请输入关键字',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    this.data.wh={};
    this.data.is_wh=true;
    this.data.wh[this.data.search_id]=this.data.keywords
    this.setData({
      ['cateItems.'+this.data.curNav+'.pro']:[],
      ['cateItems.'+this.data.curNav+'.last_id']:0,
    })
    this.jiazai();
},

//选择分类
mySelect4(e) {
  var name = e.currentTarget.dataset.name
  var id = e.currentTarget.dataset.id
  this.setData({
    search_name: name,
    search_id: id,
    select4: false,
  })
},

  //加载更多
  jiazai: function(e){
    this.setData({
      show1:(!this.data.show1),
      show2:(!this.data.show2),
    })

    var t=this;
    var data={
        fl_id:this.data.curNav,
        last_id:this.data.cateItems[this.data.curNav].last_id,
        num:this.data.num,
    }

    if(this.data.is_wh){
       data['is_wh']=this.data.is_wh
       data['wh']=this.data.wh;
    }
    
    wx.request({
      url: app.globalData.url+'/service.php/Centralwarehouse/get_next',
      data:data,
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'GET',
      success: function(res) {
          wx.hideLoading()
          if(res.data.status=='ok'){
            console.log(t.data.cateItems);
            if(!res.data.list.length){
                t.setData({
                    show1:true,
                    show2:false,
                    tip:'没有更多商品了',
                })
                return;
            }
              var list=t.data.cateItems[t.data.curNav].pro.concat(res.data.list);
              t.setData({
                ['cateItems.'+t.data.curNav+'.pro']:list,
                ['cateItems.'+t.data.curNav+'.last_id']:res.data.last_id,
                show1:true,
                show2:false,
                tip:'点击加载更多',
              })
          }else{
            wx.showToast({
              title: res.data.error,
              icon: 'none',
              duration: 1500
            })
          }
      }
    })
  },


  // 切换
  switchRightTab:function(e){
    let id = e.target.dataset.id,index=e.target.dataset.index;
    var t=this;
    if(this.data.is_wh){
      this.setData({
        ['cateItems.'+t.data.curNav+'.pro']:[],
        ['cateItems.'+t.data.curNav+'.last_id']:0,
      })
    }
    this.setData({
      curNav:id,
      curIndex:index,
      show1:true,
      show2:false,
      tip:'点击加载更多',
      is_wh:false,
    })
    if(!this.data.cateItems[id].pro.length){
      this.jiazai();
    }
   

   
   
  },

  //购买弹框提示
  buytip: function(e){
   
    var key=e.currentTarget.dataset.pro_id;
    if(this.data.cart[key]){
       var cart=parseInt(this.data.cart[key].number)+parseInt(1);
       var key="cart."+key+".number";
       this.setData({
        [key]:cart,
       })
    }else{
       var cart={
          pro_id:key,
          number:1,
       }
      this.data.cart[key]=cart
    }
    wx.showToast({
      title: '添加成功！',  // 标题
      icon: 'success',   // 图标类型，默认success
      duration: 1500   // 提示窗停留时间，默认1500ms
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        burl:app.globalData.burl
    })
     this.get_pro();
  },


  get_pro:function(){
    var t=this;
    wx.request({
      url: app.globalData.url+'/service.php/Centralwarehouse/list',
      success: function(res) {
              t.setData({
                curNav:res.data.fl[0].id,
                fl:res.data.fl,
                pz_list:res.data.quality,
                pp_list:res.data.brand,
                cc_list:res.data.degree,
                cateItems:res.data.list,
                model:res.data.model
              })
              t.getmodel();
      }
    })
  },

  //获取车型
  getmodel:function(){
    var t=this;
    wx.request({
      url: app.globalData.url+'/service.php/Centralwarehouse/model',
      success: function(res) {
              t.setData({
                model:res.data.model
              })
      }
    })
  },

  //去结算
confirm:function(){
  var len=Object.keys(this.data.cart)
  len=len.length
  if(!len){
    wx.showToast({
      title: '请添加商品！',  // 标题
      icon: 'none',   // 图标类型，默认success
      duration: 1500   // 提示窗停留时间，默认1500ms
    })
    return;
  }
  var cart=this.data.cart
  var id=""
  var a=0;
  for(var i in cart){
      if(a==0){
        id+=JSON.stringify(cart[i]);
      }else{
        id+="-"+JSON.stringify(cart[i]);
      }
      a++;
  }
    wx.navigateTo({
      url: '../commodity/commodity?id='+id,
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