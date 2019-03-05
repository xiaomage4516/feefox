cc.Class({
    extends: cc.Component,

    properties: {
        onEnterForeground : null,
        onEnterBackground : null,
        bgmAudioID : -1,
        //用户信息按钮
        userInfoButton : null,
    },

    // 初始化一些参数
    init () {
        if (window.wx) {
            var res = wx.getSystemInfoSync();
            util.log("hunter-------平台-----"+res.platform);
            gameData.os = res.platform;
            //显示小游戏右上角菜单中的转发选项
            wx.showShareMenu();
            //转发按钮选项的监听
            wx.onShareAppMessage(function() {
                return {
                    title: "飞狐河南棋牌",
                    imageUrl:"https://qmby.feefoxes.com/qipaiweb/hnqp/wechat/share.png",
                    /*查询字符串，从这条转发消息进入后，可通过 wx.onLaunch() 或 
                    wx.onShow 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。*/
                    query: "roomId",
                }
            })
        }
        this.onEnterForeground = {};
        this.onEnterBackground = {};
    },

   // 登录
    login (loadingScene) {
        util.log("hunter-----登录")


        var udid = "web_uid_" + Math.floor(Math.random()*1000000);
        gameData.sex = gameData.sex || 2;
        gameData.openid = gameData.openid || udid;
        gameData.nickname = gameData.nickname || "游客" + udid.substr(8, 14);
        gameData.headimgurl = gameData.headimgurl || "defaultHead";
        gameData.hallSvrUrl = gameData.hallSvrUrl || "http://192.168.199.81:8080";
        gameData.serverUrl = gameData.serverUrl || "ws://192.168.199.46:20000/mqtt";//振济
        gameData.loginSrc = gameData.loginSrc || 0;
        gameData.loginActionId = gameData.loginActionId || 0;
        gameData.actionMatchingGameLvl = gameData.actionMatchingGameLvl || 1;
        gameData.actionRoomId = gameData.actionRoomId || "";

        var launchOption = wx.getLaunchOptionsSync();
        util.log("query参数: " + JSON.stringify(launchOption));
        if (launchOption.scene === 1036) {
            if (launchOption.query.roomId === 0) {
                gameData.loginActionId = 0;
            } else {
                gameData.loginActionId = 3;
                gameData.actionRoomId = launchOption.query.roomId;
            }
        }

        var url = gameData.hallSvrUrl + "/script/player/login?";
        url += ("platform="+config.platform);
        url += ("&openId="+gameData.openid);
        url += ("&nickName="+encodeURIComponent(gameData.nickname));
        url += ("&sex="+gameData.sex);
        url += ("&headImageUrl="+gameData.headimgurl);
        url += ("&actionId="+gameData.loginActionId);
        url += ("&srcId="+gameData.loginSrc);
        url += ("&gameId="+config.loginActionDefaultGameId);
        url += ("&gameType="+config.getGameKindByLoginActionId(gameData.loginActionId));
        url += ("&gameLevel="+gameData.actionMatchingGameLvl);
        url += ("&roomId="+gameData.actionRoomId);
        url += ("&os="+gameData.os);
        url += ("&version="+config.version);
        util.log("hunter-----url---  0" + url);
        util.log(url);

        let httpRequest = function (loginUrl) {
            util.warn(loginUrl);
            util.log("hunter-----loginUrl---  1" + loginUrl);
            util.httpGet(loginUrl,
                function (response) {
                    util.warn("response==="+response);
                    // if (this.userInfoButton) {
                    //     //销毁用户信息按钮
                    //     this.userInfoButton.destroy();
                    // }
                    var respJsonInfo = JSON.parse(response);
                    if (respJsonInfo["code"] == "0") {
                        //
                        util.warn("Login成功 +=== "+ respJsonInfo['msg']);
                        var msg = JSON.parse(respJsonInfo['msg']);
                        gameData.openid = msg['playerInfo']['openId'];
                        gameData.wxOpenid = msg['wxAuthorize']['openid'];
                        gameData.wxSession = msg['wxAuthorize']['rd_session'];
                        gameData.nickname = msg['playerInfo']['name'];
                        gameData.uid = msg['playerInfo']['playerId'];
                        gameData.headimgurl = msg['playerInfo']['headImageUrl'];
                        gameData.gameBean = msg['playerMoney']['happyBeans'];
                        gameData.gameDiamond = msg['playerMoney']['diamond'];
                        gameData.gameGradeXP = msg['PlayerDynamicInfo']['rankXp'];//段位经验值
                        gameData.playHeadFrame = msg['PlayerDynamicInfo']['headFrame'];//头像框id
                        gameData.firstRecharge = msg['PlayerDynamicInfo']['firstRecharge'];//首充（是否显示幸运宝箱）
                        gameData.isSign = msg["loginSignInInfo"];//今日是否已经签到，0是未签到，1是已签到
                        gameData.matchLevelData_houduan = msg["matchLevel"];
                        util.warn("是否可以签到："+msg["loginSignInStatus"]);
                        util.warn("是否可以签到2："+gameData.isSign);
                        gameData.nowSignNum = msg["weekSignDay"];//第几天
                        gameData.onlineNum = msg["onlineNum"];//在线人数
                        if(msg["playerInRoomInfoModel"]){
                            gameData.playerIsInRoom = msg["playerInRoomInfoModel"];
                        }
                        //
                        if(msg["actionId"] == 0){//大厅
                            util.log("大厅场景loadScene开始");
                            cc.director.loadScene("hall");
                            util.log("大厅场景loadScene结束");
                        }
                        else if (msg.actionId == 1 || msg.actionId == 2 || msg.actionId == 3) {
                            if (config.forceConnectSelectGameSvr == false) {
                                // gameData.serverUrl = "ws://" + msg.serverInfo.ip
                                //     + ":" + msg.serverInfo.port + "/mqtt";
                                gameData.serverUrl = msg.serverInfo.url;
                            }
                            util.connectGameServer({
                                serverUrl : gameData.serverUrl,
                                openId : gameData.openid,
                                actionId : msg.actionId,

                                uid : gameData.uid,
                                mapId : msg.gameId,
                                mateLevel : msg.gameLevel,
                                roomId : msg.roomId,
                            });
                        }
                        //
                    } else if (respJsonInfo["code"] == "-5"){
                        // 房间不存在，直接进入大厅
                        util.warn("Login成功 +=== "+ respJsonInfo['msg']);
                        var msg = JSON.parse(respJsonInfo['msg']);
                        gameData.openid = msg['playerInfo']['openId'];
                        gameData.nickname = msg['playerInfo']['name'];
                        gameData.uid = msg['playerInfo']['playerId'];
                        gameData.headimgurl = msg['playerInfo']['headImageUrl'];
                        gameData.gameBean = msg['playerMoney']['happyBeans'];
                        gameData.gameDiamond = msg['playerMoney']['diamond'];
                        gameData.gameGradeXP = msg['PlayerDynamicInfo']['rankXp'];//段位经验值
                        gameData.firstRecharge = msg['PlayerDynamicInfo']['firstRecharge'];//首充（是否显示幸运宝箱）
                        gameData.isSign = msg["loginSignInInfo"];//今日是否已经签到，0是未签到，1是已签到
                        util.warn("是否可以签到："+msg["loginSignInStatus"]);
                        util.warn("是否可以签到2："+gameData.isSign);
                        gameData.nowSignNum = msg["weekSignDay"];//第几天
                        gameData.onlineNum = msg["onlineNum"];//在线人数
                        //
                        cc.director.loadScene("hall");
                    } else {
                        let msg = "登录失败，请重试！\ncode="+respJsonInfo.code;
                        util.log(msg);
                        let node = cc.director.getScene().getChildByName("Canvas");
                        node.stopAllActions();
                        node.runAction(
                            cc.sequence(
                                cc.delayTime(0.3),
                                cc.callFunc(function () {
                                    util.tip({
                                        node : node,
                                        type : 2,
                                        string : msg,
                                        leftCallback : null,
                                        centerCallback : function () {
                                            sdk.login();
                                        },
                                        rightCallback : null,
                                        isShowLeftBtn : false,
                                        isShowCenterBtn : true,
                                        isShowRightBtn : false,
                                        multi : true,
                                    });
                                })
                            )
                        );
                    }
                },
                function (statusText,responseText) {
                    let msg = "连接游戏大厅失败，请重试！";
                    util.log(msg);
                    let node = cc.director.getScene().getChildByName("Canvas");
                    node.stopAllActions();
                    node.runAction(
                        cc.sequence(
                            cc.delayTime(0.3),
                            cc.callFunc(function () {
                                util.tip({
                                    node : node,
                                    type : 2,
                                    string : msg,
                                    leftCallback : null,
                                    centerCallback : function () {
                                        sdk.login();
                                    },
                                    rightCallback : null,
                                    isShowLeftBtn : false,
                                    isShowCenterBtn : true,
                                    isShowRightBtn : false,
                                    multi : true,
                                });
                            })
                        )
                    );
                }
            );
        };
        //获取用户信息
        let wxGetUserInfo = function() {
            wx.getUserInfo({
                success: function(res) {

                    var userInfo = res.userInfo;
                    gameData.nickname = userInfo.nickName;
                    gameData.headimgurl = userInfo.avatarUrl + "?aaa=aa.jpg";
                    gameData.sex = userInfo.gender; //性别 0：未知、1：男、2：女

                    util.log("hunter-----nickName-----" + userInfo.nickName);
                    util.log("hunter-----headUrl-----" + userInfo.avatarUrl); 
                    util.log("hunter-----sex-----" + userInfo.gender);

                    util.log("hunter-----url---  1" + url);
                    
                    url += ("&code="+gameData.code);
                    url += ("&nickName="+encodeURIComponent(gameData.nickname));
                    url += ("&headImageUrl="+gameData.headimgurl);
                    url += ("&sex="+gameData.sex);
                    url += ("&wxType="+config.wxType);
                    util.log("hunter-----url---  2" + url);
                    httpRequest(url);
                },

                fail: function() {
                    // wx.openSetting({
                    //     success:function(res){
                    //         util.log("hunter-----打开权限设置");
                    //     }
                    // })
                }
            })
        };
        //创建用户信息按钮(以“加入游戏”的样式展现)
        var that = this;
        let createUserInfoButton = function () {
            var width = wx.getSystemInfoSync().screenWidth;
            var height = wx.getSystemInfoSync().screenHeight;
            util.log("微信接口获取的屏幕宽高 width: " + width + " height: " + height);
            let button = wx.createUserInfoButton({
                type: 'image',
                text: '获取用户信息',
                image: "https://qmby.feefoxes.com/qipaiweb/hnqp/wechat/beginBtn.png",
                style: {
                    left: width/2 - 75,
                    top: height*0.75,
                    width: 150,
                    height: 50,
                    lineHeight: 40,
                    backgroundColor: '#ff0000',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            });

            button.onTap(function(res){
                util.log("点击用户信息按钮 res: " + JSON.stringify(res));
                //同意授权用户信息 res.errMsg = "getUserInfo:ok"
                //拒绝授权用户信息 res.errMsg = "getUserInfo:fail auth deny"
                if (res.errMsg.indexOf("fail auth deny") !== -1) {
                    return;
                }

                var userInfo = res.userInfo;
                gameData.nickname = userInfo.nickName;
                gameData.headimgurl = userInfo.avatarUrl + "?aaa=aa.jpg";
                gameData.sex = userInfo.gender; //性别 0：未知、1：男、2：女

                util.log("hunter-----nickName-----" + userInfo.nickName);
                util.log("hunter-----headUrl-----" + userInfo.avatarUrl); 
                util.log("hunter-----sex-----" + userInfo.gender);

                url += ("&nickName="+encodeURIComponent(gameData.nickname));
                url += ("&headImageUrl="+gameData.headimgurl);
                url += ("&sex="+gameData.sex);
                util.log("hunter-----url---  3" + url);
                httpRequest(url);
                that.userInfoButton.destroy();
            })
            that.userInfoButton = button;
        }
        wx.login({
            success: function(res){
                util.log("hunter-----code-----" + res.code);
                gameData.code = res.code;
                url += ("&code="+gameData.code);

                //得到用户授权信息
                wx.getSetting({
                    success: function (res) {
                        var authSetting = res.authSetting
                        if (authSetting["scope.userInfo"] === true) {
                          // 用户已授权，可以直接调用相关 API
                          wxGetUserInfo();
                        } else if (authSetting["scope.userInfo"] === false){
                            // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                            // wx.openSetting({
                            //     success:function(res){
                            //         util.log("hunter-----打开权限设置界面");
                            //         if (res.scope.userInfo === true) {
                            //             wxGetUserInfo();
                            //         } 
                            //     }
                            // })
                            loadingScene.progressBar.node.active = false;
                            createUserInfoButton();
                        } else {
                            // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                            // wx.authorize({
                            //     scope: "scope.userInfo",
                            //     fail: function (res) {
                            //         // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                            //         if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
                            //           // 处理用户拒绝授权的情况
                            //           sdk.login();
                            //         }    
                            //     },
                            //     success: function (res) {
                            //         wxGetUserInfo();
                            //     }
                            // })
                            util.log("未询问过用户授权，创建用户信息按钮");
                            loadingScene.progressBar.node.active = false;
                            createUserInfoButton();
                            // var width = wx.getSystemInfoSync().screenWidth;
                            // var height = wx.getSystemInfoSync().screenHeight;
                            // util.log("微信接口获取的屏幕宽高 width: " + width + " height: " + height);
                            // let button = wx.createUserInfoButton({
                            //     type: 'image',
                            //     text: '获取用户信息',
                            //     image: "http://qmby.feefoxes.com/qipaiweb/hnqp/wechat/beginBtn.png",
                            //     style: {
                            //         left: width/2 - 100,
                            //         top: height*0.75,
                            //         width: 200,
                            //         height: 40,
                            //         lineHeight: 40,
                            //         backgroundColor: '#ff0000',
                            //         color: '#ffffff',
                            //         textAlign: 'center',
                            //         fontSize: 16,
                            //         borderRadius: 4
                            //     }
                            // });

                            // button.onTap(function(res){
                            //     util.log("点击用户信息按钮 res: " + JSON.stringify(res));
                            //     //同意授权用户信息 res.errMsg = "getUserInfo:ok"
                            //     //拒绝授权用户信息 res.errMsg = "getUserInfo:fail auth deny"
                            //     if (res.errMsg.indexOf("fail auth deny") !== -1) {
                            //         return;
                            //     }

                            //     var userInfo = res.userInfo;
                            //     gameData.nickname = userInfo.nickName;
                            //     gameData.headimgurl = userInfo.avatarUrl + "?aaa=aa.jpg";
                            //     gameData.sex = userInfo.gender; //性别 0：未知、1：男、2：女

                            //     util.log("hunter-----nickName-----" + userInfo.nickName);
                            //     util.log("hunter-----headUrl-----" + userInfo.avatarUrl); 
                            //     util.log("hunter-----sex-----" + userInfo.gender);

                            //     url += ("&nickName="+encodeURIComponent(gameData.nickname));
                            //     url += ("&headImageUrl="+gameData.headimgurl);
                            //     url += ("&sex="+gameData.sex);

                            //     httpRequest(url);
                            // })
                        }
                    }
                })
            }
        }) 
        //暂时先不用此方法(保留)
        // wx.checkSession({
        //     //用户处于登录态，可直接调用开放接口API
        //     success: function(){

        //         var code = cc.sys.localStorage.getItem("code") || 0;
        //         gameData.code = code;
        //         util.log("hunter-----本地code-----" + code);
        //         url += ("&code="+gameData.code);

        //         wx.getUserInfo({

        //             success: function(res) {
        //                 var userInfo = res.userInfo;
        //                 util.log("----------"+JSON.stringify(userInfo));
        //                 gameData.nickName = userInfo.nickName;
        //                 gameData.headimgurl = userInfo.avatarUrl + "?aaa=aa.jpg";
        //                 gameData.sex = userInfo.gender; //性别 0：未知、1：男、2：女

        //                 util.log("hunter-----nickName-----" + userInfo.nickName);
        //                 util.log("hunter-----headUrl-----" + userInfo.avatarUrl); 
        //                 util.log("hunter-----sex-----" + userInfo.gender);

        //                 url += ("&nickName="+encodeURIComponent(gameData.nickName));
        //                 url += ("&headImageUrl="+gameData.headimgurl);
        //                 url += ("&sex="+gameData.sex);

        //                 httpRequest(url);
        //             },

        //             fail: function() {
        //                 wx.openSetting({
        //                     success:function(res){
        //                         util.log("hunter-----打开权限设置");
        //                     }
        //                 })
        //             }
        //         })
        //     },
        //     //用户登录态失效，需重新授权登录
        //     fail: function(){
        //         //登录态过期
        //         wx.login({

        //             success: function(res){

        //                 util.log("hunter-----新code-----" + res.code);
        //                 cc.sys.localStorage.setItem('code', res.code);
        //                 gameData.code = res.code;
        //                 url += ("&code="+gameData.code);

        //                 wx.getUserInfo({

        //                     success: function(res) {

        //                         var userInfo = res.userInfo;
        //                         gameData.nickname = userInfo.nickName;
        //                         gameData.headimgurl = userInfo.avatarUrl + "?aaa=aa.jpg";
        //                         gameData.sex = userInfo.gender; //性别 0：未知、1：男、2：女

        //                         util.log("hunter-----nickName-----" + userInfo.nickName);
        //                         util.log("hunter-----headUrl-----" + userInfo.avatarUrl); 
        //                         util.log("hunter-----sex-----" + userInfo.gender);

        //                         url += ("&nickName="+encodeURIComponent(gameData.nickname));
        //                         url += ("&headImageUrl="+gameData.headimgurl);
        //                         url += ("&sex="+gameData.sex);

        //                         httpRequest(url);
        //                     }
        //                 })
        //             }
        //         }) 
        //     }
        // });
    },

    // 邀请好友房
    inviteFriendToFriendGame (data) {
        var roomId = data.roomId;

        wx.shareAppMessage({
            title: "飞狐河南棋牌",
            imageUrl:"https://qmby.feefoxes.com/qipaiweb/hnqp/wechat/share.png",
            /*查询字符串，从这条转发消息进入后，可通过 wx.onLaunch() 或 
            wx.onShow 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。*/
            query: "roomId=" + roomId, 
            success: function(){},
            fail: function(){}
        })
    },

    // 分享链接
    shareURl(title, description, detailUrl, picUrl) {
        var roomId = 0;
        wx.shareAppMessage({
            title: "飞狐河南棋牌",
            imageUrl:"https://qmby.feefoxes.com/qipaiweb/hnqp/wechat/share.png",
            /*查询字符串，从这条转发消息进入后，可通过 wx.onLaunch() 或 
            wx.onShow 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。*/
            query: "roomId=" + roomId, 
        })
    },

    // 分享图片
    shareImage(imageType,description,extendInfo,image) {},

    // 获取玩家头像
    getPlayerHead(openID, node, callback) {
        util.loadUrlSprite(openID, node, callback);
    },

    // 支付
    payPurchase (itemId, itemNum, callback) {
        wx.requestMidasPayment({
            mode: "game",           //支付类型 
            env: 1,                 //0 米大师正式环境 1 米大师沙箱环境
            offerId: 1450014661,    //在米大师平台为应用申请的ID
            zoneId: "1",            //分区 ID
            currencyType: "CNY",    //币种 人民币
            platform: "android",    //支付平台
            /*钻石的数量 只能为
            10、30、60、80、120、180、250、300、400、
            450、500、600、680、730、780、880、980、
            1080、1180、1280、1480、1680、1880、1980、3280、6480*/
            buyQuantity: 10, 
            success: function(){},  //调用成功的回调
            fail: function(){}      //调用失败的回调       
        })
    },

    // 关闭游戏
    closeGame() {},

    // 缩小游戏
    hideGame() {},

    uploadPlayerScore() {},

    //播放音乐
    playMusic(path){
        this.bgmAudioID = cc.audioEngine.play(path,true,1);
        // this.innerAudioContext = wx.createInnerAudioContext();
        // this.innerAudioContext.src = path;
        // this.innerAudioContext.autoplay = true;
        // this.innerAudioContext.loop = true;
        // this.innerAudioContext.play();
    },
    //暂停音乐
    pauseMusic(path){
        cc.audioEngine.pause(this.bgmAudioID);
        // this.innerAudioContext.pause();
    },
    //恢复音乐
    resumeMusic(){
       cc.audioEngine.resume(this.bgmAudioID);
       // this.innerAudioContext.play();
    },
    //停止音乐
    stopMusic(){
        cc.audioEngine.stop(this.bgmAudioID);
        // this.innerAudioContext.stop();
        // this.innerAudioContext.destroy();
    },
    //播放音效
    playEffect(path){},
    //设置音量大小
    setMusicVolume(){},
    //设置音效大小
    setEffectVolume(){},
    //获取屏幕分辨率
    getScreenSize() {
        var res = wx.getSystemInfoSync()
        //像素比
        var pixelRatio = res.pixelRatio;
        return {
            width : res.screenWidth*pixelRatio,
            height : res.screenHeight*pixelRatio,
        }
    }
});