var gameDataClass = require("gameData");
window.gameData = new gameDataClass();
window.gameData.init();

var utilClass = require("util");
window.util = new utilClass();

var configClass = require("config");
window.config = new configClass();

// var Raven = require("Raven")
// Raven.config('https://ecb47d6b9f8d45229c1b65edc49d1ded@sentry.io/1215355', {
//     release : config.version
// }).install();

var audioUtilsClass = require("audioUtils");
window.audioUtils = new audioUtilsClass();

// var networkClass = require("network.js");
// window.network = new networkClass();

if (config.platform === "debug") {
    var sdkClass = require("sdk_debug");
    window.sdk = new sdkClass();
    window.sdk.init();
}
else if (config.platform === "qqplay") {
    var sdkClass = require("sdk_qqplay");
    window.sdk = new sdkClass();
    window.sdk.init();
}
else if (config.platform === "wechat") {
    var sdkClass = require("sdk_wechat");
    window.sdk = new sdkClass();
    window.sdk.init();
}

require("network");


// var ShaderUtils = require("ShaderUtils");


/**
 * 作为入口scene，cocos creator必须它
 *
 * 正式版本，我们在这个入口scene什么也不显示
 * 直接自动跳转到
 * HallScene
 * 或者
 * GameScene
 *
 * */


