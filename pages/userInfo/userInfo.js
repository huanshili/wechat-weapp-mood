var that;
var app = getApp();
var common = require('../template/getCode.js');
var Bmob = require('../../utils/bmob.js');

Page({
    data: {
        userImage:null,
        userName:null,
        address:null,
        gender:null,
        birthday:null,
        signature:null,
        isModifyNick:false,
        hiddenLoading:false,
        hiddenView:true,
        hiddenNickLoading:true,
        hiddenImageLoading:true,
        hiddenBirLoading:true
    },
    onLoad: function () {
        console.log('userInfo:onLoad');
        that = this;
    },
    onShow: function () {
        var myInterval = setInterval(getReturn,500);
        function getReturn() {
            wx.getStorage({
              key: 'user_id',
              success: function(ress){
                  if(ress.data) {
                      clearInterval(myInterval);
                      wx.getStorage({
                        key: 'my_avatar',
                        success: function(res){
                            that.setData({
                                userImage:res.data,
                                hiddenLoading:true,
                                hiddenView:false
                            })
                        }
                      });
                      wx.getStorage({
                        key: 'my_nick',
                        success: function(res){
                            that.setData({
                                userName:res.data,
                            })
                        }
                      });
                      var province;
                      wx.getStorage({
                        key: 'my_province',
                        success: function(res){
                            province = res.data;
                        }
                      });
                      wx.getStorage({
                        key: 'my_city',
                        success: function(res){
                            that.setData({
                                address:province+res.data,
                            })
                        }
                      });
                      wx.getStorage({
                        key: 'my_gender',
                        success: function(res){
                            if(res.data == 1) {
                                that.setData({
                                    gender:'男'
                                })
                            }else{
                                that.setData({
                                    gender:'女'
                                })
                            }
                            
                        }
                      });
                      wx.getStorage({
                        key: 'my_birthday',
                        success: function(res){
                            if(res.data ==null || res.data ==''){
                                that.setData({
                                    birthday:'未填写'
                                })
                            }else {
                                that.setData({
                                    birthday:res.data
                                })
                            }
                                
                        }
                      });
                      wx.getStorage({
                        key: 'my_signature',
                        success: function(res){
                            that.setData({
                                signature:res.data
                            })
                        }
                      })
                  }
              }
            })
        }
    },
    modifyImage: function () {
        wx.getStorage({
          key: 'user_id',
          success: function(ress){
              var key = ress.data;
              if(key) {
                  wx.showActionSheet({
                      itemList: ['相册','拍照'],
                      success: function(res) {
                          if(!res.cancel) {
                              var sourceType=[];
                              if(res.tapIndex==0) {
                                  sourceType=['album'] //从相册选择
                              }else if(res.tapIndex==1) {
                                  sourceType=['camera'] //拍照
                              }
                              wx.chooseImage({
                                count: 1, // 最多可以选择的图片张数，默认9
                                sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
                                sourceType: sourceType, // album 从相册选图，camera 使用相机，默认二者都有
                                success: function(imageResult){
                                  // 返回选定照片的本地文件路径列表，tempFilePath 可以作为img标签的src属性显示图片
                                  that.setData({
                                      hiddenImageLoading:false
                                  })
                                //   console.log(imageResult);
                                  var tempFilePaths = imageResult.tempFilePaths;
                                  if (tempFilePaths.length>0) {
                                      var name = tempFilePaths;
                                      var file = new Bmob.File(name,tempFilePaths);
                                      file.save().then(function (resu){
                                          wx.setStorageSync('my_avatar', resu.url());
                                          that.setData({
                                              hiddenImageLoading:true
                                          })
                                          var newImage = resu.url();
                                          wx.getStorage({
                                                key: 'my_username',
                                                success: function(ress){
                                                    if(ress.data) {
                                                        var my_username=ress.data;
                                                        wx.getStorage({
                                                            key: 'user_openid',
                                                            success: function(openid){
                                                                var openid = openid.data;
                                                                console.log(openid);
                                                                var user = Bmob.User.logIn(my_username,openid, {
                                                                    success: function (users) {
                                                                        users.set('userPic', newImage);
                                                                        users.save(null, {
                                                                            success: function(user) {                                     
                                                                                that.setData({
                                                                                    userImage:newImage
                                                                                })
                                                                                common.dataLoading("修改头像成功","success");
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            },function(error) {
                                                                console.log(error);
                                                            }
                                                        })
                                                    }
                                                },function(error) {
                                                    console.log(error);
                                                }
                                        })
                                      },function (error){
                                          that.setData({
                                              hiddenImageLoading:true
                                          });
                                          common.dataLoading(error,"loading");
                                          console.log(error);
                                      });
                                  } 
                                }
                              })
                          }
                      }
                  });
              }
          }
        })
        
    },
    modifyNickname: function () {
        that.setData({
            isModifyNick:true
        })
    },
    hiddenForm: function () {
        that.setData({
            isModifyNick:false,
        })
    },
    modifyNick: function (e) {
        that.setData({
            hiddenNickLoading:false
        })
        wx.getStorage({
          key: 'my_username',
          success: function(ress){
              if(ress.data) {
                  var my_username=ress.data;
                  wx.getStorage({
                    key: 'user_openid',
                    success: function(openid){
                        var openid = openid.data;
                        // console.log(openid);
                        var user = Bmob.User.logIn(my_username,openid, {
                            success: function (users) {
                                users.set('nickname', e.detail.value.changeNick);
                                users.save(null, {
                                    success: function(user) {
                                        var username = e.detail.value.changeNick;
                                        wx.setStorageSync('my_nick', username);
                                        that.setData({
                                            userName:username,
                                            isModifyNick:false,
                                            hiddenNickLoading:true
                                        })
                                        common.dataLoading("修改昵称成功","success");
                                    },
                                    error: function(error) {
                                        that.setData({
                                            isModifyNick:false,
                                            hiddenNickLoading:true
                                        })
                                        common.dataLoading(res.data.error,"loading");
                                    }
                                })
                            }
                        })
                    },function(error) {
                        console.log(error);
                    }
                  })
              }
          }
        })
    },
    modifySignature: function () {
        wx.navigateTo({
          url: '../signature/signature'
        })
    },
    bindDateChange:function (e) {
        that.setData({
            hiddenBirLoading: false
        })
         wx.getStorage({
          key: 'my_username',
          success: function(ress){
              if(ress.data) {
                  var my_username=ress.data;
                  wx.getStorage({
                    key: 'user_openid',
                    success: function(openid){
                        var openid = openid.data;
                        var user = Bmob.User.logIn(my_username,openid, {
                            success: function (users) {
                                console.log(e.detail.value);
                                users.set('birthday', e.detail.value);
                                users.save(null, {
                                    success: function(user) {
                                        wx.setStorageSync('my_birthday', e.detail.value);
                                        that.setData({
                                            hiddenBirLoading: true,
                                            birthday:e.detail.value
                                        })
                                        common.dataLoading("修改生日成功","success");
                                    }
                                })
                            }
                        })
                    },function(error) {
                        console.log(error);
                    }
                  })
              }
          },function(error) {
              console.log(error);
          }
        })
    }
})