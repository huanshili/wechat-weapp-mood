var app = getApp();
var that;
var common = require('../template/getCode.js');
var Bmob = require('../../utils/bmob.js');
var moSquareList = new Array();
var k =0;
Page({
  data:{
    moodSquareList:[],
    limit: 5,
    showLoading:true,
    hasMore:true
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    that=this;
    console.log("onLoad======");
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    console.log("onReady======");
    // moSquareList.splice(0,moSquareList.length);
    var myInterval = setInterval(getReturn, 500);
    function getReturn () {
      wx.getStorage({
        key: 'user_id',
        success: function(ress){        
          if (ress.data) {           
            clearInterval(myInterval);
            var Diary = Bmob.Object.extend("Diary");
            var query = new Bmob.Query(Diary);
            var me = new Bmob.User();
            me.id=ress.data;
            query.equalTo("is_hide", "1");
            query.descending("createdAt");
            query.limit(that.data.limit);
            query.include("publisher");
            query.find({
              success: function (results) {
                
                console.log(results);
                for (var i = 0; i< results.length; i++) {
                  var jsonA;
                  var _url;
                  var publisherId = results[i].get("publisher").id;
                  var content = results[i].get("content");
                  var id = results[i].id;         
                  var created_at = results[i].createdAt;                
                  var commNum = results[i].get("commentNum");
                  var likeNum = results[i].get("likeNum");         
                  var pic = results[i].get("pic");

                  if(pic){
                    _url=results[i].get("pic")._url;
                  }else{
                      _url=null;
                  }


                  var location = results[i].get("location");
                  var nickName = results[i].get("publisher").get("nickname");
                  var userPic =  results[i].get("publisher").get("userPic");  
                  var liker = results[i].get("liker");  

                  
                  //判断这条心情用户是否点赞
                  var isLike = 0;
                  
                
                    
                  for(var j=0;j<liker.length;i++) {
                    if(liker[j] == ress.data) {
                        isLike=1;
                        break;
                    }
                  }
                 
                  
                  
                  
                  if(pic) {
                    jsonA = '{"content":"'+content+'","id":"'+id+'","avatar":"'+userPic+'","created_at":"'+created_at+'","attachment":"'+pic._url+'","likes":"'+likeNum+'","comments":"'+commNum+'","is_liked":"'+isLike+'","nickname":"'+nickName+'"}'
                  } else {
                    jsonA = '{"content":"'+content+'","id":"'+id+'","avatar":"'+userPic+'","created_at":"'+created_at+'","likes":"'+likeNum+'","comments":"'+commNum+'","is_liked":"'+isLike+'","nickname":"'+nickName+'"}'
                  }
                  var jsonB = JSON.parse(jsonA);
                  moSquareList.push(jsonB);
                  that.setData({
                    showLoading:false,
                    moodSquareList:moSquareList
                  });
                  console.log(that.data.moodSquareList);
                }
              },
              error: function () {
                console.log(error);
              }
            });
          }
          
        }
      })
    }
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    console.log("onShow======");
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    console.log("onHide======");
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    console.log("onUnload======");
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    console.log("onPullDownRefresh=======");
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
    
    wx.getStorage({
        key: 'user_id',
        success: function(ress){        
          if (ress.data) {           
            var Diary = Bmob.Object.extend("Diary");
            var query = new Bmob.Query(Diary);
            var me = new Bmob.User();
            me.id=ress.data;
            query.equalTo("is_hide", "1");
            query.descending("createdAt");
            query.limit(that.data.limit);
            var ph = that.data.limit+k;
            console.log(ph);
            query.skip(that.data.limit+k);
            k=k+that.data.limit;
            query.include("publisher");
            query.find({
              success: function (results) {
                if(results.length<=0){
                  that.setData({
                    hasMore:false
                  })
                }
                console.log(results);
                for (var i = 0; i< results.length; i++) {
                  var jsonA;
                  var _url;
                  var publisherId = results[i].get("publisher").id;
                  var content = results[i].get("content");
                  var id = results[i].id;         
                  var created_at = results[i].createdAt;                
                  var commNum = results[i].get("commentNum");
                  var likeNum = results[i].get("likeNum");
                  var pic = results[i].get("pic");
                  if(pic){
                    _url=results[i].get("pic")._url;
                  }else{
                      _url=null;
                  }
                  var location = results[i].get("location");
                  var nickName = results[i].get("publisher").get("nickname");
                  var userPic =  results[i].get("publisher").get("userPic");  
                  var liker = results[i].get("liker");  

                  //判断这条心情用户是否点赞
                  var isLike = 0;
                  for(var j=0;j<liker.length;i++) {
                      if(liker[j] == ress.data) {
                          isLike=1;
                          break;
                      }
                  }
                  if(pic) {
                    jsonA = '{"content":"'+content+'","id":"'+id+'","avatar":"'+userPic+'","created_at":"'+created_at+'","attachment":"'+_url+'","likes":"'+likeNum+'","comments":"'+commNum+'","is_liked":"'+isLike+'","nickname":"'+nickName+'"}'
                  } else {
                    jsonA = '{"content":"'+content+'","id":"'+id+'","avatar":"'+userPic+'","created_at":"'+created_at+'","likes":"'+likeNum+'","comments":"'+commNum+'","is_liked":"'+isLike+'","nickname":"'+nickName+'"}'
                  }
                  var jsonB = JSON.parse(jsonA);
                  moSquareList.push(jsonB);
                  that.setData({               
                    moodSquareList:moSquareList
                  });
                  console.log(that.data.moodSquareList);
                }
              },
              error: function () {
                console.log(error);
              }
            });
          }
          
        }
      })
    
  },

  moodDetail: function (e) {

    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../moodDetail/moodDetail?id='+data.id
    })
  }

  
  
})
