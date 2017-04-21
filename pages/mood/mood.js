var app = getApp();
var that;
var common = require('../template/getCode.js');
var Bmob = require('../../utils/bmob.js');
var molist = new Array();
var k = 0;
Page({
  data:{
    moodList:[],
    limit: 10,
    hiddenLoading:true,
    isRefresh:false,
    hasMore:true,
    noData:false
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    that=this;
    console.log("onLoad======");
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    console.log("onReady======");
    molist.splice(0,molist.length);
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
            query.equalTo("publisher", me);
            query.descending("createdAt");
            query.limit(that.data.limit);
            query.find({
              success: function (results) {
                if(results.length<=0){
                  that.setData({
                    noData:true,
                    hiddenLoading:false
                  })
                }
                for (var i = 0; i< results.length; i++) {
                  var jsonA;
                  var jsonB;
                  var content = results[i].get("content");
                  var id = results[i].id;         
                  var created_at = results[i].createdAt;                
                  var ishide = results[i].get("is_hide");
                  var pic = results[i].get("pic");
                  var location = results[i].get("location");            
                  if(pic) {
                    jsonA = '{"content":"'+content+'","id":"'+id+'","created_at":"'+created_at+'","attachment":"'+pic._url+'","status":"'+ishide+'"}'
                  } else {
                    jsonA = '{"content":"'+content+'","id":"'+id+'","created_at":"'+created_at+'","status":"'+ishide+'"}'
                  }

                  console.log(jsonA);
                  // jsonB = JSON.parse(jsonA);
                  jsonB = JSON.parse(jsonA);
                  molist.push(jsonB);
                  that.setData({
                    hiddenLoading:false,
                    moodList:molist
                  });
                  console.log(that.data.moodList);
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
    
    if(that.data.isRefresh == true) {
      that.onReady();
    }
    that.setData({
        isRefresh:false
      });
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
            query.equalTo("publisher", me);
            query.descending("createdAt");
            query.limit(that.data.limit);
            query.skip(that.data.limit+k);
            k=k+that.data.limit;
            query.find({
              success: function (results) {
                if(results.length<=0){
                  that.setData({           
                    hasMore:false
                  })
                }
                for (var i = 0; i< results.length; i++) {
                  var jsonA;
                  var content = results[i].get("content");
                  var id = results[i].id;         
                  var created_at = results[i].createdAt;                
                  var ishide = results[i].get("is_hide");
                  var pic = results[i].get("pic");
                  var location = results[i].get("location");            
                  if(pic) {
                    jsonA = '{"content":"'+content+'","id":"'+id+'","created_at":"'+created_at+'","attachment":"'+pic._url+'","status":"'+ishide+'"}'
                  } else {
                    jsonA = '{"content":"'+content+'","id":"'+id+'","created_at":"'+created_at+'","status":"'+ishide+'"}'
                  }
                  var jsonB = JSON.parse(jsonA);
                  molist.push(jsonB);
                  that.setData({              
                    moodList:molist
                  });
                  console.log(that.data.moodList);
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
  refresh: function (isRefresh) {
    that.setData({
      isRefresh:isRefresh
    })
  },
  moodDetail: function (e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../moodDetail/moodDetail?id='+data.id
    })
  }
  
})