cc.Class({
    extends: cc.Component,

    properties: {

        logScroll: {
            default: null,
            type: cc.Node,
        },
        logBtn: {
            default: null,
            type: cc.Button,
        },

        // logoNode: {
        //     default: null,
        //     type: cc.Node,
        // },

        progressBar : cc.Sprite,

        devNode: {
            default: null,
            type: cc.Node,
        },

        userLoginNode: {
            default: null,
            type: cc.Node,
        },

        bgMusic: {
            url: cc.AudioClip,
            default: null
        },
        loginActionBtn: {
            default: null,
            type: cc.Button
        },
        uidEditBox: {
            default: null,
            type: cc.EditBox
        },
        roomIdEditBox: {
            default: null,
            type: cc.EditBox
        },
        hallSvr1Toggle: {
            default: null,
            type: cc.Toggle
        },
        hallSvr2Toggle: {
            default: null,
            type: cc.Toggle
        },
        hallSvr3Toggle: {
            default: null,
            type: cc.Toggle
        },
        hallSvr4Toggle: {
            default: null,
            type: cc.Toggle
        },
        hallSvr5Toggle: {
            default: null,
            type: cc.Toggle
        },
        hallSvr6Toggle: {
            default: null,
            type: cc.Toggle
        },
        gameSvr1Toggle: {
            default: null,
            type: cc.Toggle
        },
        gameSvr2Toggle: {
            default: null,
            type: cc.Toggle
        },
        gameSvr3Toggle: {
            default: null,
            type: cc.Toggle
        },
        gameSvr4Toggle: {
            default: null,
            type: cc.Toggle
        },
        gameSvr5Toggle: {
            default: null,
            type: cc.Toggle
        },
        gameSvr6Toggle: {
            default: null,
            type: cc.Toggle
        },
        loginHallActionToggle: {
            default: null,
            type: cc.Toggle
        },
        goMatchingActionToggle: {
            default: null,
            type: cc.Toggle
        },
        createRoomActionToggle: {
            default: null,
            type: cc.Toggle
        },
        joinRoomActionToggle: {
            default: null,
            type: cc.Toggle
        },
        lowBeanTableToggle: {
            default: null,
            type: cc.Toggle
        },
        middleBeanTableToggle: {
            default: null,
            type: cc.Toggle
        },
        highBeanTableToggle: {
            default: null,
            type: cc.Toggle
        },
        //
        goToJoinRoomId: "",
        loginActionId:  0,              //LoginHall是必须的，1进入匹配，2CreateRoom，3JoinRoom
        gotoMatchingTableId:    1,      //1低级场，2中级场，3高级场
        selectLastDevHallIdx:   0,      //[0,4]
        selectLastDevGameIdx:   0,      //[0,4]
        //
        startTimestamp: 0,
        //

        
        bgAllNode:cc.Node,//背景节点，适配
    },

    //
    onOpenLogBtn () {
        this.logScroll.active = true;
    },

    uiLogAppendToTheScrollViewUI (lineLog) {
        //
        this.logScroll.getComponent("LogUtilScrollView").appendLogLine(lineLog);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        util.log("登陆场景onLoad");

        var width = this.node.getComponent("cc.Canvas").node.width;
        var height = this.node.getComponent("cc.Canvas").node.height;


        util.log("canvasWidth  ==  "+width);
        util.log("canvasHeight  ==  "+height);

        if(width/height> 2){
            this.bgAllNode.scaleX = 1.1;
        } 
        //this.startTimestamp = (new Date()).getTime();//milliseconds

        this.logScroll.active = false;
        //
        this.devNode.active = !!config.simulate_flag;
        //
        util.initGame();
        
        // 设置版本号
        this.node.getChildByName("versionLabel").getComponent(cc.Label).string = ""+config.version;
    },

    start () {
        util.log("登陆场景start");

        // for (let i = 1; i <= 18; i++) {
        //     let name = i > 9 ? ""+i : "0"+i;
        //     let node = cc.find("background/"+name, this.node);
        //     let sprite = node.getComponent(cc.Sprite);
        //     ShaderUtils.setShader(sprite, "GaussianBlur");
        // }
        
        util.log("LoadingScene login");


        this.initListener();

        // cc.director.preloadScene("hall", function () {
        //     util.log("loading -- Next scene preloaded");
        // });
        //
        if (!config.simulate_flag) {

            //auto select
            //TODO random select one Online Hall Server
            gameData.hallSvrUrl = config.hallSvrs[5];
            util.log("gameData.hallSvrUrl==="+gameData.hallSvrUrl);
            sdk.login(this);
        }


    },

    update: function (dt) {
        //
        //this.startTimestamp = this.startTimestamp + dt;//seconds
        //
        if (this.progressBar != null) {
            if (this.progressBar.node.width < 1205) {
                this.progressBar.node.width += 600 * dt;
            }
        }
    },

    onDestroy () {
        this.removeListeners();
    },

    initListener () {
        // 添加网络监听
        // 断线重连
        network.addListener(3006, function (data) {
            util.log("LoadingScene initListener 3006");

            // gameData.roomId = data['room_id'];
            // //gameData.mapId = data['map_id'];
            // gameData.mapId = data['mapid'];
            // gameData.appId = data['app_id']||APP_ID_HENAN;
            // gameData.playerNum = data['players'].length;
            // gameData.Fengquan = data['fengquan']||0;
            // gameData.lianzhuang = data['lianzhuang']||0;
            // gameData.isqiangzhi = data['qiangzhi'];
            // gameData.PDKsidaier = data['sidaier'];
            // var maLoadingLayer = new MaLoadingLayer(data);
            // that.addChild(maLoadingLayer);
        });
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
            
            gameData.all_rule["rule_shouchuxuanze"] = data.firstchu;
            gameData.all_rule["rule_youdabichu"] = data.qiangzhi;
            gameData.all_rule["rule_xiajuxianchu"] = data.nextfirstchu;
            gameData.rule_jushu = data.totalRound;
            gameData.createData = data;
            util.log("network 3002 -- loading..............."+gameData.appId);
            if(gameData.appId == config.MAJIANG_ID){
                cc.director.loadScene("game");
            }else if(gameData.appId == config.PUKE_ID){
                cc.director.loadScene("game_pdk");
            }
            
            
        });
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
            gameData.mapId = data.mapid;
            gameData.kindId = data.gameKind;
            gameData.roomId = data.room_id;
            gameData.mateLevel = data.piLevel;
            gameData.createData = data;
            
            gameData.all_rule["rule_youdabichu"] = data.qiangzhi;
            gameData.all_rule["rule_shouchuxuanze"] = data.firstchu;
            gameData.all_rule["rule_xiajuxianchu"] = data.nextfirstchu;
            gameData.rule_jushu = data.totalRound;
            
            gameData.createData.players[0].score = gameData.createData.players[0].happybeans;
            util.log("network 2202 -- loading..............."+gameData.appId);
            if(gameData.appId == config.MAJIANG_ID){
                cc.director.loadScene("game");
            }else if(gameData.appId == config.PUKE_ID){
                cc.director.loadScene("game_pdk");
            }
            // cc.director.loadScene("game");
            
        });

    },

    removeListeners () {
        network.removeListeners([2001, 3002, 3006, 2202]);
    },


    privateUnCheckAllHallSvrToggle:function () {
        for (var i = 0; i < 6; ++i) {
            this["hallSvr"+(i+1)+"Toggle"].isChecked = false;
        }
    },

    privateUnCheckAllGameSvrToggle:function () {
        for (var i = 0; i < 6; ++i) {
            this["gameSvr"+(i+1)+"Toggle"].isChecked = false;
        }
        //
        config.forceConnectSelectGameSvr = true;    //点击了Toggle//
        //
    },

    privateUnCheckAllActionToggle:function () {
        this.goMatchingActionToggle.isChecked = false;
        this.createRoomActionToggle.isChecked = false;
        this.joinRoomActionToggle.isChecked = false;
        this.goToJoinRoomId = "";
    },

    privateUnCheckAllTableToggle:function () {
        this.lowBeanTableToggle.isChecked = false;
        this.middleBeanTableToggle.isChecked = false;
        this.highBeanTableToggle.isChecked = false;
        //
        if (this.loginActionId > 1) {
            this.lowBeanTableToggle.interactable = false;
            this.middleBeanTableToggle.interactable = false;
            this.highBeanTableToggle.interactable = false;
        } else {
            this.lowBeanTableToggle.interactable = true;
            this.middleBeanTableToggle.interactable = true;
            this.highBeanTableToggle.interactable = true;
        }
    },

    privateSelectLastDevHallSvr:function () {
        if (this.hallSvr6Toggle.isChecked && this.gameSvr6Toggle.isChecked) {
            this["doToggleHallSvr" + (this.selectLastDevHallIdx + 1)]();
        }
    },

    privateSelectLastDevGameSvr:function () {
        if (this.hallSvr6Toggle.isChecked && this.gameSvr6Toggle.isChecked) {
            this["doToggleGameSvr" + (this.selectLastDevGameIdx + 1)]();
        }
    },

    //--begin zhengxin
    onBtnLoginAction:function() {
        // 只有可以选服才执行
        if (!gameData.hallSvrUrl) {
            util.warn("please select hall server!");
            return;
        }
        if (this.loginActionId == 3 && !this.goToJoinRoomId
            && this.goToJoinRoomId.length < 6) {
            util.warn("please enter roomid!");
            return;
        }
        //
        gameData.loginActionId = this.loginActionId;
        gameData.actionMatchingGameLvl = this.gotoMatchingTableId;
        gameData.actionRoomId = this.goToJoinRoomId;

        sdk.login(this);

    },


    onEditBoxUid:function(text) {

        var udid = "web_uid_" + text;

        gameData.openid = udid;
        gameData.nickname = text;
        gameData.headimgurl = "defaultHead";
        gameData.sex = 2;
        gameData.unionid = udid;

        config.platform = "debug";
    },

    onEditBoxRoomId:function(text) {

        this.goToJoinRoomId = text;
    },

    doToggleHallSvr1:function() {

        gameData.hallSvrUrl = config.hallSvrs[0];
        this.privateUnCheckAllHallSvrToggle();
        this.hallSvr1Toggle.isChecked = true;
        this.selectLastDevHallIdx = 0;
    },
    onToggleHallSvr1:function() {
        this.privateSelectLastDevGameSvr();

        this.doToggleHallSvr1();
    },

    doToggleHallSvr2:function() {

        gameData.hallSvrUrl = config.hallSvrs[1];
        this.privateUnCheckAllHallSvrToggle();
        this.hallSvr2Toggle.isChecked = true;
        this.selectLastDevHallIdx = 1;
    },
    onToggleHallSvr2:function() {
        this.privateSelectLastDevGameSvr();

        this.doToggleHallSvr2();
    },

    doToggleHallSvr3:function() {

        gameData.hallSvrUrl = config.hallSvrs[2];
        this.privateUnCheckAllHallSvrToggle();
        this.hallSvr3Toggle.isChecked = true;
        this.selectLastDevHallIdx = 2;
    },
    onToggleHallSvr3:function() {
        this.privateSelectLastDevGameSvr();

        this.doToggleHallSvr3();
    },

    doToggleHallSvr4:function() {

        gameData.hallSvrUrl = config.hallSvrs[3];
        this.privateUnCheckAllHallSvrToggle();
        this.hallSvr4Toggle.isChecked = true;
        this.selectLastDevHallIdx = 3;
    },
    onToggleHallSvr4:function() {
        this.privateSelectLastDevGameSvr();

        this.doToggleHallSvr4();
    },

    doToggleHallSvr5:function() {

        gameData.hallSvrUrl = config.hallSvrs[4];
        this.privateUnCheckAllHallSvrToggle();
        this.hallSvr5Toggle.isChecked = true;
        this.selectLastDevHallIdx = 4;
    },
    onToggleHallSvr5:function() {
        this.privateSelectLastDevGameSvr();

        this.doToggleHallSvr5();
    },

    /**
     * 外网HallSvr
     * */
    doToggleHallSvr6:function() {

        gameData.hallSvrUrl = config.hallSvrs[5];
        this.privateUnCheckAllHallSvrToggle();
        this.hallSvr6Toggle.isChecked = true;
    },
    onToggleHallSvr6:function() {

        this.doToggleHallSvr6();
        // this.doToggleGameSvr6();
    },

    doToggleGameSvr1:function() {

        gameData.serverUrl = config.gameSvrs[0];
        this.privateUnCheckAllGameSvrToggle();
        this.gameSvr1Toggle.isChecked = true;
        this.selectLastDevGameIdx = 0;
    },
    onToggleGameSvr1:function() {
        this.privateSelectLastDevHallSvr();

        this.doToggleGameSvr1();
    },

    doToggleGameSvr2:function() {

        gameData.serverUrl = config.gameSvrs[1];
        this.privateUnCheckAllGameSvrToggle();
        this.gameSvr2Toggle.isChecked = true;
        this.selectLastDevGameIdx = 1;
    },
    onToggleGameSvr2:function() {
        this.privateSelectLastDevHallSvr();

        this.doToggleGameSvr2();
    },

    doToggleGameSvr3:function() {

        gameData.serverUrl = config.gameSvrs[2];
        this.privateUnCheckAllGameSvrToggle();
        this.gameSvr3Toggle.isChecked = true;
        this.selectLastDevGameIdx = 2;
    },
    onToggleGameSvr3:function() {
        this.privateSelectLastDevHallSvr();

        this.doToggleGameSvr3();
    },

    doToggleGameSvr4:function() {

        gameData.serverUrl = config.gameSvrs[3];
        this.privateUnCheckAllGameSvrToggle();
        this.gameSvr4Toggle.isChecked = true;
        this.selectLastDevGameIdx = 3;
    },
    onToggleGameSvr4:function() {
        this.privateSelectLastDevHallSvr();

        this.doToggleGameSvr4();
    },

    doToggleGameSvr5:function() {

        gameData.serverUrl = config.gameSvrs[4];
        this.privateUnCheckAllGameSvrToggle();
        this.gameSvr5Toggle.isChecked = true;
        this.selectLastDevGameIdx = 4;
    },
    onToggleGameSvr5:function() {
        this.privateSelectLastDevHallSvr();

        this.doToggleGameSvr5();
    },

    /**
     * 外网GameSvr
     * */
    doToggleGameSvr6:function() {
        gameData.serverUrl = config.gameSvrs[5];
        this.privateUnCheckAllGameSvrToggle();
        this.gameSvr6Toggle.isChecked = true;
    },
    onToggleGameSvr6:function() {

        this.doToggleGameSvr6();
        // this.doToggleHallSvr6();
    },

    onToggleLoginHall:function() {

    },

    onToggleGoMatching:function() {

        this.loginActionId = 1;
        this.privateUnCheckAllActionToggle();
        this.goMatchingActionToggle.isChecked = true;
        //
        this.privateUnCheckAllTableToggle();
        if (this.gotoMatchingTableId == 2) {
            this.middleBeanTableToggle.isChecked = true;
        } else if (this.gotoMatchingTableId == 3) {
            this.highBeanTableToggle.isChecked = true;
        } else {
            this.lowBeanTableToggle.isChecked = true;
        }
    },

    onToggleCreateRoom:function() {

        this.loginActionId = 2;
        this.privateUnCheckAllActionToggle();
        this.createRoomActionToggle.isChecked = true;
        //
        this.privateUnCheckAllTableToggle();
    },

    onToggleJoinRoom:function() {

        this.loginActionId = 3;
        this.privateUnCheckAllActionToggle();
        this.joinRoomActionToggle.isChecked = true;
        //
        this.privateUnCheckAllTableToggle();
    },

    onToggleLowBeanTable:function() {

        this.gotoMatchingTableId = 1;
        this.privateUnCheckAllTableToggle();
        this.lowBeanTableToggle.isChecked = true;
    },

    onToggleMiddleBeanTable:function() {

        this.gotoMatchingTableId = 2;
        this.privateUnCheckAllTableToggle();
        this.middleBeanTableToggle.isChecked = true;
    },

    onToggleHighBeanTable:function() {

        this.gotoMatchingTableId = 3;
        this.privateUnCheckAllTableToggle();
        this.highBeanTableToggle.isChecked = true;
    },

    //--end

});
