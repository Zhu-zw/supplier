// pages/centralware2/centralware2.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    showView: true, //修改确定的显示隐藏
    isDisabled:true, //表示页面加载完成时disabled为启用状态

    show1: true,
    show2: false,

    number: 1000, //库存

    //弹框
    popup: true,
    popup2: true,
    popup3: true,
    popup4: true,

    //字母数据
    alphabet:[
      'A','B','C','D','E','F','G','H','I',
      'J','K','L','M','N','O','P','Q','R',
      'S','T','U','V','W','X','Y','Z'
    ],

    select: false, //品质下拉框
    select2: false, //品牌件下拉框
    select3: false, //拆车下拉框
    select4: false, //搜索分类
    ppshow: true, //品牌件2级
    ccshow: false, //拆车件2级
    fl_name: '分类搜索', //分类名
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
    //分类数据
    fl_list:[
      {id:1,name:"产品名称"},
      {id:2,name:"编码"},
    ],

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
    curNav:1,
    curIndex:0
  },

  //修改库存
  changep2(e) {
    var that = this;
    this.setData({
      showView: (!that.data.showView)
    })
    if (!this.data.isDisabled){
      wx.showToast({
        title:'修改成功',
        icon:'success',
        duration:2000
      })
      this.setData({
        isDisabled: true,
      })
    }
    else{
      wx.showToast({
        title:'点击数字修改',
        icon:'success',
        duration:2000
      })
      this.setData({
        isDisabled: false,
      })
    }
  },

  //品质下拉框选择
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  //选择品质
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.dataset.id
    console.log(id)
    this.setData({
      pz_name: name,
      select: false,
    })
  },
  //品牌件下拉框选择
  bindShowMsg2() {
    this.setData({
      select2: !this.data.select2
    })
  },
  //选择品牌件2级
  mySelect2(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      pp_name: name,
      select2: false,
    })
  },
  //拆车件2级下拉框选择
  bindShowMsg3() {
    this.setData({
      select3: !this.data.select3
    })
  },
  //选择拆车件2级
  mySelect3(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      cc_name: name,
      select3: false,
    })
  },
  //分类搜索
  bindShowMsg4(){

  },
  //搜索下拉框下拉框选择
  bindShowMsg4() {
    this.setData({
      select4: !this.data.select4
    })
  },
  //选择分类
  mySelect4(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      fl_name: name,
      select4: false,
    })
  },
  //加载更多
  jiazai: function(){
    this.setData({
      show1:(!this.data.show1),
      show2:(!this.data.show2),
    })
  },


  // 切换
  switchRightTab:function(e){
    let id = e.target.dataset.id,index=e.target.dataset.index;
    this.setData({
      curNav:id,
      curIndex:index
    })
  },

  //购买弹框提示
  buytip: function(){
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

//全选
selectall: function (e) {
  console.log(e)
    var that = this;
    var arr = [];   //存放选中id的数组
    for (let i = 0; i < that.data.listData.length; i++) {

      that.data.listData[i].checked = (!that.data.select_all)

      if (that.data.listData[i].checked == true){
        // 全选获取选中的值
        arr = arr.concat(that.data.listData[i].code.split(','));
      }
    }
  console.log(arr)
    that.setData({
      listData: that.data.listData,
      select_all: (!that.data.select_all),
      batchIds:arr
    })
  },

  // 单选
  checkboxChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      batchIds: e.detail.value  //单个选中的值
    })
  },

  // 第二层显示
  showPopup2: function(){
    this.setData({
      popup: true,
      popup2: false,    
    })
  },
  // 第三层显示
  showPopup3: function(){
    this.setData({
      popup: true,
      popup2: true,
      popup3: false,    
    })
  },
  //第四层显示
  showPopup4: function(){
    this.setData({
      popup: true,
      popup2: true,
      popup3: true,
      popup4: false,
    })
  },
  //确认车型
  confirmcx: function(){
    this.setData({
      popup4: true,  
    })  
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
    })
  },

  //其他层关闭
  hidePopup2: function() {
    this.setData({
      popup2: true,
      popup3: true,
      popup4: true,   
    })
  },


  //商品详情页跳转
  details: function(e){
    wx.navigateTo({
      url:'../details/details'
    })
  },
  //下单页跳转
  commodity: function(e){
    wx.navigateTo({
      url:'../commodity/commodity'
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