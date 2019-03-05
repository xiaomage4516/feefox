// 工具类
cc.Class({
    extends: cc.Component,

    properties: {
        isResMess : false,    // 
        //isHttpReqComplete : false, //网络请求是否完成
    },
    getNativeVersion : function () {
        if (!cc.sys.isNative)
            return '1.0.0';
    /*
        if (cc.sys.os === cc.sys.OS_IOS) {
            return jsb.reflection.callStaticMethod(
                "AppController",
                "getVersionName"
            );
        }
        else {
            return jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "getVersionName",
                "()Ljava/lang/String;"
            );
        }
    //*/
    },

    log : function (str) {
        if (config.log_flag) {
            console.log("tsc---uid="+gameData.uid+" time="+(new Date().getTime())/1000+"   " + str);
        }
        this.uilogshow(str);
    },
    warn : function (str) {
        if (config.warn_flag) {
            console.warn("tsc---uid="+gameData.uid+" time="+(new Date().getTime())/1000+"   " + str);
        }
        this.uilogshow(str);
    },
    error : function (str) {
        if (config.error_flag) {
            console.error(str);
        }
        this.uilogshow(str);
    },
    isNotchPhone (width,height){
        if(width == 2280 && height == 1080){
            return true;
        }else if(width == 2240 && height == 1080){
            return true;
        }else if(width == 2244 && height == 1080){
            return true;
        }else if(width == 2040 && height == 1080){
            return true;
        }else if(width == 2340 && height == 1080){
            return true;
        }else if(width == 4096 && height == 2160){
            return true;
        }else if(width == 2436 && height == 1125){
            return true;
        }else{
            return false;
        }
    },

    uilogshow : function (lineStr) {
        //--begin
        {
            if (window.cc && cc.director && cc.director.getScene()) {
                var sceneName = cc.director.getScene().name;
                var canvas = cc.director.getScene().getChildByName("Canvas");
                if (sceneName == "loading") {

                    var script = canvas.getComponent("LoadingScene");
                    script.uiLogAppendToTheScrollViewUI(lineStr);

                } else if (sceneName == "hall") {

                    var script = canvas.getComponent("HallScene");
                    script.uiLogAppendToTheScrollViewUI(lineStr);

                } else if (sceneName == "game") {

                    var script = canvas.getComponent("GameScene");
                    script.uiLogAppendToTheScrollViewUI(lineStr);

                }
            }

        }
        //--end
    },

    // 设置本地存储
    setLocalValue : function (key, value) {
        cc.sys.localStorage.setItem(key, value);
    },
    // 获取本地存储
    getLocalValue : function (key) {
        return cc.sys.localStorage.getItem(key);
    },
    //发牌顺序 1 从小到大   -1  从大到小
    // getSortFlag : function(){
    //     var flag = 1;
    //     return  flag;
    // },
    checkUpdate : function () {
        this.log("util check update");
        if (cc.sys.isNative) {
            return false;
        }
        this.log("util check update over");
    },

    saveLocalOnlineSettings : function () {
    
        this.setLocalValue("musicStatus", gameData.musicStatus);
        this.setLocalValue("soundEffectStatus", gameData.effectStatus);
        this.setLocalValue("shakeStatus", gameData.shakeStatus);
        util.log("设置本地存储-------gameData.musicStatus=="+gameData.musicStatus);
        util.log("设置本地存储-------gameData.effectStatus=="+gameData.effectStatus);
        util.log("设置本地存储-------gameData.shakeStatus=="+gameData.shakeStatus);
        //
        if (gameData.musicStatus == 2) {//1是开  2是关
            //0 和 '0' 都是false
            // cc.audioEngine.setMusicVolume(0);
            cc.audioEngine.setMusicVolume(1);//播放空音乐，设置成1
        }

        if (gameData.effectStatus == 2) {
            //0 和 '0' 都是false
            // cc.audioEngine.setEffectsVolume(0);
            audioUtils.setSFXVolume(0);//by majiangfan
        }

    },


    /**
     * 本地没有存储Settings信息时，向服务器请求
     * 请求到后，存本地存储
     * */
    checkOnlineSettings : function () {

        this.getSettingStatus(
            function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){
                    var msg = JSON.parse(respJsonInfo['msg']);

                    var settingData = msg["gameSetting"];
                    //
                    gameData.musicStatus = settingData["musicStatus"];//gameData.musicStatus 1 是开 2 是关
                    gameData.effectStatus = settingData["soundEffectStatus"];//gameData.effectStatus 1 是开 2 是关
                    gameData.shakeStatus = settingData["shakeStatus"];//gameData.shakeStatus 1 是开 2 是关
                    util.log("向服务器请求-------gameData.musicStatus=="+gameData.musicStatus);
                    util.log("向服务器请求-------gameData.effectStatus=="+gameData.effectStatus);
                    util.log("向服务器请求-------gameData.shakeStatus=="+gameData.shakeStatus);
                    //
                    util.saveLocalOnlineSettings();

                } else {
                    util.log("getsettingStatus ===  " + respJsonInfo["code"]);
                }
            },
            null,null);

    },

    initGame : function () {
        this.log("util initGame");
        // 初始化游戏

        // 设置屏幕常亮
        if (cc.sys.isNative && cc.Device && cc.Device.setKeepScreenOn) {
                cc.Device.setKeepScreenOn(true);
        }

       

        // 资源格式
        cc.Texture2D.defaultPixelFormat = cc.Texture2D.PIXEL_FORMAT_AUTO;
        
        // 检查热更新
        this.checkUpdate();

        //加载任务奖励表
        util.loadJsonFile("json/GameTaskInfoZi_Common", function (data) {
            console.log("奖励数据:",data);
            config.rewardTabel = data;
        });
        //加载任务表
        util.loadJsonFile("json/GameTaskInfo_Common", function (data) {
            console.log("表格数据:",data);
            config.taskTabel = data;
        });
        //加载每日分享奖励表
        util.loadJsonFile("json/DailyShareAward_Common", function (data) {
            config.ShareAwardTabel =data;
        });
        //加载道具表
        util.loadJsonFile("json/GamePropInfo_Common", function (data) {
            config.PropInfoData =data;
        });


    },
    addClickEvent : function(node,target,component,handler,customEventData){
        util.log("addClickEvent "+component + ":" + handler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        eventHandler.customEventData = customEventData;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },

    //HTTP
    httpGet : function (url, cbSucc, cbFail) {
        util.log("hunter--showWait---111");
        this.scheduleOnce(function() {
            if(!this.isResMess){
            //     util.hideWait();
            // }else{
                util.showWait(5);
            }else{
                this.isResMess = false;
            }
        }, 0.5);
        util.log("hunter--showWait---222");
        var flag = false;
        util.log("http ----------"+url);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        if (cc.sys.isNative) {
            //xhr.setRequestHeader("Accept", "*/*");
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
            // xhr.setRequestHeader("User-Agent", "curl/7.27.0");
            // xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36");
        }
        // xhr.setRequestHeader("User-Agent", "curl/7.27.0");
        // xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
        // xhr.setRequestHeader("Accept-Encoding", "deflate");
        var self = this; 
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // cc.log(xhr.responseText);
                    util.hideWait();
                    util.log("hunter--showWait---re");
                    self.isResMess = true;
                    cbSucc(xhr.responseText);
                }
                else {
                    if (!flag) {
                        flag = true;
                        cbFail(xhr.statusText, xhr.responseText);
                    }
                }
            }
        };
        xhr.onerror = function () {
            if (!flag) {
                flag = true;
                cbFail(xhr.status, null);
            }
        };
        xhr.send();
    },
    
    httpPost : function (url, data, ajaxSuccess, ajaxError) {
        // util.showWait(8);
        this.scheduleOnce(function() {
            if(!this.isResMess){
            //     util.hideWait();
            // }else{
                util.showWait(8);
            }else{
                this.isResMess = false;
            }
        }, 0.5);

        if (typeof data === 'string') {
            data = data;
        }else{
            data = JSON.stringify(data);
        }
        var self = this;
        // data = isString(data) ? data : JSON.stringify(data);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8"); 
        // xhr.setRequestHeader("Content-Length", data.length);
        xhr.onreadystatechange = function () {
            var result, error = false;
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status == 0) {
                    var dataType = xhr.getResponseHeader('content-type');
                    result = xhr.responseText;
                    // cc.log("resultPost" + result);
                    // try {
                    //     if (dataType.indexOf('json')) result = JSON.parse(result);
                    // } catch (e) {
                    //     error = e;
                    // }
    
                    if (error) {
                        ajaxError(error, 'parsererror', xhr);
                    }else {
                        util.hideWait();
                        self.isResMess = true;
                        ajaxSuccess(result, xhr);
                    }
                } else {
                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr);
                }
            }
        };
        xhr.onerror = function () {
            ajaxError(xhr.statusText || null);
        };
        // xhr.send(Base64.encode(data));
        xhr.send(data);
    },


    //签到界面 签到按钮
    getSignStatus:function(rewardId,callBack, uid, unionid){
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        var pString = "?playerId="+playId
            +"&id="+rewardId;
        this.httpGet(url+'login/signin'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //点击头像
    getInfoStatus : function (playid,callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/player/";
        // var playId = uid || gameData.uid;
        var pString = "?playerId="+playid;
        // this.httpGet(url+'info'+pString,
        //     function (response) {
        //         var respJson = JSON.parse(response);
        //         callBack(respJson);
        //     },
        //     function (statusText,responseText) {
        //     }
        // );
        var postString = "playerId="+playid;
        this.httpPost(url+'info',postString,
        function (response,xhr) {
            var respJson = JSON.parse(response);
            callBack(respJson);
        },
        function (error,type,xhr) {
        });
    },
    //点击段位按钮
    getAwardStatus : function (callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/player/";
        var playId = gameData.uid;
        // var playId = 104378;
        var pString = "?playerId="+playId;
        this.httpGet(url+'rank/award'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //段位界面领取按钮接口
    getGetAwardStatus : function (rankId,callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/player/";
        var playId = gameData.uid;
        // var playId = 45041089;
        var pString = "?playerId="+playId
            +"&rankId="+rankId;
        this.httpGet(url+'rank/get/award'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //点击邮件按钮
    getMailStatus : function (callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 101401;
        var pString = "?playerId="+playId;
        this.httpGet(url+'mail/message'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //点击背包按钮
    getCheckBagStatus : function (callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 101401;
        var pString = "?playerId="+playId;
        this.httpGet(url+'backpack/allcheck'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //背包使用按钮
    getBagUseStatus : function (propId,propOnlyId,callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 101401;
        var pString = "?playerId="+playId
                +"&id="+propId
                +"&onlyId="+propOnlyId;
        util.log("pString =====" +pString);
        this.httpGet(url+'backpack/useprop'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    // 幸运宝箱购买接口
    getBuyBoxStatus : function (data) {
        var openId = data.openId;
        var openKey = data.openKey;
        var callBack = data.callBack;
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 102941;
        var pString = "?playerId="+playId;
        if (openId && openKey) {
            pString = pString +"&openId="+openId;
            pString = pString +"&openKey="+openKey;
        }
        this.httpGet(url+'pay/first'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //邮件子界面领取奖励按钮
    getReceiveMailStatus : function (messageOnlyId,messageId,callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 19034660;
        var pString = "?messageOnlyId="+messageOnlyId
                    +"&playerId="+playId + "&messageId="+messageId;
        this.httpGet(url+'mail/message/getawards'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //
    getMailChaKanStatus : function (messageOnlyId,callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 101401;
        var pString = "?messageOnlyId="+messageOnlyId
            +"&playerId="+playId;
        this.httpGet(url+'mail/message/check'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    // shenhe显示信阳，之后显示跑的快
    getIsShowPdk: function (callBack) {
        var random = Math.floor(Math.random()*10).toString();
        var url = "https://qmby.feefoxes.com/qipaiweb/hnqp/pdkbtn_switch.json?"+random;
        this.httpGet(url,
            function (response) {
                var respJson = JSON.parse(response);
                util.log("mjf test -- "+respJson);
                callBack(respJson);
            }
        );
    },
    //设置按钮
    getSettingStatus : function (callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/";
         var playId = gameData.uid;
        //var playId = 19034660;
        var pString = "?playerId="+playId;
        this.httpGet(url+'game/querysetting'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                console.log("设置:",respJson);
                callBack(respJson);
            },
            function (statusText,responseText) {

            }
        );
    },
    // 更新设置
    getUpdateSettingStatus : function (musicStatus,effectStatus,shakeStatus,callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        var effect = effectStatus.toString();
        var music = musicStatus.toString();
        var shake = shakeStatus.toString();//后端要string型
        // var playId = 19034660;
        var pString = "?playerId="+playId
                +"&musicStatus="+music
                +"&soundEffectStatus="+effect
                +"&shakeStatus="+shake;
        this.httpGet(url+'game/updatesetting'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //反馈接口
    getFanKuiStatus : function (coupleBackContent,callBack, uid, unionid) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 19034660;
        var pString = "?playerId="+playId
                +"&coupleBackContent="+coupleBackContent;
        this.httpGet(url+'game/feedbacksetting'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //商城 钻石买金豆
    getBuyBeanStatus : function (data) {
        var shopId = data.shopId;
        var propId = data.propId;
        var callBack = data.callBack;
        var openId = data.openId;
        var openKey = data.openKey;
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 45041089;
        var pString = "?playerId="+playId
                +"&id="+shopId
                +"&propId="+propId;
        if (openId && openKey) {
            pString = pString +"&openId="+openId;
            pString = pString +"&openKey="+openKey;
        }
        this.httpGet(url+'shop/general'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //玩法选择 进入游戏的接口
    getPlayTypeStatus : function (data) {
        var gameId = data.gameId;
        var gameType = data.gameType;//类型  推倒胡 郑州
        var gameLevel = data.gameLevel;//比赛场 好友场
        var fieldId = data.fieldId;//changci 初级中级高级
        var callBack = data.callBack;
        var uid = data.uid;
        var unionid = data.unionid;
        var quick = data.quick;
        var tipCallBack = data.tipCallBack;//金币不够充值
        var tipCallBack1 = data.tipCallBack1;//金币多了，自动跳转
        var supplyCallBack = data.supplyCallBack;//救济金



        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        util.log("clientVersion == "+config.version);
        //var playId = 19034660;
        if(fieldId){//匹配场
            var pString = "?playerId="+playId
            +"&gameId="+gameId
            +"&gameType="+gameType
            +"&gameLevel="+gameLevel
            +"&fieldId="+fieldId
            +"&quickStart="+quick
            // +"&clientVersion="+config.version
            ;
        }else{//好友场
            var pString = "?playerId="+playId
            +"&gameId="+gameId
            +"&gameType="+gameType
            +"&gameLevel="+gameLevel
            // +"&clientVersion="+config.version
            ;
        }
        
        url += 'playType/choose'+pString;
        util.log("url===="+url);
        this.httpGet(url,
            function (response) {
                var respJsonInfo = JSON.parse(response);
                if(respJsonInfo["code"] == "0"){
                    util.log("PlayType成功 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);
                    //
                    if (config.forceConnectSelectGameSvr == false) {
                        // gameData.serverUrl = "ws://" + msg.serverInfo.ip
                        //     + ":" + msg.serverInfo.port + "/mqtt";
                        gameData.serverUrl = msg.serverInfo.url;
                    }
                    // 建立网络连接
                    network.connect({
                        serverUrl : gameData.serverUrl,
                        openId : gameData.openid,
                        successCB : function () {
                            if (callBack) {
                                callBack(msg);
                            }
                        },
                    });
                }else if(respJsonInfo["code"] == "-26"){//金币不够需要买，要弹出充值
                    // util.log("PlayType失败 +=== "+ respJsonInfo['msg']);
                    util.log("getPlayTypeStatus ===  "+respJsonInfo["code"]);
                    if(tipCallBack){
                        tipCallBack();
                    }
                }else if(respJsonInfo["code"] == "-25"){//金币多了，不符合场次，自动跳转到快速开始
                    // util.log("PlayType失败 +=== "+ respJsonInfo['msg']);
                    util.log("getPlayTypeStatus ===  "+respJsonInfo["code"]);
                    if(tipCallBack1){
                        tipCallBack1();
                    }
                }else if(respJsonInfo["code"] == "-33"){//金币不够,弹救济金
                    util.log("领取救济金 提示 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);
                    // util.log("PlayType失败 +=== "+ respJsonInfo['msg']);
                    util.log("getPlayTypeStatus ===  "+respJsonInfo["code"]);
                    if(supplyCallBack){
                        supplyCallBack(msg);
                    }
                }else{
                    util.log("getPlayTypeStatus ===  "+respJsonInfo["code"]);
                    util.log("PlayType失败 +=== "+ respJsonInfo['msg']);
                }
            },
            function (statusText,responseText) {
            }
        );
    },
    // 领取救济金
    getsupplyState:function(callBack){
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        var pString = "?playerId="+playId;
        util.httpGet(url+'alms/get'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    getTaskStatus: function (callBack) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 102941;
        var pString = "?playerId="+playId;
        this.httpGet(url+'game/taskquest'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    getTaskRewardStatus: function (taskId,taskOnlyId,callBack) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        //var playId = 102941;
        //http://192.168.199.83:8080/script/game/taskawards?playerId=103372&taskOnlyId=cede054591064196a8570fcfce976a0e&taskId=3
        var pString = "?playerId="+playId +"&taskOnlyId="+taskOnlyId +"&taskId="+taskId;
        this.httpGet(url+'game/taskawards'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            }
        );
    },
    getPHBStatus: function (callBack) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 102941;
        var pString = "?playerId="+playId;
        this.httpGet(url+'player/top'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            },
            function (statusText,responseText) {
            }
        );
    },
    //查询分享
    getShareStatus: function (callBack) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 102941;
        var pString = "?playerId="+playId;
        this.httpGet(url+'daily/share'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            }
        );
    },
    //领取分享奖励
    getShareReward: function (callBack) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 102941;
        var pString = "?playerId="+playId;
        this.httpGet(url+'daily/share/get'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            }
        );
    },
    //新增每日分享记录
    getShareAdd: function (callBack) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        var pString = "?playerId="+playId;
        this.httpGet(url+'daily/share/add'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            }
        );
    },
    //获取加入房间的信息
    getJoinRoomInfoStatus: function (roomId,callBack) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 102941;
        var pString = "?playerId="+playId
                +"&roomId="+roomId;
        this.httpGet(url+'playType/choose/room'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            }
        );
    },
    //获取好友局战绩的信息
    getRecordStatus: function (callBack) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        // var playId = 108853;
        var pString = "?playerId="+playId;
        this.httpGet(url+'room/result'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            }
        );
    },
    //请求红点刷新（这个接口中添加了，当前是否在房间内的消息）
    getALLRedStatus: function (callBack) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        var pString = "?playerId="+playId;
        this.httpGet(url+'game/reddotview'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            }
        );
    },
    //玩家反馈
    getSubmitStatus: function (key1,key2,key3,key4,key5,level,mapId,callBack) {
        var url = gameData.hallSvrUrl + "/script/";
        var playId = gameData.uid;
        var pString = "?playerId="+playId
                +"&key1="+key1
                +"&key2="+key2
                +"&key3="+key3
                +"&key4="+key4
                +"&key5="+key5
                +"&gameId="+mapId
                +"&gameLevel="+level;
        this.httpGet(url+'player/feedback'+pString,
            function (response) {
                var respJson = JSON.parse(response);
                callBack(respJson);
            }
        );
    },
    refreshAllRedStatus: function (callBack) {
        this.getALLRedStatus(function (data) {
            if(data["code"] == 0){
                var msg =  JSON.parse(data["msg"]);
                gameData.isTipGrade = msg["bRankAward"] || 0;
                gameData.isTipTask = msg["taskStatus"] || 0;
                gameData.isTipMail_1 = msg["messageStatus"] || 0;
                gameData.isTipMail_2 = msg["messageAwardsStatus"] || 0;
                gameData.isTipShare = msg["shareStatus"] || 0;
                gameData.hallNode.emit('setPlayerInfo');
                if(msg["playerInRoomInfoModel"]){
                    gameData.playerIsInRoom = msg["playerInRoomInfoModel"];
                }else{
                    gameData.playerIsInRoom = false;
                }
                if(callBack){
                    callBack();
                }
            }else{
                util.log("getALLRedStatus ===  "+data["code"]);
            }
        });
    },
    //领取分享
    /*
        util.loadJsonFile("Matchlevel", function (data) {
            util.log("LoadingScene loadJsonFile");
            util.log( data );
        });

    */
    loadGameAnim : function (file,callback){
        cc.loader.loadRes(file, cc.AnimationClip, function (error, clips){
            if (!error) {
                callback(clips);
                // anim.getComponent(cc.Animation).addClip(clips);
                // anim.getComponent(cc.Animation).play("dasuo");
            }else{
                cc.log( 'loadGameAnim load['+ file +'], err['+err+']');
            }
        });
    },
    loadJsonFile : function (file, callback) {
        cc.loader.loadRes( file, function( err, res) {
            if (err) {
                cc.log( 'loadJsonFile load['+ file +'], err['+err+']');
            }
            else {
                callback(res);
            }
        });
    },
    loadPrefab:function(file, callback){
        let loadFunc = function () {
            file = "prefab/" + file;
            cc.loader.loadRes(file,function(err,perfab){
                if (err) {
                    cc.log( 'loadPrefab load['+ file +'], err['+err+']');
                }
                else {
                    util.hideWait();
                    callback(perfab);
                }
            });
        };
        // if (!gameData.blurLayer["loaded"] && gameData.blurLayer[file]) {
        //     // 没有加载过模糊背景 有模糊背景
        //     gameData.blurLayer["loaded"] = 1;
        if (!gameData.blurLayer[file]) {
            // 没有加载过模糊背景 有模糊背景
            gameData.blurLayer[file] = 1;
            util.showWait();
            cc.director.getScene().getChildByName("Canvas").runAction(
                cc.sequence(
                    cc.delayTime(0.1),
                    cc.callFunc(function () {
                        loadFunc();
                    })
                )
            );
        }
        else {
            loadFunc();
        }
    },
    loadGamePrefab : function (file, callback) {
        file = "prefab/game/" + file;
        cc.loader.loadRes(file,function(err,perfab){
            if (err) {
                cc.log( 'loadPrefab load['+ file +'], err['+err+']');
            }
            else {
                callback(perfab);
            }
        });
    },
    loagGamePDKPrefab : function (file, callback){
        file = "prefab/gamePDK/" + file;
        cc.loader.loadRes(file,function(err,perfab){
            if (err) {
                cc.log( 'loadPrefab load['+ file +'], err['+err+']');
            }
            else {
                callback(perfab);
            }
        });
    },

    loadSprite (file, node, callback) {
        var sprite = node.getComponent(cc.Sprite);
        cc.loader.loadRes(file, function(err, assets){
            if (err) {
                cc.log( 'loadSprite load['+ file +'], err['+err+']');
            }
            else {
                if (assets instanceof cc.Texture2D) {
                    sprite.spriteFrame = new cc.SpriteFrame(assets, cc.Rect(0, 0, assets.width, assets.height));
                }
                else if (assets instanceof cc.SpriteFrame) {
                    sprite.spriteFrame = assets;
                }
                if (callback) {
                    callback(node);
                }
            }
        })
    },
    //根据经验值读表获取经验值
    updataGrade : function (xpNum,callback) {
        var call = callback;
        var xp = xpNum;

        var doGetUg = function(data) {

            var gradeDuan = 1;
            var gradeXing = 1;
            var gradeName = data[0]['name'];
            for(var i = 0;i<data.length;i++){
                if(xp>=data[i]['limmitdown']){
                    gameData.gameGradeDuan = data[i]['duan'];
                    gameData.gameGradeXing = data[i]['star'];
                    gameData.gameGradeName = data[i]['name'];
                    gradeDuan = data[i]["duan"];
                    gradeXing = data[i]["star"];
                    gradeName = data[i]["name"];
                }else{
                    break;
                }
            }       
            if (call) {
                call(data,gradeDuan,gradeXing,gradeName);
            }
        };
        if (config.updataGradeData) {
            doGetUg(config.updataGradeData);
            return;
        }
        util.loadJsonFile("json/GameRank_Common", function (data) {
            
            config.updataGradeData = data;
            if (config.updataGradeData) {
                doGetUg(config.updataGradeData);
                //
            }
        });  
    },
    //根据等级获取当前等级经验最高值
    getLevelNum:function(level,call){
        var doGetUg = function(data) {
            
            var exp = data[parseInt(level)]["experience"];
            
            if (call) {
                call(exp);
            }
        };
        if (config.playerLevelData) {
            doGetUg(config.playerLevelData);
            return;
        }
        util.loadJsonFile("json/PlayerLevel_Common", function (data) {
            
            config.playerLevelData = data;
            if (config.playerLevelData) {
                doGetUg(config.playerLevelData);
                //
            }
        });  
    },
    //显示金豆和钻石 万 亿  不会出现负数
    showNum:function(number){
        var res = "";
        if(number<=0){
            res = 0;
        }else if(number<10000){
            res = number;
        }else if(number<100000000){
            res = Math.floor(number/10000) + "." + Math.floor(number%10000/1000) + "万";
        }else{
            res = Math.floor(number/100000000) + "." + Math.floor(number%100000000/10000000) + "亿";
        }
        return res;
    },
    // 
    showNum2:function(number){
        var res = "";
        if(number<10000){
            res = number;
        }else if(number<100000000){
            res = Math.floor(number/10000) + "." + Math.floor(number%10000/1000) + "万";
        }else{
            res = Math.floor(number/100000000) + "." + Math.floor(number%100000000/10000000) + "亿";
        }
        return res;
    },
    // 游戏中、小结算的豆子和分数 最多4个数加一个小数点加一个字   1.1万  12.1万 123.1万   1234万 1.1亿 12.1亿  123.1亿 1234.1亿（不可能有这么多所以没考虑）
    showNum3:function(number){
        var res = "";
        if(number<=0){
            res = 0;
        }else if(number<10000){//小于1万
            res = number;
        }else if(number<10000000){//小于一千万
            res = Math.floor(number/10000) + "." + Math.floor(number%10000/1000) + "万";
        }else if(number<100000000){//小于一亿
            res = Math.floor(number/10000) + "万";
        }else{
            res = Math.floor(number/100000000) + "." + Math.floor(number%100000000/10000000) + "亿";
        }
        return res;
    },
    //用于显示 经验 范围，千、万、亿
    showNumber:function(number){
      var res = "";
      if(number<1000){

        res = number ;

     }else if(number<10000){

        res = Math.floor(number/1000) ;
        if(number%1000 == 0)
            res += "千";
        else
            res += "." + Math.floor(number%1000/100) + "千";

     }else if(number<100000000){

        res = Math.floor(number/10000);
        if(number%10000 == 0)
            res += "万";
        else
            res +="." + Math.floor(number%10000/1000) + "万";
     }else{
        res = Math.floor(number/100000000)
        if(number%100000000 == 0)
            res += "亿";
        else
            res +="." + Math.floor(number%100000000/10000000) + "亿";
     }
       return res;
     },
        //时间转换（几小时，几分钟）
    getDateDiff : function(dateTimeStamp){
     var result ;
     var minute = 1000 * 60;
     var hour = minute * 60;
     var day = hour * 24;
     var halfamonth = day * 15;
     var month = day * 30;
     var now = new Date().getTime();
     var diffValue = now - dateTimeStamp;
     if(diffValue < 0) {
        return;
     }
     var monthC =diffValue/month;
     var weekC =diffValue/(7*day);
     var dayC =diffValue/day;
     var hourC =diffValue/hour;
     var minC =diffValue/minute;
     if(monthC>=1){
        result="" + parseInt(monthC) + "月前";
     }
     else if(weekC>=1){
        result="" + parseInt(weekC) + "周前";
     }
     else if(dayC>=1){
        result=""+ parseInt(dayC) +"天前";
     }
     else if(hourC>=1){
        result=""+ parseInt(hourC) +"小时前";
     }
     else if(minC>=1){
        result=""+ parseInt(minC) +"分钟前";
     }else
        result="刚刚";
     return result;
     },
    // tip (str, callback) {
    //     util.log("tip "+str);
    //     if (callback) {
    //         callback();
    //     }
    // },
    //第一个参数 提示框的父节点
    //第二个参数 提示类型 （1，是提示图片（带叉号按钮，不带下面三个按钮），2 是提示文字（不带叉号按钮，带下面的按钮）。。。  3, 提示自动消失（还没做））
    //第三个参数 提示文字文字的内容
    //第四个参数，左边按钮的回调方法
    //第五个参数，中间按钮的回调方法
    //第六个参数，右边按钮的回调方法
    //第七个参数，左边按钮是否显示
    //第八个参数，中间按钮是否显示
    //第九个参数，右边按钮是否显示
    //第n个参数 提示图片图片的路径（resource路径下）（还没用弄）
    //以后可以加按钮回调函数
    tip :function(data){
        var node = data.node;
        var type = data.type;
        var string = data.string;
        var leftCallback = data.leftCallback;
        var centerCallback = data.centerCallback;
        var rightCallback = data.rightCallback;
        var isShowLeftBtn = data.isShowLeftBtn;
        var isShowCenterBtn = data.isShowCenterBtn;
        var isShowRightBtn = data.isShowRightBtn;
        var multi = data.multi; // 重复提示
        // util.showWait();
        util.loadPrefab("tipLayer",function(data){
            // util.hideWait();
            if(!multi && util.isNodeExist(node,"tipLayer")){
                util.log("tipLayer已存在"+node.name);
                return;
            }
            var tipLayer = cc.instantiate(data);
            tipLayer.setName("tipLayer");
            node.addChild(tipLayer);
            tipLayer.getComponent("tipLayer").setTip(type,string,leftCallback,centerCallback,rightCallback,isShowLeftBtn,isShowCenterBtn,isShowRightBtn);
        });
    },
    tip2 : function (msgStr) {
        if (!cc.director || !cc.director.getScene()) {
            util.log(msgStr);
            return;
        }
        var canvas = cc.director.getScene().getChildByName("Canvas");
        if (!canvas) {
            util.log(msgStr);
            return;
        }

        util.tip({
            node : canvas,
            type : 2,
            string : msgStr,
            leftCallback : null,
            centerCallback : null,
            rightCallback : null,
            isShowLeftBtn : false,
            isShowCenterBtn : true,
            isShowRightBtn : false
        });
    },
    tip3 : function(node,msgStr){
        util.loadPrefab("tipStrip",function(data){
            var tipStrip = cc.instantiate(data);
            node.addChild(tipStrip);
            tipStrip.getComponent("tipStrip").setTip(msgStr);

        });
    },
    /*
        node : 提示框的父节点
        type : 类型（1是救济金；2是充值）
        string : 领取救济金的文字描述 
        level : 充值等级（初中高级场对应不同充值等级）
        num : 领取救济金的豆子数量
    */
    tip4 : function(data){//选择场次提示领取救济金和提示充值
        var node = data.node;
        var type = data.type;
        var string = data.string;
        var level = data.level;
        var num = data.num;
        var leftCallback = data.leftCallback;
        var centerCallback = data.centerCallback;
        var rightCallback = data.rightCallback;
        util.loadPrefab("supplyLayer",function(data){
            var supplyLayer = cc.instantiate(data);
            node.addChild(supplyLayer);
            supplyLayer.getComponent("supplyLayer").setTip(node,type,string,level,num,leftCallback,centerCallback,rightCallback);//跳转充值
            
        });
    },
    //时间参数转换成毫秒  oldtime：用的时间(道具使用时的时间) ，cdtime时间间隔（表里配的），endCallBack:结束回调，executeingCallBack未结束时回调
    createCountdownTime:function (oldtime,cdtime)
    {
        var that = this;
        var _cdtime = cdtime;
        var _oldtime = oldtime;
        if(!_cdtime){
         _cdtime = 120;
        }
        if(!_oldtime){
            return;
        }
        var jiangge_time = _cdtime * 1;
        var intervalTime = jiangge_time*1000;
        var endTime = _oldtime + intervalTime;
        var _nowtime = new Date().getTime();
        var subTime = endTime - _nowtime;
        var subTimeValue = subTime <= 0 ? 0 : subTime;
        util.log("time0000 ==== "+subTimeValue);
        var str_day = that.formatTimeDateStr(subTimeValue);
        return str_day;


        // var run_time = function () {

        //     var jiangge_time = _cdtime * 1;

        //     var intervalTime = jiangge_time * 1000;

        //     var endTime = _oldtime + intervalTime;

        //     var _nowtime = new Date().getTime();

        //     var subTime = endTime - _nowtime;

        //     var subTimeValue = subTime <= 0 ? 0 : subTime;


        //     var str_day = that.formatTimeDateStr(subTimeValue);
        //     // console.log("----str_day----",str_day);

        //     if (subTimeValue == 0) {
        //         //计时结束
        //         that.unschedule(run_time);
        //         // console.log("----计时结束----");
        //         if(endCallBack){
        //             endCallBack(str_day);
        //         }
        //     }else {
        //         if(executeingCallBack){
        //             executeingCallBack(str_day);
        //         }
        //     }


        // };
        // this.unschedule(run_time);
        // this.schedule(run_time, 1);

    },

    formatTimeDateStr:function (msec) {
        if (msec <= 0) {
            return "00:00:00";
        }
        var str_time;
        var day =0;
        var more_msec = 0;
        var day_param = 1000 * 60 * 60 * 24;//一天等于毫秒数
        var hour_param = 1000 * 60 * 60;//一小时等于毫秒数
        var minute_param = 1000 * 60;//一分钟等于毫秒数
        var sec_param = 1000 * 1;//一秒钟等于的毫秒数
        day = Math.floor(msec / day_param); //天数

        more_msec = msec % day_param; //
        var hh = Math.floor(more_msec / hour_param);            //小时

        more_msec = more_msec % hour_param;
        var mm = Math.floor(more_msec / minute_param);          //分

        more_msec = more_msec % minute_param;
        var sec = Math.floor(more_msec / sec_param);          //秒
        day= day<10 ? "0"+day: day;
        hh = hh < 10 ? "0"+hh : hh;
        mm = mm < 10 ? "0"+mm : mm;
        sec = sec < 10 ? "0"+sec : sec;
        if(day>0){
            str_time = day+"天 "+hh+":"+mm+":"+sec;
        }else if(day == 0){
            str_time = hh+":"+mm+":"+sec;
        }
        
        return str_time;

    },
    //serverToTime已用时间 cdTime 时间段（表里的）cdTime，endCallBack（结束回调），executeingCallBack（执行中回调）
    createShortTime:function(node,serverToTime,cdTime,endCallBack,executeingCallBack){

        var totalTime = cdTime;
        var serverToTime = serverToTime;
        var remainTime = totalTime*1 - serverToTime*1;//剩余s

        var hh =  Math.floor(remainTime/60/60);
        var min = Math.floor(remainTime/60 % 60);
        var sec = (remainTime-Math.floor(remainTime/60)*60);

        var ls =function() {

            if(sec == 0){
                min--;
                sec = 59;
            }
            if(min < 0 && hh > 0){
                hh--;
                min = 59;
            }
            sec--;
            //console.log("hour:"+hh+":"+min+":"+sec);
            var subTime = (hh < 10 ? "0"+hh:hh)+":"+(min< 10 ? "0"+min : min)+":"+(sec<10?"0"+sec:sec);

            if(parseInt(hh)==0&&parseInt(min)==0&&parseInt(sec)==0){

                if(endCallBack){
                    node.unschedule(ls);
                    endCallBack(subTime);
                }
            }else {
                if(executeingCallBack){
                    executeingCallBack(subTime);
                }

            }
        }
        node.schedule(ls, 1);
    },

    // 获取url图片
    loadUrlSprite(url, targetSprite, loadOK) {
        if (!url || url.length < 11) {
            return;
        }

        if (url.charAt(url.length - 2) === '/' &&
            url.charAt(url.length - 1) === '0')
            url = url.substr(0, url.length - 2) + '/132';

        var sprite = targetSprite.getComponent(cc.Sprite);

        util.log("sdk getPlayerHead url " + url);
        if (url && url != "defaultHead") {

            if (!url.startsWith("http")) {
                return;
            }

            cc.loader.load(url, function (err, texture) {
                if (err) {
                    util.log("sdk getPlayerHead err " + err);
                    return;
                }
                sprite.spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                // if (targetSprite.width !== 0 && targetSprite.height !== 0) {
                //     targetSprite.scaleX = targetSprite.width/texture.width;
                //     targetSprite.scaleY = targetSprite.height/texture.height;
                // }
                if(loadOK){
                    loadOK(targetSprite);
                }
            });
        }
        else {
            cc.loader.loadRes("defaultHead", function (err, texture) {
                if (err) {
                    util.log("sdk getPlayerHead err " + err);
                    return;
                }
                sprite.spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                // if (targetSprite.width !== 0 && targetSprite.height !== 0) {
                //     targetSprite.scaleX = targetSprite.width/texture.width;
                //     targetSprite.scaleY = targetSprite.height/texture.height;
                // }
                if(loadOK){
                    loadOK(targetSprite);
                }
            });
        }
    },

    // 预加载游戏界面，暂时不使用
    preloadGameScene (node) {
        return;
        node.stopAllActions();
        node.runAction(
            cc.sequence(
                cc.delayTime(10),
                cc.callFunc(function () {
                    cc.director.preloadScene("game", function () {
                        util.log("preloaded== game");
                    });
                })
            )
        );
    },
    // 进入游戏界面
    enterGameScene () {
        // 先暂停网络
        network.stop();

        util.showWait();

        // 移除监听
        network.removeListeners([3002, 2202, 3006]);

        util.log("游戏场景loadScene开始");

        cc.director.getScene().getChildByName("Canvas").runAction(
            cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(function () {
                    if(gameData.appId == config.MAJIANG_ID){
                        cc.director.loadScene("game");
                    }else if(gameData.appId == config.PUKE_ID){
                        cc.director.loadScene("game_pdk");
                    }
                })
            )
        );

        util.log("游戏场景loadScene结束");
    },

    addGameServerListener () {
        // 好友场
        network.addListener(3002, function (data, errorCode) {
            util.log("network 3002...............");
            if (errorCode) {
                var errorMsg = "3002 errorCode:" + errorCode;
                if (errorCode == -20) errorMsg = '房间号不存在, 请重新输入';
                if (errorCode == -30) errorMsg = '该房间已满4人, 无法加入';
                if (errorCode == -60) errorMsg = '该房间已开始, 无法加入';
                if (errorCode == -70) errorMsg = '您还不是该俱乐部成员，无法加入房间';
                if (errorCode == -40) errorMsg = '本房间为AA制房间，您的房卡不足，请购卡';
                if (errorCode == -2) errorMsg = decodeURIComponent(data['msg']);
                if (errorCode == -1){
                    errorMsg = "该房间已结束";
                    gameData.playerIsInRoom = false;
                };
                util.tip2(errorMsg);
                return;
            }
            gameData.appId = data.app_id;
            gameData.mapId = data.mapid;
            gameData.kindId = data.gameKind;
            gameData.roomId = data.room_id;
            gameData.all_rule["rule_youdabichu"] = data.qiangzhi;
            gameData.all_rule["rule_shouchuxuanze"] = data.firstchu;
            gameData.all_rule["rule_xiajuxianchu"] = data.nextfirstchu;
            gameData.rule_jushu = data.totalRound;
            
            

            gameData.createData = data;
            util.log("network 3002 -- util..............."+gameData.appId);
            util.enterGameScene();
        });
        // 匹配场
        network.addListener(2202, function (data, errorCode) {
            util.log("network 2202...............");
            if (errorCode) {
                var errorMsg = "2202 errorCode:" + errorCode;
                if (errorCode == -20) errorMsg = '房间号不存在, 请重新输入';
                if (errorCode == -30) errorMsg = '该房间已满4人, 无法加入';
                if (errorCode == -60) errorMsg = '该房间已开始, 无法加入';
                if (errorCode == -70) errorMsg = '您还不是该俱乐部成员，无法加入房间';
                if (errorCode == -40) errorMsg = '本房间为AA制房间，您的房卡不足，请购卡';
                if (errorCode == -2) errorMsg = decodeURIComponent(data['msg']);
                util.tip2(errorMsg);
                return;
            }
            gameData.appId = data.app_id;
            gameData.mapId = data.mapId;
            gameData.kindId = data.gameKind;
            gameData.roomId = data.room_id;
            gameData.mateLevel = data.piLevel;

            gameData.createData = data;
            gameData.all_rule["rule_youdabichu"] = data.qiangzhi;           
            gameData.all_rule["rule_shouchuxuanze"] = data.firstchu;
            gameData.all_rule["rule_xiajuxianchu"] = data.nextfirstchu;
            gameData.rule_jushu = data.totalRound;
            
            gameData.createData.players[0].score = gameData.createData.players[0].happybeans;
            util.log("network 2202 -- util..............."+gameData.appId);
            util.enterGameScene();
        });
        // 断线重连
        network.addListener(3006, function (data, errorCode) {
            gameData.appId = data.app_id;
            gameData.mapId = data.mapid;
            gameData.kindId = data.gameKind;
            gameData.mateLevel = data.gameLevel;
            gameData.roomId = data.room_id;
            gameData.all_rule["rule_youdabichu"] = data.qiangzhi;
            gameData.all_rule["rule_shouchuxuanze"] = data.firstchu;
            gameData.all_rule["rule_xiajuxianchu"] = data.nextfirstchu;
            gameData.rule_jushu = data.totalRound;
            

            gameData.reconnectData = data;

            util.enterGameScene();
        });
    },

    // 连接游戏服，actionId 1匹配2创建房间3加入房间
    connectGameServer (params) {
        util.log("connectGameServer");
        var serverUrl = params.serverUrl;
        var openId = params.openId;
        var actionId = params.actionId;
        if (!serverUrl || ! openId || !actionId) {
            util.log("连接游戏服失败，参数错误");
            return;
        }
        // 进入房间，直接根据分享链接进入，需要先获取玩家的uid
        var enterGame = function () {
            util.log("enterGame");
            // 添加监听
            util.addGameServerListener();
            if (actionId == 1) {
                // 匹配
                var uid = params.uid || "0";
                var mapId = params.mapId || config.HENAN_TUIDAOHU;
                var mateLevel = params.mateLevel;
                util.log("匹配 mapId="+mapId+" mateLevel="+mateLevel);
                network.send(2201, {
                    playerId: uid,
                    mapId: mapId,
                    piLevel: mateLevel,
                    restart : false,
                    roomId : 0
                });
            }
            else if (actionId == 2) {
                // 创建房间
                var mapId = params.mapId || config.HENAN_TUIDAOHU;
                var map = {
                    dahu : 0,
                    desp : "%E6%8E%A8%E5%80%92%E8%83%A1%2C4%E4%BA%BA%E7%8E%A9%2C4%E5%B1%80(%E6%88%BF%E5%8D%A1x3)%2C0%E5%BC%A0%2C%E5%B9%B3%E8%83%A1",
                    jushu : 4,
                    mapid : mapId,
                    sanrenwan : false,
                    smallGameType : 2002,
                    toDongBei : false,
                    zhaniao : 0,
                    jiapiao : true,
                };
                util.log("创建房间 mapId="+mapId);
                network.send(3001, {
                    room_id: 0,
                    app_id: 6,
                    options: map,
                    club_id: 0,
                });
            }
            else if (actionId == 3) {
                // 加入房间
                var roomId = params.roomId;
                util.log("加入房间 roomId="+roomId);
                network.send(3002, {
                    room_id: roomId
                });
            }
        }
        network.connect({
            serverUrl : serverUrl,
            openId : openId,
            successCB : function () {
                if (params.needUid) {
                    util.log("needUid");
                    // 先请求uid
                    network.addListener(2301, function (data, errorCode) {
                        util.log("2301-------------back");
                        gameData.uid = data.uid;
                        params.uid = data.uid;
                        enterGame();
                        network.removeListener(2301);
                    });
                    network.send(2301, {
                        openId : openId
                    });
                }
                else {
                    enterGame();
                }
            },
            failureCB : function () {
                util.tip2("游戏服务器连接失败");
            },
        });
    },

    // 等待
    showWait (delayTime) {
        let scene = cc.director.getScene();
        if (scene) {
            if (scene.getChildByName("WaitLayer")) {
                scene.getChildByName("WaitLayer").getComponent("WaitLayer").show(delayTime);
            }
            else {
                util.loadPrefab("WaitLayer", function (prefab) {
                    if (cc.director.getScene() === scene) {
                        if (scene.getChildByName("WaitLayer")) {
                            scene.getChildByName("WaitLayer").getComponent("WaitLayer").show(delayTime);
                        }
                        else {
                            let wait = cc.instantiate(prefab);
                            wait.name = "WaitLayer";
                            wait.x = scene.getChildByName("Canvas").width/2;
                            wait.y = scene.getChildByName("Canvas").height/2;
                            scene.addChild(wait, 100);
                            wait.getComponent("WaitLayer").show(delayTime);
                        }
                    }
                });
            }
        }
    },
    hideWait () {
        util.log("hunter---enter-hideWait---111");
        let scene = cc.director.getScene();
        util.log("hunter---enter-hideWait---scene = " + scene);
        util.log("hunter---enter-hideWait---222");
        if (scene) {
            util.log("hunter---enter-hideWait-scene存在---333");
            if (scene.getChildByName("WaitLayer")) {
                util.log("hunter---enter-hideWait-layer存在---444");
                scene.getChildByName("WaitLayer").getComponent("WaitLayer").hide();
            }
        }
        util.log("hunter---enter-hideWait---555");
    },
    isNodeExist(parent_node,node_name){//parent_node判断的节点父节点,该节点名字node_name
        if(parent_node.getChildByName(node_name)){
            return true;
        }else {
            return false;
        }
    },
    // 模糊背景，暂时不适用，不方便
    showBlur (node) {
        let scene = cc.director.getScene();
        if (scene) {
            let zorder = 1;
            if (node) {
                zorder = node.getLocalZOrder() - 1
                if (zorder <= 0) {
                    zorder = 1;
                }
            }

            let blur = scene.getChildByName("BlurLayer");
            if (blur) {
                blur.getComponent("BlurLayer").show();
                blur.removeFromParent();
                node.parent.addChild(blur, zorder);
                node.setLocalZOrder(zorder + 1);
            }
            else {
                util.loadPrefab("BlurLayer", function (prefab) {
                    if (cc.director.getScene() === scene) {
                        let blur = cc.instantiate(prefab);
                        blur.name = "BlurLayer";
                        blur.x = scene.getChildByName("Canvas").width/2 - 1536/2;
                        blur.y = scene.getChildByName("Canvas").height/2 - 750/2;
                        node.parent.addChild(blur, zorder);
                        node.setLocalZOrder(zorder + 1);
                        blur.getComponent("BlurLayer").show();
                    }
                });
            }
        }
    },
    hideBlur (node) {
        let scene = cc.director.getScene();
        if (scene) {
            let blur = node.parent.getChildByName("BlurLayer");
            if (blur) {
                blur.getComponent("BlurLayer").hide();
                blur.removeFromParent();
                scene.addChild(blur);
            }
        }
    },
});