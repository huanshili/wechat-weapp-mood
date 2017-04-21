//app.js
var Bmob=require("utils/bmob.js");
var common=require("utils/common.js");
Bmob.initialize("672fc3c23454e29a01df077f77c9ba42", "2d24d57d581a68cf42d9fa54d3174926");
App({
  //小程序初始化
  onLaunch: function () {
    try {
      var value = wx.getStorageSync('user_openid')
      if (value) {

      }else{
        wx.login({
          success: function(res){
            if (res.code) {
              //将code传到服务器获取openID和session_key
              Bmob.User.requestOpenId(res.code, {
                success: function(userData) {
                  wx.getUserInfo({
                    success: function(res){
                      var userInfo = res.userInfo;
                      var nickName = userInfo.nickName;
                      var avatarUrl = userInfo.avatarUrl;
                      var gender = userInfo.gender;
                      var province = userInfo.province;
                      var city = userInfo.city;
                      var signature;
                      var birthday;
                      Bmob.User.logIn(nickName, userData.openid, {
                        success: function(user) {
                          try {
                            wx.setStorageSync('user_openid', user.get("userData").openid);
                            wx.setStorageSync('user_id', user.id);
                            wx.setStorageSync('my_nick', user.get("nickname"));
                            wx.setStorageSync('my_username', user.get("username"));
                            wx.setStorageSync('my_avatar', user.get("userPic"));
                            wx.setStorageSync('my_gender', user.get("gender"));
                            wx.setStorageSync('my_province', user.get("province"));
                            wx.setStorageSync('my_city', user.get("city"));
                            wx.setStorageSync('my_signature', user.get("signature"));
                            wx.setStorageSync('my_birthday', user.get("birthday"));
                          }catch (e) {
                          }
                          console.log('登录成功')
                        },
                        error: function(user, error) {
                          console.log(error.code);
                          if(error.code == "101"){
                            //注册新用户
                            var user = new Bmob.User();
                            user.set("username", nickName);
                            user.set("password", userData.openid);//因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码    
                            user.set("nickname", nickName);
                            user.set("userPic", avatarUrl);
                            user.set("userData", userData);
                            user.set("gender", gender);
                            user.set("province", province);
                            user.set("city", city);
                            user.set("signature", signature);
                            user.set("birthday", birthday);
                            user.signUp(null, {
                              success: function(results) {
                                console.log("注册成功!");
                                try {//将返回的3rd_session储存到缓存
                                  wx.setStorageSync('user_openid', results.get("userData").openid);
                                  wx.setStorageSync('user_id', results.id);
                                  wx.setStorageSync('my_username', results.get("username"));
                                  wx.setStorageSync('my_nick', results.get("nickname"));
                                  wx.setStorageSync('my_avatar', results.get("userPic"));
                                  wx.setStorageSync('my_gender', results.get("gender"));
                                  wx.setStorageSync('my_province', results.get("province"));
                                  wx.setStorageSync('my_city', results.get("city"));
                                  wx.setStorageSync('my_signature', results.get("signature"));
                                  wx.setStorageSync('my_birthday', results.get("birthday"));
                                } catch (e) {

                                }
                              },
                              error: function(uesrData, error) {
                                console.log(error)
                              }
                            });
                          }
                        }
                      });
                    }
                  })
                },
                error: function(error) {
                  console.log("Error:" +error.code+""+error.message);
                }
              });
            }
          }
        });
      }
    }catch(e) {

    }
    wx.checkSession({
      success: function() {

      },
      fail: function() {
        wx.login()
      }
    })
  },

  // getUserInfo:function(cb){
  //   var that =this
  //   if(this.globalData.userInfo) {
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   }else {
  //     wx.login({
  //       success: function(){
  //         wx.getUserInfo({
  //           success: function(res){
  //             that.globalData.userInfo=res.userInfo
  //             typeof cb == "function" && cb(that.globalData.userInfo)
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  //监听小程序显示
  onShow:function(){
    
  },
  globalData:{
    // userInfo:null
  },
  //监听错误函数
  onError: function(msg) {
    
  }
})