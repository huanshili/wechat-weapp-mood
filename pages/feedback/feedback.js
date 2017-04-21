var that;
var app = getApp();
var common = require('../template/getCode.js');
var Bmob = require('../../utils/bmob.js');
var inputName;
var inputWechat;
var inputPhone;
var inputSuggest;
Page({
    data: {
        hiddenUp:false,
        hiddenDown:true
    },
    onLoad: function() {
        that=this;
    },

    inputName: function (e) {
        inputName = e.detail.value;
    },
    inputWechat: function (e) {
        inputWechat = e.detail.value;
    },
    inputPhone: function (e) {
        inputPhone = e.detail.value;
    },
    inputSuggest: function (e) {
        inputSuggest = e.detail.value;
    },
    
    back: function () {
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    
    submit: function () {
        if(inputSuggest == null || inputSuggest == "") {
            console.log('你好！！！');
            wx.showToast({
                title:'请填写意见！',
                duration:2000
            })
        }else {
            var Feedback = Bmob.Object.extend("feedback");
            var feedback = new Feedback();
            feedback.save({
                name:inputName,
                wechat:inputWechat,
                phone:inputPhone,
                suggest:inputSuggest
            },{
                success: function (result) {
                    that.setData({
                        hiddenUp:true,
                        hiddenDown:false
                    })
                },
                error: function (result,error) {

                }
            });
        }
        
    },
    onUnload: function () {
        inputName='';
        inputWechat='';
        inputPhone='';
        inputSuggest='';
    }



})