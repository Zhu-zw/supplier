// pages/release/release.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedSub: 0, // 选中的分类
    userInfo:null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    addshow:true,
    delshow:false,
    addphone: [],
    select: false, //品质下拉框
    select2: false, //保质时间下拉框
    select3: false, //配件名称下拉框

    select4: false, //品牌件2级下拉框
    select5: false, //拆车件2级下拉框
    ppshow: false,//品牌件2级显示
    ccshow: false,//拆车件2级显示

    pz_name: '请选择品质',
    pj_name: '',
    pp_name: '请选择',
    cc_name: '请选择',
    zb_time: '请选择',


    //配件名称
    pj_list: [],
    //品质数据
    pz_list:[],
    //天数
    zb_list: [
      {id:1,time:"7"},
      {id:2,time:"15"},
      {id:3,time:"30"},
      {id:4,time:"60"},
      {id:5,time:"90"},
      {id:6,time:"180"},
      {id:7,time:"365"},
    ],
    //品牌件2级列表数据
    pp_list:[],
    //拆车件2级列表数据
    cc_list:[
      {id:9,name:"9成新"},{id:8,name:"8成新"},{id:7,name:"7成新"},
      {id:6,name:"6成新"},{id:5,name:"5成新"},
    ],

    //售后服务数据
    servicelist:[],

    //第二层汽车数据
    qc2list:[],
    //第三层汽车数据
    qc3list:[],
    //第四层汽车数据
    qc4list:[],
    listData: [],

    //弹框
    popup: true,
    popup2: true,
    popup3: true,
    popup4: true,

    //车型
    chexing: true,

    select_all: false,
    batchIds: '',    //选中的ids

    //字母数据
    alphabet:[
      'A','B','C','D','E','F','G','H','I',
      'J','K','L','M','N','O','P','Q','R',
      'S','T','U','V','W','X','Y','Z'
    ],
    brandlist:[],//汽车品牌
    brand_status:true,//汽车品牌请求限制
    url:'',
    burl:'',
    //商品数据
    list:{
      cid:'',//配件名称
      cid_add:'',//配件名称添加
      cat_name:'',//配件标题
      code:'',//原厂编码
      cjcode:[],//通用编码
      pjpz:'',//品质
      pinpai:0,//品牌
      cese:0,//拆车
      xsjg:'',//销售价格
      stock:'',//库存数量
      bzdw:'',//商品规格
      bzts:'',//质保时间
      clause:'',//售后服务
      model:'',//适用车型
    },
    loading:'数据加载中...',
    loadingHidden:false,
    picture:false,
    pics:[],//商品照片
    img_copy:[],//需要拷贝的照片
    model:[],//车型
    clause:[],
    error: '',
  },
