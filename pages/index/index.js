//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    src:'../../img/2.jpg'
  },
  //事件处理函数
chooseImg:function(){
  var that=this;
  wx.chooseImage({
    count:1,
    sizeType:['original','compressed'],
    sourType:['album','camera'],
    success: function(res) {
      var tempFilePath=res.tempFilePaths;
      console.log(tempFilePath);
      wx.navigateTo({
        url: '../logs/logs?url='+tempFilePath,
      })
      
    },
  })
},
  onLoad: function (options) {
    var _this=this;
    console.log(options,"首页获取图片路径");
    _this.setData({
      src:options.url
    })
  },

 
})
    