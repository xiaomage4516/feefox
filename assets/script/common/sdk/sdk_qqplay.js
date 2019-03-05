cc.Class({
    extends: cc.Component,

    properties: {
        onEnterForeground : null,
        onEnterBackground : null,
        headCallback : null,
    },
    // 初始化一些参数
    init () {
        if (window.GameStatusInfo) {
            gameData.os = GameStatusInfo.platform;
        }
        this.onEnterForeground = {};
        this.onEnterBackground = {};
        var that = this;
        if (window.BK && BK.QQ) {
            // 切到前台
            if (BK.QQ.listenGameEventEnterForeground) {
                BK.QQ.listenGameEventEnterForeground({}, function () {
                    util.log("listenGameEventEnterForeground 回调");
                    BK.Script.log(1,0,"Foreground 回调");
                    let keys = Object.keys(that.onEnterForeground);
                    BK.Script.log(1,0,"tsc--hunter-----回到前台-----11111");
                    for (let i = 0; i < keys.length; i++) {

                        BK.Script.log(1,0,"hunter-----回到前台-----22222");
            
                        let key = keys[i];
                        BK.Script.log(1,0,"tsc--hunter-----回到前台-----33333"+key);
                        util.log("Foreground 监听key="+key);
                        let data = that.onEnterForeground[key];
                        BK.Script.log(1,0,"tsc--hunter-----回到前台-----44444");
                        data.handler.call(data.obj);
                        BK.Script.log(1,0,"tsc--hunter-----回到前台-----55555");
                      
                    }
                    BK.Script.log(1, 0, "tsc--hunter-----Foreground")
                });
            }
            // 切到后台
            if (BK.QQ.listenGameEventEnterBackground) {
                BK.QQ.listenGameEventEnterBackground({}, function () {
                    util.log("listenGameEventEnterBackground 回调");
                    BK.Script.log(1,0,"Background 回调");
                    let keys = Object.keys(that.onEnterBackground);
                    BK.Script.log(1,0,"tsc--hunter-----切到后台-----11111");                    
                    for (let i = 0; i < keys.length; i++) {
                        BK.Script.log(1,0,"tsc--hunter-----切到后台-----22222");                       
                        let key = keys[i];
                        BK.Script.log(1,0,"tsc--hunter-----切到后台-----33333"+key);
                        util.log("Background 监听key="+key);
                        let data = that.onEnterBackground[key];
                        BK.Script.log(1,0,"tsc--hunter-----切到后台-----44444");
                        data.handler.call(data.obj);
                        BK.Script.log(1,0,"tsc--hunter-----切到后台-----55555");
                    }
                    BK.Script.log(1, 0, "tsc--hunter-----Background")
                });
            }
            // 最大化
            if (BK.QQ.listenGameEventMaximize) {
                BK.QQ.listenGameEventMaximize({}, function () {
                    util.log("listenGameEventMaximize 回调");
                    BK.Script.log(1,0,"Maximize 回调");
                    let keys = Object.keys(that.onEnterForeground);
                    BK.Script.log(1,0,"hunter-----最大化-----11111");                    
                    for (let i = 0; i < keys.length; i++) {
                                            BK.Script.log(1,0,"hunter-----最大化-----22222");                    
                        let key = keys[i];
                                            BK.Script.log(1,0,"hunter-----最大化-----33333"+key);                    

                        util.log("Foreground 监听key="+key);
                        let data = that.onEnterForeground[key];
                                            BK.Script.log(1,0,"hunter-----最大化-----44444");                    

                        data.handler.call(data.obj);
                                            BK.Script.log(1,0,"hunter-----最大化-----55555");                    

                    }
                    BK.Script.log(1, 0, "hunter-----Maximize")
                });
            }
            // 最小化
            if (BK.QQ.listenGameEventMinimize) {
                BK.QQ.listenGameEventMinimize({}, function () {
                     BK.Script.log(1,0,"Minimize 回调");
                   
                    util.log("listenGameEventMinimize 回调");
                    let keys = Object.keys(that.onEnterBackground);
                                        BK.Script.log(1,0,"tsc--hunter-----最小化-----11111");                    

                    for (let i = 0; i < keys.length; i++) {
                                            BK.Script.log(1,0,"tsc--hunter-----最小化-----22222");                    

                        let key = keys[i];
                                            BK.Script.log(1,0,"tsc--hunter-----最小化-----33333"+key);                    

                        util.log("Background 监听key="+key);
                        let data = that.onEnterBackground[key];
                                            BK.Script.log(1,0,"tsc--hunter-----最小化-----44444");                    

                        data.handler.call(data.obj);
                                            BK.Script.log(1,0,"tsc--hunter-----最小化-----55555");                    

                    }
                    BK.Script.log(1, 0, "tsc--hunter-----Minimize")
                });
            }
        }
    },

    // 登录
    login () {
        // 如果登录开启选服，会设置部分值，此时使用设置的值
        gameData.sex = gameData.sex || GameStatusInfo.sex;
        gameData.openid = gameData.openid || GameStatusInfo.openId;
        gameData.headimgurl = gameData.headimgurl || GameStatusInfo.openId;
        gameData.hallSvrUrl = gameData.hallSvrUrl || "https://hnqp.feefox.cn";
        gameData.serverUrl = gameData.serverUrl || "wss://hnqp.feefox.cn/wss/mqtt";//振济
        gameData.loginSrc = gameData.loginSrc || GameStatusInfo.src;
        gameData.loginActionId = gameData.loginActionId || 0;
        gameData.actionMatchingGameLvl = gameData.actionMatchingGameLvl || 1;
        gameData.actionRoomId = gameData.actionRoomId || "";

        if (window.GameStatusInfo && GameStatusInfo.src === 201) {
            // 邀请进入游戏
            util.log("进入游戏参数 GameStatusInfo.gameParam="+GameStatusInfo.gameParam);
            var params;
            if (GameStatusInfo.gameParam) {
                util.log("hunter---11111");
                params = JSON.parse(GameStatusInfo.gameParam);
                util.log("hunter---22222");
            }
            util.log("hunter---33333");
            if (params) {
                util.log("hunter-----有房间号");
                gameData.actionRoomId = params.roomId;
            }
            util.log("hunter---44444");
            //roomId存在，是点击了房间内分享的链接进入游戏，若roomId不存在,则是点击了大厅内分享的链接进入游戏
            if (gameData.actionRoomId) {
                gameData.loginActionId = 3;
                util.log("hunter---55555");

            } else {
                gameData.loginActionId = 0;
                util.log("hunter---66666");
            }
            util.log("hunter---77777");
        }
        util.log("hunter---88888");
        let actionId = gameData.loginActionId;
        var url = gameData.hallSvrUrl + "/script/player/login?";
        url += ("platform="+config.platform);
        url += ("&openId="+gameData.openid);
        url += ("&sex="+gameData.sex);
        url += ("&headImageUrl="+gameData.headimgurl);
        url += ("&actionId="+actionId);
        url += ("&srcId="+gameData.loginSrc);
        url += ("&gameId="+gameData.loginActionGameId);
        url += ("&gameType="+config.getGameKindByLoginActionId(actionId));
        url += ("&gameLevel="+gameData.actionMatchingGameLvl);
        url += ("&roomId="+gameData.actionRoomId);
        url += ("&os="+gameData.os);
        url += ("&version="+config.version);
        util.log("hunter---99999");
        util.log(url);
        util.log("hunter---1010101010");

        let httpRequest = function (loginUrl) {
            util.warn(loginUrl);
            util.httpGet(loginUrl,
                function (response) {
                    util.warn("response==="+response);
                    var respJsonInfo = JSON.parse(response);
                    if (respJsonInfo["code"] == "0") {
                        //
                        util.warn("Login成功 +=== "+ respJsonInfo['msg']);
                        var msg = JSON.parse(respJsonInfo['msg']);
                        gameData.openid = msg['playerInfo']['openId'];
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
                        gameData.playHeadFrame = msg['PlayerDynamicInfo']['headFrame'];//头像框id
                        gameData.firstRecharge = msg['PlayerDynamicInfo']['firstRecharge'];//首充（是否显示幸运宝箱）
                        gameData.isSign = msg["loginSignInInfo"];//今日是否已经签到，0是未签到，1是已签到
                        gameData.isTipGrade = msg["bRankAward"];
                        gameData.isTipTask = msg["taskStatus"];
                        gameData.isTipMail_1 = msg["messageStatus"];
                        gameData.isTipMail_2 = msg["messageAwardsStatus"];
                        util.log("是否可以签到："+msg["loginSignInInfo"]);
                        util.log("是否可以签到2："+gameData.isSign);
                        gameData.nowSignNum = msg["weekSignDay"];//第几天
                        gameData.onlineNum = msg["onlineNum"];
                        //
                        cc.director.loadScene("hall");
                    } else {
                        let msg = "登录失败，请重试！\ncode="+respJsonInfo.code + " openID: " + gameData.openid + " name: " + gameData.nickname + " head: " + gameData.headimgurl;
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
        //
        util.warn("GameStatusInfo.openId: " + GameStatusInfo.openId);
        util.log("hunter---11_11_11_11_11");
        BK.MQQ.Account.getNick(GameStatusInfo.openId, function (openID,nick) {
            util.log("hunter---12_12_12_12_12");
            util.warn("BK.MQQ.Account.getNick, GameStatusInfo.openId: "+openID + ", nickName: "+nick);
            gameData.nickname = gameData.nickname || nick;
            url += ("&nickName="+encodeURIComponent(gameData.nickname));
            BK.QQ.fetchOpenKey(function (errCode, cmd, data) {
                if (errCode == 0) {
                    util.log("hunter---13_13_13_13_13");
                    url += ("&openKey="+data.openKey);
                    httpRequest(url);
                    // util.loadJsonFile("json/StopServerNotice",function(data){
                    //     util.log("hunter----isStopServer" + JSON.stringify(data));
                    //     //  0 未停服  1 已停服
                    //     if (data.isStopServer === '0') {
                    //         httpRequest(url);
                    //     } else if (data.isStopServer === '1') {
                    //         let msg = "游戏停服维护，请稍后重试!";
                    //         util.log(msg);
                    //         let node = cc.director.getScene().getChildByName("Canvas");
                    //         node.stopAllActions();
                    //         node.runAction(
                    //             cc.sequence(
                    //                 cc.delayTime(0.3),
                    //                 cc.callFunc(function () {
                    //                     util.tip({
                    //                         node : node,
                    //                         type : 2,
                    //                         string : msg,
                    //                         leftCallback : null,
                    //                         centerCallback : function () {
                    //                             sdk.closeGame();
                    //                         },
                    //                         rightCallback : null,
                    //                         isShowLeftBtn : false,
                    //                         isShowCenterBtn : true,
                    //                         isShowRightBtn : false,
                    //                         multi : false,
                    //                     });
                    //                 })
                    //             )
                    //         );
                    //     }
                    // })
                } else {
                    //
                    util.warn("error BK.QQ.fetchOpenKey errCode: " + errCode);
                }
            });
        });
    },

    // 邀请好友加入好友房
    inviteFriendToFriendGame (data) {
        // BK.QQ.shareToArk(
        //                  0,                     //自建后台写0
        //                  description,           //邀请时的文字描述
        //                  url,                   //邀请气泡的图片url
        //                  isFriendSelect,        //是否打开好友选择器
        //                  roomId                //房间ID（为string类型）
        //                 )
        var mapId = data.mapId;
        var kindId = data.kindId;
        var serverUrl = data.serverUrl;
        var roomId = data.roomId;
        util.warn("mapId: " + mapId + "kindId: " + kindId + "roomId: " + roomId);
        var description = "";
        if (mapId === config.HENAN_TUIDAOHU){
            description = "河南推倒胡 ";
        } else if (mapId === config.HENAN_ZHENGZHOU){
            description = "郑州麻将 ";
        } else if (mapId === config.HENAN_XINYANG){
            description = "信阳麻将 ";
        } else if (mapId === config.HENAN_NANYANG){
            description = "南阳麻将 ";
        } else if (mapId === config.HENAN_ZHOUKOU){
            description = "周口麻将 ";
        } else if (mapId === config.HENAN_SHANGQIU){
            description = "商丘麻将 ";
        } else if (mapId === config.HENAN_YONGCHENG){
            description = "永城麻将 ";
        } else if (mapId === config.HENAN_ZHUMADIAN){
            description = "驻马店麻将 ";
        } else if (mapId === config.HENAN_XINXIANG){
            description = "新乡麻将 ";
        }



        if (kindId === config.KIND_FRIEND){
            description = description + "好友房 ";
        } else if (kindId === config.KIND_MATE){
            description = description + "匹配类型 ";
        } else if (kindId === config.KIND_MATCH){
            description = description + "比赛类型 ";
        }
        description = description + "房间号:" + roomId;
        var url = "http://qmby.feefoxes.com/qipaiweb/hnqp/share/friend.png";
        var content = JSON.stringify({
            serverUrl : serverUrl,
            roomId : roomId,
            mapId : mapId,
            kindId : kindId,
        });
        util.log("分享链接 content="+content);
        BK.QQ.shareToArk(0, description, url, true, content);
    },

    //链接分享  将链接分享至聊天窗、空间、微信。 其他人该分享后，跳转至连接对应的网址
    shareURl(title, description, detailUrl, picUrl){
        // BK.QQ.shareToMQQ(
        //                  title,         //标题
        //                  description,   //描述
        //                  detailUrl,     //跳转到的Url
        //                  picUrl         //图片Url
        //                 )

        // BK.QQ.shareToMQQ("河南棋牌", "雀神在此，敢来挑战我吗？",
        //     "https://cmshow.qq.com/apollo/html/game-platform/index.html?_wv=16777219&gameId=2419",
        //     "http://qmby.feefoxes.com/qipaiweb/hnqp/share/activity.png");
        var description = "雀神在此，敢来挑战我吗？";
        var url = "http://qmby.feefoxes.com/qipaiweb/hnqp/share/friend.png";
        BK.QQ.shareToArk(0, description, url, true);
    },

    //图片分享 将游戏分享至手机QQ聊天窗。其他人点击该消息气泡后，会触发打开游戏
    shareImage(imageType,description,extendInfo,image){
        /* 
            imageType  
            0 本地路径下的图片 
            1 BK.Buffer中的图片 
            2 将某个节点进行截屏后的图片
        */
        if (imageType === 0){

            BK.QQ.shareToArkFromFile(0, description, extendInfo, image); //image为string类型

        } else if (imageType === 1) {

            BK.QQ.shareToArkFromBuff(0, description, extendInfo, image); //image为BK.Buffer对象

        } else if (imageType === 2) {

            BK.QQ.shareToArkFromNode(0, description, extendInfo, image); //image为node对象
        }
    },

    //根据玩家openID获取玩家头像
    getPlayerHead(openID, node, callback){
        if (!openID || !node) {
            return;
        }
        // util.log("获取玩家头像="+openID);
        if (openID.indexOf("/mahenan/headimg/") !== -1) {
            // 机器人
            util.loadUrlSprite(openID, node, callback);
            return;
        }
        this.headCallback = this.headCallback || {};
        this.headCallback[openID] = {
            node : node,
            callback : callback,
        };
        var that = this;
        BK.MQQ.Account.getHead(openID, function (openIDReturn, BuffInfo) {
            if(that.headCallback[openIDReturn])
            {

                // var buff0 = BK.FileUtil.readFile("GameRes://res/raw-assets/resources/json/DailyShareAward_Common.json");
                // var string0 = buff0.readAsString();
                // util.log("buffer_0_Length = "+ string0.length + " headinfoBuff ="+ string0);

                // var string1 = BuffInfo.buffer.readAsString();
                // util.log("buffer_1_Length = "+ string1.length + "headinfoBuff ="+ string1);

                // if (openID === gameData.openid) {
                //     var isFileExist = BK.FileUtil.isFileExist("GameSandBox://head.png");
                //     util.log("isFileExist = "+isFileExist);
                //     if (isFileExist === false) {
                //         gameData.headBuffInfo = BuffInfo;
                //         var succ = BK.Image.saveImage(BuffInfo.buffer, 100, 100, "GameSandBox://head", "png");
                //         util.log("保存头像图片 " + succ);
                //         if (succ === true) {
                //             var buff3 = BK.FileUtil.readFile("GameRes://res/raw-assets/resources/defaultHead.png");
                //             var string3 = buff3.readAsString();
                //             util.log("buffer_3_Length = "+ string3.length + " headinfoBuff ="+ string3);

                //             var buff2 = BK.FileUtil.readFile("GameSandBox://head.png");
                //             var string2 = buff2.readAsString();
                //             util.log("buffer_2_Length = "+ string2.length + "headinfoBuff ="+ string2);

                //             var url = gameData.hallSvrUrl + "/script/player/qqhead";
                //             util.httpPost(url,"headInfoBuffer="+string1);
                //         } 
                //     }
                // }
                var player = that.headCallback[openIDReturn];
                // util.log("获取到玩家头像="+openIDReturn);
                var texture = new cc.Texture2D();
                util.log("头像BuffInfo: " + JSON.stringify(BuffInfo));
                texture.initWithData(BuffInfo);
                texture.handleLoadedTexture();
                player.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                if (player.callback) {
                    player.callback(player.node);
                }
                that.headCallback[openIDReturn] = null;
            } else {
                //
                util.warn("error getPlayerHead openID != openIDReturn");
            }
        });
    },

    // 购买
    payPurchase (itemId, itemNum, callback) {
        var itemList = [
            {
                "itemId": itemId,    //道具id，非负整数
                "itemNum":itemNum     //道具数目，非负整数 
            }
        ];
        util.log("tsc sdk payPurchase");
        BK.QQ.qPayPurchase(3,true,itemList,function(errCode,data){
            // errCode == 0代表成功.其他错误码请查阅本节最下
            if(errCode == 0){
                util.log("tsc sdk payPurchase success");
                var itemList = data.itemList;
                for(i = 0;i<data.itemList.length;i++){
                    var itemId = itemList[i].itemId;
                    var itemNum = itemList[i].itemNum;
                }
                var gameId = data.gameId;
                util.log("tsc sdk fetchOpenKey");

                //购买道具成功之后，消耗道具
                var itemList = [
                    {
                        "id":itemId,    //道具id
                        "num":itemNum,   //数量
                    }
                ];
                BK.QQ.consumeItems(itemList,function(errCode,succList,failList){
                    if (errCode == 0) {
                        util.log("tsc sdk consumeItems success");
                        for(var i = 0 ; i<succList.length; i++ ){
                            //消耗成功的itemid
                            var succItemInfo = succList[i];
                            var id = succItemInfo.id; //道具ID
                            var seq = succItemInfo.seq; //用于标识当前消耗的流水号

                            //购买道具成功且消耗成功，向后台请求增加道具
                            if (callback) {
                                callback();
                            }
                        }

                        for(var i = 0 ; i<failList.length; i++ ){
                            //消耗失败的item
                            var faldItemInfo = failList[i];
                            var ret = faldItemInfo.ret; //失败返回码
                            var id = faldItemInfo.id; //道具ID
                        }
                    }
                })

                //购买道具的时候，暂时不进行鉴权操作
                // BK.QQ.fetchOpenKey(function (errCode, cmd, data) {
                //     util.log("tsc sdk fetchOpenKey success");
                //     if (errCode == 0) {
                //         util.log("tsc sdk fetchOpenKey success");
                //         if (callback) {
                //             callback(GameStatusInfo.openId, data.openKey);
                //         }
                //     } else {
                //         util.log("tsc sdk fetchOpenKey failed");
                //         //
                //         util.warn("error BK.QQ.fetchOpenKey errCode: " + errCode);
                //     }
                // });
            }else{
                util.log("tsc sdk payPurchase failed");
                  //errCode != 0代表购买失败
                util.warn("error BK.QQ.qPayPurchase errCode: " + errCode);
            }
        });
    },
    
    closeGame: function closeGame() {
        BK.QQ.notifyCloseGame();
    },
    hideGame: function hideGame() {
        BK.QQ.notifyHideGame();
    },

    
    //分数上报
    uploadPlayerScore(startTime,beansNum){
        var data = {
            userData: [
                {
                    openId: GameStatusInfo.openId,
                    startMs: startTime.toString(),    //必填。 游戏开始时间。单位为毫秒，<font color=#ff0000>类型必须是字符串</font>
                    endMs: ((new Date()).getTime()).toString(),  //必填。 游戏结束时间。单位为毫秒，<font color=#ff0000>类型必须是字符串</font>
                    scoreInfo: {
                        score: beansNum, // 分数，<font color=#ff0000>类型必须是整型数</font>
                        // 附加属性，最多 16 个，从 a1 ~ a16，不是必填的，<font color=#ff0000>类型必须是整型数</font>
                        // a1: winNum, //胜场数
                    },
                },
            ],
            // type 描述附加属性的用途
            // order 排序的方式，
            // 1: 从大到小，即每次上报的分数都会与本周期的最高得分比较，如果大于最高得分则覆盖，否则忽略
            // 2: 从小到大，即每次上报的分数都会与本周期的最低得分比较，如果低于最低得分则覆盖，否则忽略（比如酷跑类游戏的耗时，时间越短越好）
            // 3: 累积，即每次上报的积分都会累积到本周期已上报过的积分上
            // 4: 直接覆盖，每次上报的积分都会将本周期的得分覆盖，不管大小
            // 如score字段对应，上个属性.
            attr: {
                score: {   
                    type: 'rank',
                    order: 1,
                },
                // a1: {
                //     type: 'rank',
                //     order: 1,
                // }
            },
        };

        // gameMode: 游戏模式，如果没有模式区分，直接填 1
        // <font color=#ff0000>必须配置好周期规则后，才能使用数据上报和排行榜功能</font>
        var gameMode = 1;
        BK.QQ.uploadScoreWithoutRoom(gameMode, data, function(errCode, cmd, data) {
            // 返回错误码信息
            if (errCode !== 0) {
                BK.Script.log(1,1,'上传分数失败!错误码：' + errCode);
            } else {
                BK.Script.log(1,1,'上传成功 openid = ' + GameStatusInfo.openId + ' beansNum = ' + beansNum + "startTime = " + startTime);
            }
        });
    },

    // 获取所有道具
    getGameItemList () {
        BK.QQ.getGameItemList(function(errCode,cmd,data){
            BK.Script.log(0,0," reveive sso cmd = "+ cmd);
            util.warn("BK.QQ.getGameItemList errCode: " + errCode);
            var itemList = [];
            if(data){
                if(data.data){
                    if(data.data.itemList){
                        data.data.itemList.forEach(function(element) {
                            var item = {    
                             "id":element.id,               //道具ID 
                             "name":element.name,           //道具名称
                             "consumed":element.consumed,   //是否消耗型【0-非消耗型 1-消耗型】
                             "uinque":element.uinque,       //是否绝版【0-非绝版，1-绝版】
                             "iconUrl":element.iconUrl,     //素材iconurl
                             "curreInfo":element.curreInfo  //价格数组 因支持多货币，每个元素为某种货币的价格
                            //  "curreInfo":[
                            //                     {
                            //                     "curreType":3,    //3-游戏点券 4-二级货币（暂不能用）
                            //                     "price":1000     //价格
                            //                     }]    
                             }
                            itemList.push(item);
                            BK.Script.log(0,0,"id ="+ item.id + " name="+item.name+ " consumed="+item.consumed+" unique="+item.uinque+ " iconUrl="+item.iconUrl + " curreInfo="+item.curreInfo) ;   
                        }, this);
                    }
                }
            }
        })
    },
    // 获取玩家的道具信息
    getUserGameItems () {
        BK.QQ.getUserGameItems(data,function(errCode,cmd,data){
            BK.Script.log(0,0," reveive sso cmd = "+ cmd)
            var itemList = [];
            if(data){
                if(data.data){
                    if(data.data.itemList){
                        data.data.itemList.forEach(function(element) {
                            var item = {
                                "consumed": element.consumed,
                                "iconUrl":  element.iconUrl, 
                                "id": element.id, 
                                "name": element.name, 
                                "num": element.num
                            }
                            itemList.push(item);
                            BK.Script.log(0,0,"consumed="+ item.consumed + " iconUrl="+item.iconUrl + " id="+item.id + " name="+item.name + " num="+item.num) ;   
                        }, this);
                    }
                }
            }
        })
    },
    // 消耗道具
    consumeItems () {
        var itemlist = [
            {
                "id":1,    //道具id
                "num":1,   //数量
            },                
            {
                "id":2,    //道具id
                "num":1,   //数量
            }
        ]
        BK.QQ.consumeItems(itemlist,function(errCode,succList,failList){
            if (errCode == 0) {
                for(var i = 0 ; i<succList.length; i++ ){
                    //消耗成功的itemid
                     var succItemInfo = succList[i];
                    var id = succItemInfo.id; //道具ID
                    var seq = succItemInfo.seq; //用于标识当前消耗的流水号

                }
                for(var i = 0 ; i<failList.length; i++ ){
                    //消耗失败的item
                    var faldItemInfo = failList[i];
                    var ret = faldItemInfo.ret; //失败返回码
                    var id = faldItemInfo.id; //道具ID
                }
            }
        })
    },
    //获取手Q用户的点券
    getUserCoupons () {
        BK.QQ.getUserCurrencyInfo(1,function(errCode,cmd,data){
            if(errCode == 0){
                for(var i = 0 ; i < data.data.curreInfo.length; i++){
                    var curr = data.data.curreInfo[i];
                    var type = curr.curreType  //3- 游戏点券 目前只有一个3值
                    var bal  = curr.balance    //用户的点券数量
                    //util.warn("type " + type + " number " + bal);
                }
            }
        })
    },
    //播放音乐
    playMusic(path){
        //type(0:背景音乐，1：音效)  path(路径)  loopCount(重复次数，-1为循环)
        // BK.Audio.playMusic(0,path,-1);
        // var audioUrl = cc.url.raw(path);
        if(!gameData.musicHandle){
            util.log("gameData.musicHandle == null ");
            path = "GameRes://" + path;
            util.log("path ==  "+path);
            gameData.musicHandle = new BK.Audio(0,path,-1);
        }
        
        gameData.musicHandle.stopMusic();
        util.log("AudioSdk-- startMusic");
        gameData.musicHandle.startMusic(function(){util.log("startMusic");});
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
        if (!gameData.musicHandle) {
            return;
        }
        util.log("AudioSdk-- pauseMusic");
        gameData.musicHandle.pauseMusic();
    },
    //恢复音频
    resumeMusic(){
        if (!gameData.musicHandle) {
            return;
        }
        util.log("AudioSdk-- resumeMusic");
        gameData.musicHandle.resumeMusic();
    },
    //停止音频
    stopMusic(){
        if (!gameData.musicHandle) {
            return;
        }
        util.log("AudioSdk-- stopMusic");
        gameData.musicHandle.stopMusic();
        gameData.musicHandle = null;
    },
});