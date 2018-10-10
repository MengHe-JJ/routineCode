//logs.js
const windowWidth = wx.getSystemInfoSync().windowWidth;//屏幕的宽度
const windowHeight = wx.getSystemInfoSync().windowHeight;//屏幕的高度
const pixelRatio=wx.getSystemInfoSync().pixelRatio;//设备的像素比
var startX='',startY='',moveX='', moveY='';
Page({
  data: {
    src:'../../img/6.jpg',
    width:'',//画布的宽度
    height:'',//画布的高度
    imgWidth:'',//图片的宽度
    imgHeight:'',//图片的高度
    boxWidth: '',//盒子的宽度
    boxHeight: '',//盒子的高度
    left:'',
    top:'',
    right:'',
    bottom:'',
    boxTop:'',
    boxLeft:'',
    resScale: '',//图片的宽高比例
    scale:''//屏幕的宽高比例
  },
  onLoad: function (options) {
    var that=this;
   console.log(options.url,"loglog");
    that.setData({
      src:options.url
    })
    that.getImg();
  },
  //事件函数
/***  图片比例调整  ***/
getImg:function(){
  var that=this;
  var boxHeight = windowHeight-50;
  wx.getImageInfo({
    src:that.data.src,
    success:function(res){
      console.log(res,"图片的信息");
      var reswidth=res.width>windowWidth?windowWidth:res.width;
      var resHeight=res.height>boxHeight?boxHeight:res.height;
      that.data.scale = windowWidth / boxHeight;
      that.data.resScale=res.width/res.height;
     
      if (that.data.resScale > 1 || that.data.resScale==1) {
        that.data.boxTop = 100;
        reswidth=windowWidth;
        resHeight=windowWidth/that.data.resScale;
        that.data.left = Math.ceil((windowWidth - windowWidth / that.data.resScale)/2);
        that.data.top = Math.ceil((resHeight-windowWidth / that.data.resScale)/2);
        that.data.right = Math.ceil((windowWidth - windowWidth / that.data.resScale) / 2);
        that.data.bottom = Math.ceil((resHeight - windowWidth / that.data.resScale) / 2);
      }
      if(that.data.resScale<1 && that.data.resScale>that.data.scale){
        reswidth=windowWidth;
        resHeight = windowWidth / that.data.resScale;
        that.data.left = Math.ceil((windowWidth - windowWidth) / 2);
        that.data.right = Math.ceil((windowWidth - windowWidth) / 2);
        that.data.top = Math.ceil((resHeight - windowWidth) / 2);
        that.data.bottom = Math.ceil((resHeight - windowWidth) / 2);
      }
      
      if (that.data.resScale < that.data.scale){
       resHeight=boxHeight;
       reswidth = boxHeight * that.data.resScale;
       that.data.left = 0;
       that.data.right=0;
        that.data.top = Math.ceil((resHeight - reswidth) / 2);
        that.data.bottom = Math.ceil((resHeight - reswidth) / 2);
     }
     
     that.setData({
       imgWidth:reswidth,
       imgHeight:resHeight,
       boxWidth:reswidth,
       boxHeight:resHeight,
       boxTop:that.data.boxTop,
       scale:that.data.scale,
       resScale: that.data.resScale,
       left:that.data.left,
       top:that.data.top,
       right:that.data.right,
       bottom:that.data.top,
       width:reswidth-that.data.left-that.data.right,
       height:resHeight-that.data.top-that.data.bottom
     })
    }
  })
},
changeTouchStart:function(e){
  startX=e.touches[0].pageX;
  startY=e.touches[0].pageY;
  
},
changeTouchMoving:function(e){
  var that=this;
  moveX = startX - e.touches[0].pageX;
  moveY = startY - e.touches[0].pageY;
  var durX= moveX;
  var durY = moveY;
 
  if(durX>0){
    if(this.data.left-durX<0)durX=this.data.left
  }else{
    if(that.data.right+durX<0)durX=-that.data.right;
  }

  if(durY>0){
    if(that.data.top-durY<0)durY=that.data.top;
  }else{
    if(that.data.bottom+durY<0)durY=-that.data.bottom;
  }
  
  that.setData({
    left:that.data.left-durX,
    top:that.data.top-durY,
    right:that.data.right+durX,
    bottom:that.data.bottom+durY
  })
  //把新的值赋给老的值
  startX = e.touches[0].pageX;
  startY = e.touches[0].pageY;

},
changeTouchEnd:function(e){

},
//完成→获取图片
complete:function(){
  var that = this;
  var myCanvas = wx.createCanvasContext("myCanvas");
  wx.showLoading({
    title: '图片生成中...',
  })
  myCanvas.drawImage(that.data.src,0,0,that.data.imgWidth,that.data.imgHeight);
  myCanvas.draw(true,()=>{
    var cropW=(that.data.imgWidth-that.data.left-that.data.right);
    var cropH=that.data.imgHeight-that.data.top-that.data.bottom;
    var cropL=that.data.left;
    var cropT=that.data.top;
    wx.canvasToTempFilePath({
    x:that.data.left,
    y:that.data.top,
    width:cropW,
    height: cropH,
    destWidth:cropW*pixelRatio,
    destHeight: cropH*pixelRatio,
    canvasId:'myCanvas',
    success:function(res){
      wx.hideLoading();
      console.log(res.tempFilePath,"裁剪成功");
      wx.navigateTo({
        url: '../index/index?url=' + res.tempFilePath,
      }) 
    }
  })
  }
  );

  myCanvas.restore();
},
//取消按钮
navBack:function(){
  wx.navigateBack({
    url:'../index/index'
  })
}
})
