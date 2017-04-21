var app = getApp()
var that;
var common = require('../template/getCode.js');
var Bmob = require('../../utils/bmob.js');
Page({
    data: {
        userName:'',
        userImage:'',
        userSignature:'',
        loading:false,
        hiddenView:true
    },
    onLoad: function () {
        console.log('mine:onLoad');
    },
    onShow: function () {
        that = this;
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
                                loading:true,
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
                      wx.getStorage({
                        key: 'my_signature',
                        success: function(res){
                            that.setData({
                                userSignature:res.data
                            })
                        }
                      })
                  }
              }
            })
        }
    },
    suggestfn: function () {
        wx.navigateTo({
          url: '../feedback/feedback'
        })
    },
    settingfn: function () {
        wx.navigateTo({
          url: '../setting/setting'
        })
    },
    aboutfn: function () {
        wx.navigateTo({
          url: '../about/about'
        })
    },
    userinfofn: function () {
        wx.navigateTo({
          url: '../userInfo/userInfo',
        })
    }
})