/**
 * 错误提示
*/
toptips:function(msg){
  this.setData({
    error: msg
})
},
  //品质下拉框选择
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  //天数下拉框选择
  bindShowMsg2() {
    this.setData({
      select2: !this.data.select2
    })
  },
  //配件名称下拉框选择
  bindShowMsg3() {
    this.setData({
      select3: true,
    })
    
  },
  //品牌件2级下拉框选择
  bindShowMsg4() {
    this.setData({
      select4: !this.data.select4
    })
  },
  //拆车件2级下拉框选择
  bindShowMsg5() {
    this.setData({
      select5: !this.data.select5
    })
  },

  //选择品质
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.dataset.id
    var that =this
    var pinpai=["list.pinpai"]
    var cese=["list.cese"]
    if(id==2){
      that.setData({
        ppshow:true,
        ccshow:false,
        [pinpai]:'',
        [cese]:'',
      })
    }else if(id==3){
      that.setData({
        ccshow:true,
        ppshow:false,
        [pinpai]:'',
        [cese]:'',
      })
    }
    var pjpz="list.pjpz"
    this.setData({
      pz_name: name,
      [pjpz]:id,
      select: false,
    })
  },
  //选择天数
  mySelect2(e) {
    var time = e.currentTarget.dataset.time
    var bzts="list.bzts";
    this.setData({
      zb_time: time,
      [bzts]:time,
      select2: false,
    })
  },
  //选择配件名称
  mySelect3(e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    var cid ="list.cid"
    var cid_add ="list.cid_add"
    this.setData({
      pj_name: name,
      [cid]:id,
      [cid_add]:'',
      select3: false,
    })
  },
  //选择品牌件2级
  mySelect4(e) {
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.dataset.id
    var pinpai=["list.pinpai"]
    this.setData({
      pp_name: name,
      select4: false,
      [pinpai]:id,
    })
  },
  //选择拆车件2级
  mySelect5(e) {
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.dataset.id
    var cese=["list.cese"]
    this.setData({
      cc_name: name,
      select5: false,
      [cese]:id,
    })
  },



  //显示

  //第一层显示
  showPopup() {
    this.hidePopup(false);
    if(this.data.brand_status){
      this.brand();
   }
  },
  //第一层数据
  brand:function(){
    wx.showLoading({title:'模板加载中'})
    var that =this;
    wx.request({
      url: app.globalData.url+'service.php/commodity/brand_auto',
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
          if(res.data.status=="200"){
            that.setData({
              brandlist:res.data.pps,
              brand_status:false
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
  //第二层数据
  getQcpps:function(id){
    wx.showLoading({title:'模板加载中'})
    var that =this;
    wx.request({
      url: app.globalData.url+'service.php/commodity/getQcpps',
      data:{"id":id},
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
          if(res.data.status=="200"){
            that.setData({
              qc2list:res.data.pps,
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
  //第三层数据
  getCxgl:function(id){
    wx.showLoading({title:'模板加载中'})
    var that =this;
    wx.request({
      url: app.globalData.url+'service.php/commodity/getCxgl',
      data:{"ppid":id},
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
          if(res.data.status=="200"){
            that.setData({
              qc3list:res.data.pps,
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
  //第四层数据
  getChex:function(id){
    wx.showLoading({title:'模板加载中'})
    var that =this;
    wx.request({
      url: app.globalData.url+'service.php/commodity/getChex',
      data:{"cxid":id},
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
          if(res.data.status=="200"){
            that.setData({
              listData:res.data.pps,
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
  // 第二层显示
  showPopup2: function(e){
    var id = e.currentTarget.dataset.val;
    this.setData({
      popup: true,
      popup2: false,    
    })
     this.getQcpps(id)
  },
  // 第三层显示
  showPopup3: function(e){
    var id = e.currentTarget.dataset.id;
    this.setData({
      popup: true,
      popup2: true,
      popup3: false,    
    })
    this.getCxgl(id)
  },
  //第四层显示
  showPopup4: function(e){
    var id = e.currentTarget.dataset.id;
    this.setData({
      popup: true,
      popup2: true,
      popup3: true,
      popup4: false,
    })
    this.getChex(id)
  },

  //确认车型
  confirmcx: function(){
    this.setData({
      chexing: false,
      popup4: true,  
    })  
  },

  // 关闭


  //第一层关闭
  hidePopup(flag = true) {
    this.setData({
      "popup": flag
    });
  },
  //其他层关闭
  hidePopup2: function() {
    this.setData({
      popup2: true,
      popup3: true,
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
        var value = that.data.listData[i]
        arr = arr.concat(value.id);
        cx_name = cx_name.concat({"id":value.id,"name":value.name});
      }
    }
    arr=arr.toString()
    that.setData({
      listData: that.data.listData,
      select_all: (!that.data.select_all),
      batchIds:arr,
      model:that.data.model.concat(cx_name)
    })
    console.log(this.data.model)
  },
  //售后服务
  checkboxChangefw:function(e){
    var name = e.detail.value
    this.setData({
      clause:name,
    })
  },
  // 单选
  checkboxChange: function (e) {
    var cx_name=[];
    var arr=[];
    var name = e.detail.value
    for (var i=0;i<name.length;i++){
      var cx_arr=name[i].split("|")
      cx_name = cx_name.concat({"id":cx_arr[0],"name":cx_arr[1]});
      arr=cx_arr[0];
    }
    console.log(cx_name);
    this.setData({
      batchIds:arr,
      model: this.data.model.concat(cx_name)  //单个选中的值
    })
  },




  /**新增** */
  addNew: function(e) {
    let newArray = {
      store_phone: "",
    }
    this.setData({
      addphone: this.data.addphone.concat(newArray),
      addshow: false,
      delshow: true
    })
  },

  /****删除*/
  delNew: function(e) {
    let that = this
    let index = e.target.dataset.index //数组下标
    let arrayLength = that.data.addphone.length //数组长度
    let newArray = []

      for (let i = 0; i < arrayLength; i++) {
        if (i !== index) {
          newArray.push(that.data.addphone[i])
        }
      }
      that.setData({
        addphone: newArray
      })
  },


  //点击其他地方隐藏
  hideIcon:function(){
    this.setData({
      select: false, //品质下拉框
      select2: false, //保质时间下拉框
      select3: false, //配件名称下拉框
    })
  },


  //上传图片
  upload:function(even,index="false"){
    wx.showLoading({title: '照片正在上传'})
    var t=this;
    wx.chooseImage({
      count: 6, //最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        wx.uploadFile({
          url: app.globalData.url+"service.php/commodity/upload", //仅为示例，非真实的接口地址
          filePath: res.tempFilePaths[0],
          name: 'file',//示例，使用顺序给文件命名
          success:function(e){
              e.data=JSON.parse(e.data);
              console.log(e.data)
            if(index!="false"){//编辑
              wx.hideLoading()
                var pics="pics["+index+"]";
                t.setData({
                  [pics]:e.data.filePath
                })
              }else{//添加
                wx.hideLoading()
                var pics=t.data.pics.concat([e.data.filePath]);
                var img_copy=t.data.img_copy.concat([e.data.img_copy]);
                t.setData({
                  pics:pics,
                  img_copy:img_copy,
                  picture:true
                })
              }  
              console.log(t.data.pics)
              console.log(t.data.img_copy)
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
      },
    })
  },
    //获取用户输入的值
    commodity: function (e) {
      var name = e.currentTarget.dataset.name//数组名
      var value =e.detail.value//数组值
      var key="list."+name;//赋值的名
      // if(name=="cjcode"){
      //   value=this.data.list.cjcode.concat(value);
      // }
      this.setData({
        [key]: value
      })
      console.log(this.data.list)
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    getApp().watch(function(v){//微信授权登录，及时获取数据
      that.DataInfo()
   })

    this.setData({
      url: app.globalData.url,
      burl: app.globalData.burl,
    })
    this.parts();
  },
   /**
   * 跳转滚动条位置
   */
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
   * 发布商品提交
  */
  submit:function(){
    var data=this.data.list;
    var data_=this.data
    if(!data_.pics.length){
      this.toptips('请上传照片');return false;
    }
    if(!data.cid && !data.cid_add){
      this.toptips('请选择或填写配件名称');return false;
    }
    if(!data.cat_name){
      this.toptips('请输入配件标题');return false;
    }
    if(!data.pjpz){
      this.toptips('请选择品质');return false;
    }
    if(data.pjpz==2){
       if(!data.pinpai){
         this.toptips('请选择品质品牌');return false;
       }
    }
    if(data.pjpz==3){
      if(!data.cese){
        this.toptips('请选择品质拆车');return false;
      }
   }
    if(!data.xsjg){
      this.toptips('请输入销售价格');return false;
    }
    if(!data.stock){
      this.toptips('请输入数量');return false;
    }
    if(!data.bzdw){
      this.toptips('请输入商品规格');return false;
    }
    if(!data.bzts){
      this.toptips('请选择质保时间');return false;
    }
    if(!data_.clause.length){
      this.toptips('请选择售后服务');return false;
    }
    if(!data_.batchIds.length){
      this.toptips('请选择车型');return false;
    }
    return;
    data['img']=data_.pics.toString()
    data['img_copy']=data_.img_copy.toString()
    data['cjcode']=data.cjcode.toString()
    data['clause']=data_.clause.join(',')
    data['model']=data_.batchIds.toString()
    data['content']=data.cat_name
    data['guige']=1
    data['num']=1
    data['zhid']=1072
    var that =this;
    wx.request({
      url: app.globalData.url+'service.php/commodity/upproducts',
      data:data,
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
          if(res.data.status=="200"){
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg,
              success: function () {
                wx.switchTab({
                  url: '/pages/index/index'
                });
              }
            });
          }else{
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg,
            });
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
  DataInfo:function(){
    if (app.globalData.userInfo) {
      this.setData({
         userInfo: app.globalData.userInfo,
      })
   } else if (this.data.canIUse){
     if(app.userInfoReadyCallback){
      app.userInfoReadyCallback = res => {
         this.setData({
           userInfo: res,
         })
       }
       console.log('有用户信息')
     }else{
      wx.getSetting({
        success: res => {
          // 判断是否授权过
          if (res.authSetting['scope.userInfo']) {
            console.log('授权登录了')
          }else{
            var value = wx.getStorageSync('userinfo')
            if(value){
               var timestamp = Date.parse(new Date());  
               timestamp = timestamp / 1000;
               var time = timestamp-value.past_time
               console.log(time)
               console.log('有缓存，执行了')
               if(time>=app.globalData.past_time){
                  wx.removeStorageSync('userinfo')//清除userinfo缓存
                  wx.navigateTo({
                     url: '/pages/newlogin/newlogin'
                  });
               }else{
                  this.setData({
                    userInfo: value,
                  })
               }
            }else{
               console.log('没有登录2')
               wx.navigateTo({
                  url: '/pages/newlogin/newlogin'
               });
            }
          } 
         }
       })
     }
   }
  },
  /**
   * 配件名称数据
  */
 parts:function(name=""){
    var that =this;
    wx.request({
      url: app.globalData.url+'service.php/commodity/getAllPj',
      data:{"name":name},
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method:'POST',
      success: function(res) {
          if(res.data.status=="200"){
            that.setData({
              pj_list:res.data.pjs,
              loading:'暂无数据',
              loadingHidden:true,
              pz_list:res.data.pz_list,
              pp_list:res.data.pp_list,
              servicelist:res.data.after_clause
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
      }
    })
 },
 /**                                                                                                                                                                                                                                                                                    
  * 配件名称搜索
 */
bindKeyInput:function(e){
  var name = e.detail.value
  var that =this;
  var cid ="list.cid"; 
  var cid_add ="list.cid_add"; 
  this.setData({
    pj_name:name,
    select3: true,
    loading:'数据加载中...',
    loadingHidden:false,
    [cid]:'',
    [cid_add]:name
  })
  this.parts(name)
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
    this.DataInfo()
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