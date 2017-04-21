var app = getApp();
var that;
var common = require('../template/getCode.js');
var Bmob = require('../../utils/bmob.js');
var id;
var moodRes;
Page({
  data:{
    showLoading:true,
    moodPic:"",
    moodContent:"",
    userPic:"",
    userNickname:"",
    publishTime:"",
    agreeNum:"",
    commNum:"",
    hiddenResLoading:true
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    console.log("onLoad======");
    that = this;
    id = options.id;
  },
  onShow: function (){
    console.log("onShow======");
    var myInterval = setInterval(getReturn,500);
    function getReturn() {
      wx.getStorage({
        key: 'user_id',
        success: function(res){
          if(res.data) {
            clearInterval(myInterval);
            var Diary = Bmob.Object.extend("Diary");
            var query = new Bmob.Query(Diary);
            query.include("publisher");
            query.get(id, {
              success: function(result) { 
                // 查询成功，调用get方法获取对应属性的值
                moodRes = result;
                console.log(result);
                var content = result.get("content");
                var pic = result.get("pic");
                var url;
                if(pic) {
                  url = pic._url;
                }else{
                  url = null;
                }
                
                var userPic = result.get("publisher").get("userPic");
                var userNickname = result.get("publisher").get("nickname");
                var publishTime = result.createdAt; 
                var commNum = result.get("commentNum");
                var agreeNum = result.get("likeNum");
                var liker = result.get("liker");
                var isLike=0;
                for(var j=0;j<liker.length;i++) {
                        if(liker[j] =res.data) {
                            isLike=1;
                            break;
                        }
                    }
                that.setData({
                  moodPic:url,
                  moodContent:content,
                  showLoading:false,
                  userPic:userPic,
                  userNickname:userNickname,
                  publishTime:publishTime,
                  agreeNum:agreeNum,
                  commNum:commNum,
                  isLiked:isLike
                })
                that.queryComment(result);
              },
              error: function(object, error) {
                // 查询失败
              }
            });
          }
        }
      });
    }
  },

  queryComment: function(mood) {
    var commentList = new Array();
    var Comments = Bmob.Object.extend("Comments");
    var query = new Bmob.Query(Comments);
    query.equalTo("mood",mood);
    query.include("publisher");
    query.descending("createdAt");
    query.find({
      success: function (result) {
        console.log(result);
        for(var i=0; i<result.length; i++){
          var commentId = result[i].id;
          var commContent = result[i].get("content");
          var publishTime = result[i].createdAt;
          var commentUsername = result[i].get("publisher").get("nickname");
          var commentUserpic = result[i].get("publisher").get("userPic");
          console.log(commentUserpic);
          var jsonA;
          jsonA = '{"id":"'+commentId+'","commContent":"'+commContent+'","commentUsername":"'+commentUsername+'","commentUserpic":"'+commentUserpic+'","publishTime":"'+publishTime+'"}'
          var jsonB = JSON.parse(jsonA);
          commentList.push(jsonB);
          that.setData({
            commentList:commentList,

          })
        }
      },
      error: function (error) {

      }
    });
  },

  like: function () {
    console.log("你好！");
    var isLike = that.data.isLiked;
    var likeNum = parseInt(that.data.agreeNum);

    if(isLike == "0") {
      likeNum = likeNum+1;
      that.setData({
        agreeNum:likeNum,
        isLiked:1
      })
    } else if(isLike == "1"){
      likeNum = likeNum-1;
      that.setData({
        agreeNum:likeNum,
        isLiked:0
      })
    }
    wx.getStorage({
      key: 'user_id',
      success: function(res){
        if(res.data) {
          var Diary = Bmob.Object.extend("Diary");
          var query = new Bmob.Query(Diary);
          query.get(id,{
            success: function (result) {
              var liker = result.get("liker");
              var liked = false;
              //如果有人点赞
              if(liker.length>0) {
                //判断有没本用户
                for(var i=0; i<liker.length; i++) {
                  //如果有，就把本用户删除
                  if(liker[i] == res.data) {
                    liker.splice(i,1);
                    liked=true;
                    result.set("likeNum",result.get("likeNum")-1);
                    break;
                  }
                }

                //如果不存在本用户
                if(liked == false){
                  liker.push(res.data);
                  result.set("likeNum",result.get("likeNum")+1);
                }

              }else {
                liker.push(res.data);
                result.set("likeNum",result.get("likeNum")+1);
              }
              result.save();
            },
            error: function (object,error) {
              //查询失败
            }
          })
        }
      }

    })
  },
  comment: function () {
    that.setData({
      isToResponse:true
    })
  },
  hiddenResponse: function () {
    that.setData({
      isToResponse:false
    })
  },
  seeBig: function () {
    wx.previewImage({
      current: that.data.moodPic, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [that.data.moodPic]
    })
  },
  publishComment: function (e){
    if(e.detail.value.commContent == "") {
      wx.showModal({
        title: '提示',
        content: '请填写心情内容',
        showCancel:false
      });
    }else {
      that.setData({
        hiddenResLoading:false
      })
      wx.getStorage({
        key: 'user_id',
        success: function(res){
          var user = new Bmob.Query(Bmob.User);
          user.get(res.data,{
            success: function (userRes) {
              var Comments = Bmob.Object.extend("Comments");
              var comment = new Comments();
              // var Diary = Bmob.Object.extend("Diary");
              // var diary = new Diary();
              // diary.id=optionId;
              var me = new Bmob.User();
              me.id = res.data;
              comment.set("publisher",me);
              comment.set("mood",moodRes);
              comment.set("content",e.detail.value.commContent);
              comment.save({
                success: function (result) {
                  console.log("评论成功");
                  
                  var Diary = Bmob.Object.extend("Diary");
                  var queryDiary = new Bmob.Query(Diary);
                  queryDiary.get(id,{
                    success:function(object) {
                      object.set("commentNum",object.get("commentNum")+1);
                      object.save();
                    }
                  })
                  that.setData({
                    hiddenResLoading:true,
                    isToResponse:false
                  });
                  
                  setTimeout(wait,500);                 
                  function wait() {
                      common.dataLoading("发布心情成功","success");
                  }
                  
                  that.onShow();
                  console.log("执行到这里了");
                },
                error: function () {

                }
              })
            },
            error: function (object,error) {

            }
          })
        }
      })
    }
  }
})