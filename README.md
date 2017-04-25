# wechat-weapp-mood

一个基于[xinyou](https://github.com/bmob/Bmob-wechatapp-xinyou)学习的小程序,某些页面作了简单修改，并完善了相应功能。


第一步：创建项目，记得填入你自己的AppId(必须填入AppId，不然无法调用wx.login())。

第二步：下载该demo。

第三步：在微信小程序管理后台中配置服务器域名为https://api.bmob.cn。

第四步：在Bmob后台创建应用，将你的AppID(小程序ID)和AppSecret(小程序密钥)填写到Bmob的微信小程序配置密钥中。

第五步：将你的Application ID和REST API Key替换app.js中的Bmob.initialize("", "")。

第六步：创建表和字段：

(1)在_User表中新建字段userPic(String),nickname(String),birthday(String),povince(String)
,signature(String),gender(Number)
,city(String).


(2)新建Diary表，新建字段publisher(Pointer)<关联_User>,pic(File),ikeNum(Number),is_hide(String),content(String),
commentNum(Number),liker(Array),position(Object).

(3)新建Comments表，新建字段publisher(Pointer)<关联_User表>,olderUserName(String),olderComment(Pointer)<关联Comments表>,mood(Pointer)<关联Diary表>,content(String)