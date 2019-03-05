cc.Class({
    extends: cc.Component,

    properties: {
        onEnterForeground : null,
        onEnterBackground : null,
        bgmAudioID:-1,
    },

    // 初始化一些参数
    init () {
        gameData.os = "web";
        this.onEnterForeground = {};
        this.onEnterBackground = {};
    },

    // 登录
    login () {
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
        util.log(url);

        let httpRequest = function (loginUrl) {
            util.httpGet(url,
                function (response) {
                    util.log(response);
                    var respJsonInfo = JSON.parse(response);
                    if (respJsonInfo["code"] == "0") {
                        //
                        util.log("Login成功 +=== "+ respJsonInfo['msg']);
                        var msg = JSON.parse(respJsonInfo['msg']);
                        gameData.nickname = msg['playerInfo']['name'];
                        gameData.uid = msg['playerInfo']['playerId'];
                        gameData.headimgurl = msg['playerInfo']['headImageUrl'];
                        gameData.gameBean = msg['playerMoney']['happyBeans'];
                        gameData.gameDiamond = msg['playerMoney']['diamond'];
                        gameData.gameGradeXP = msg['PlayerDynamicInfo']['rankXp'];//段位经验值
                        gameData.playHeadFrame = msg['PlayerDynamicInfo']['headFrame'];//头像框id
                        gameData.firstRecharge = msg['PlayerDynamicInfo']['firstRecharge'];//首充（是否显示幸运宝箱）
                        gameData.isSign = msg["loginSignInInfo"];//今日是否已经签到，0是未签到，1是已签到
                        gameData.isTipGrade = msg["bRankAward"];
                        gameData.isTipTask = msg["taskStatus"];
                        gameData.isTipMail_1 = msg["messageStatus"];
                        gameData.isTipMail_2 = msg["messageAwardsStatus"];
                        gameData.matchLevelData_houduan = msg["matchLevel"];
                        util.log("是否可以签到："+msg["loginSignInInfo"]);
                        util.log("是否可以签到2："+gameData.isSign);
                        gameData.nowSignNum = msg["weekSignDay"];//第几天
                        gameData.onlineNum = msg["onlineNum"];
                        if(msg["playerInRoomInfoModel"]){
                            gameData.playerIsInRoom = msg["playerInRoomInfoModel"];
                        }
                        
                        //
                        if(msg["actionId"] == 0){//大厅
                            cc.director.loadScene("hall");
                        }
                        else if (msg.actionId === 1 || msg.actionId === 2 || msg.actionId === 3) {
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
                        if (gameData.needCheckSettings) {
                            util.checkOnlineSettings();
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
        }
  
        // var url = gameData.hallSvrUrl + "/script/";
        // url += "stopNotice/info";
        // util.log("停服公告开关 url = " + url);
        // util.httpGet(url,
        //     function (response) {
        //         var respJsonInfo = JSON.parse(response);
        //         util.log("是否停服respJsonInfo ========="+JSON.stringify(respJsonInfo));
        //         if(respJsonInfo["code"] == "0"){
        //             var msg = JSON.parse(respJsonInfo['msg']);
        //             var isStopServer = msg["stopNotice"];
        //             //  false 未停服  true 已停服
        //             if (isStopServer === false) {
        //                 httpRequest(url);
        //             } else if (isStopServer === true) {
        //                 util.tip2("游戏停服维护，请稍后重试。");
        //             }
        //         } else {
        //             util.log("停服公告开关获取失败 ===  "+respJsonInfo["code"]);
        //         }
        //     }
        // );
        httpRequest(url);
        // util.loadJsonFile("json/StopServerNotice",function(data){
        //     console.log("停服数据:",data);
        //     //  0 未停服  1 已停服
        //     if (data.isStopServer === '0') {
        //         httpRequest(url);
        //     } else if (data.isStopServer === '1') {
        //         util.tip2("游戏停服维护，请稍后重试。");
        //     }
        // })
},

    // 邀请好友房
    inviteFriendToFriendGame (data) {},

    // 分享链接
    shareURl(title, description, detailUrl, picUrl) {},

    // 分享图片
    shareImage(imageType,description,extendInfo,image) {},

    // 获取玩家头像
    getPlayerHead(openID, node, callback) {
        return;
        util.loadUrlSprite(openID, node, callback);
    },
    
    //分数上报
    uploadPlayerScore(startTime,beansNum) {},

    // 支付
    payPurchase (itemId, itemNum, callback) {},

    // 关闭游戏
    closeGame() {},

    // 缩小游戏
    hideGame() {},
    //播放音乐
    playMusic(path){
        this.bgmAudioID = cc.audioEngine.play(path,true,1);
    },
    
    //播放音效
    playEffect(path){
        //type(0:背景音乐，1：音效)  path(路径)  loopCount(重复次数，-1为循环)
        // BK.Audio.playMusic(1,path,1);
    },
    //设置音量大小
    setMusicVolume(){},
    //设置音效大小
    setEffectVolume(){},
    //暂停音频
    pauseMusic(path){
        cc.audioEngine.pause(this.bgmAudioID);
    },
    //恢复音频
    resumeMusic(){
        cc.audioEngine.resume(this.bgmAudioID);
    },
    //停止音频
    stopMusic(){
        cc.audioEngine.stop(this.bgmAudioID);
    },
});