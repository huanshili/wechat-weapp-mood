var app = getApp();
var that;
var common = require('../template/getCode.js');
var Bmob = require('../../utils/bmob.js');
Page({
    data:{
        src:"",
        isSrc:false,
        content:"",
        locationName:"所在位置",
        locationLatitude:"",
        locationLongitude:"",
        whoCanSee:"仅自己可见",
        ishide:"0",
        hiddenLoading:true
    },
    onLoad: function () {
        that=this;
    },
    setContent: function (e) {
        that.setData({
            content:e.detail.value
        })
    },
    uploadPic: function () {
        wx.chooseImage({
          count: 1, // 最多可以选择的图片张数，默认9
          sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
          sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
          success: function(res){
              that.setData({
                  src:res.tempFilePaths,
                  isSrc:true
              })
          }
        })
    },
    deletePic: function () {
        that.setData({
            isSrc:false,
            src:""
        })
    },
    chooseLocation: function () {
        wx.chooseLocation({
          success: function(res){
              that.setData({
                  locationName:res.name,
                  locationLatitude:res.latitude,
                  locationLongitude:res.longitude
              })
          }
        })
    },
    chooseWho: function () {
        wx.showActionSheet({
            itemList: ['仅自己可见', '所有人可见'],
            success: function(res) {
                if(res.tapIndex == 0) {
                    that.setData({
                        whoCanSee:"仅自己可见",
                        ishide:"0"
                    })
                }else if (res.tapIndex == 1) {
                    that.setData({
                        whoCanSee:"所有人可见",
                        ishide:"1"
                    })
                }
            }
        })
    },
    submit: function (e) {
        
        if(that.data.content == "") {
            wx.showModal({
                title: '提示',
                content: '请填写心情内容',
                showCancel:false
            })
        } else {
            
            that.setData({
                hiddenLoading:false
            })
            wx.getStorage({
              key: 'user_id',
              success: function(ress){
                  var Diary = Bmob.Object.extend("Diary");
                  var diary = new Diary();
                  var me = new Bmob.User();
                  var location = {"locationName":that.data.locationName,"locationLatitude":that.data.locationLatitude,"locationLongitude":that.data.locationLongitude};
                  me.id =ress.data;
                  diary.set("content",that.data.content);
                  diary.set("is_hide",that.data.ishide);
                  diary.set("location",location);
                  diary.set("publisher",me);
                  diary.set("commentNum",0);
                  diary.set("liker",[]);
                  diary.set("likeNum",0);

                  if(that.data.isSrc == true) {
                      var name = that.data.src;
                      var file = new Bmob.File(name,that.data.src);
                      file.save();
                      diary.set("pic",file);
                  }

                  diary.save(null, {
                      success: function (result) {
                          
                          var pages = getCurrentPages();
                          if(pages.length >1) {
                              var prePage = pages[pages.length-2];
                              prePage.refresh(true);
                          }

                          that.setData({
                              hiddenLoading:true
                          });
                          
                          common.dataLoading("发布心情成功","success");
                          setTimeout(wait,1000);                 
                          function wait() {
                              wx.navigateBack({                                  
                                  delta: 1, // 回退前 delta(默认为1) 页面
                              })
                          }
                      },
                      error:function (result, error) {
                            console.log(error);
                            that.setData({
                                hiddenLoading:true
                            });
                            common.dataLoading("发布心情失败","loading");
                      }
                  })
              }
            })
        }

        

        
    }

})