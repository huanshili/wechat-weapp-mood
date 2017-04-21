var that;
var app = getApp();
var common = require('../template/getCode.js');
var Bmob = require('../../utils/bmob.js');
var textValue;
Page({
    data: {
        inputNum:'',
        signature:null,
        hiddenLoading:true
    },
    onLoad: function () {
        console.log('signature:onLoad');
        that = this;
    },
    onShow: function () {
        wx.getStorage({
          key: 'user_id',
          success: function(ress){
              if(ress.data) {
                  wx.getStorage({
                      key: 'my_signature',
                      success: function(res){
                          that.setData({
                              signature:res.data,
                              inputNum:30-res.data.length
                          })
                      }
                  })
              }
          }
        })
    },
    textChange: function (e) {
        
        this.setData({
            inputNum: 30-e.detail.value.length,
        })
        textValue=e.detail.value;
    },
    submit: function (e) {
        that.setData({
            hiddenLoading:false
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
                                users.set('signature', textValue);
                                users.save(null, {
                                    success: function(user) {
                                        wx.setStorageSync('my_signature', textValue);
                                        that.setData({
                                            hiddenLoading: true,
                                            signature:textValue
                                        });
                                        common.dataLoading("保存成功","success");
                                        setTimeout(wait,1000);                 
                                        function wait() {
                                            wx.navigateBack({                                  
                                                delta: 1, // 回退前 delta(默认为1) 页面
                                            })
                                        }
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