// 游戏场景类

var GameConfig = require("GameConfig");
var GameTest = require("GameTest");

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

        // 是否是回放
        isReplay : null,

        isReconnect : null,

        //是否断开连接
        isDisconnect : false,

        //断线重连后是否在房间内
        isInRoom : true,//默认在房间里面，只有收到2302后才不再房间里面

        // 最大玩家数量
        // maxPlayerNum : null,
        // 当前玩家数量
        curPlayerNum : null,

        // 房主id
        ownerUid : null,
        // 房间号
        roomId : null,

        // 玩家对象数组，按显示下标访问
        players : [],
        // 当前玩家uid
        // curPlayerUid : null,
        // 玩家UID对应显示下标
        pos : null,
        // 轮盘数组，保存玩家对应的轮盘，按显示下标访问
        turns : [],
        // 初始化轮盘，保存东南西北的轮盘
        turnsInit : [],

        // 阻塞状态
        blockStatus : null,
        // 解除阻塞状态
        unblockStatus : null,
        // 阻塞数
        blockNumber : 0,
        // 阻塞消息
        blockData : [],
        // 阻塞列表
        blockList : null,
        // 非阻塞列表
        unblockList : null,

        // 玩法描述
        // desp : null,
        // 代开
        // isDaiKai : null,
        // 是否是俱乐部
        // isClubOwner : null,
        // 剩余牌
        // leftCard : null,
        // 吃碰杠胡听操作需要的牌
        opCardValue : null,

        // 不同玩法对象，游戏的mapid
        gameType : null,

        // 网络接口
        netlist : null,

        // 听牌数据
        tingData : null,

        // 中心位置
        centerX : null,
        centerY : null,

        // 记录当前玩家选择的操作
        curOp : null,

        // 开局动画是否播放过
        // startAnim : null,

        // 游戏状态
        gameStatus : -1,

        // 是否是解散房间，大结算显示使用
        dismissFlag : null,
        // 大结算数据
        endingData : null,

        // 时间偏差
        timeDiff : 0,

        // 是否显示正在匹配中
        matingFlag : null,


        // 牌预制资源
        card_1 : {default: null, type: cc.Prefab},
        card_2 : {default: null, type: cc.Prefab},
        card_3 : {default: null, type: cc.Prefab},
        card_4 : {default: null, type: cc.Prefab},
        card_5 : {default: null, type: cc.Prefab},
        card_6 : {default: null, type: cc.Prefab},
        card_7 : {default: null, type: cc.Prefab},
        card_8 : {default: null, type: cc.Prefab},
        card_9 : {default: null, type: cc.Prefab},
        card_10 : {default: null, type: cc.Prefab},
        card_11 : {default: null, type: cc.Prefab},
        card_12 : {default: null, type: cc.Prefab},
        card_13 : {default: null, type: cc.Prefab},
        card_14 : {default: null, type: cc.Prefab},
        card_15 : {default: null, type: cc.Prefab},
        card_16 : {default: null, type: cc.Prefab},
        card_17 : {default: null, type: cc.Prefab},
        card_18 : {default: null, type: cc.Prefab},

        // 事件节点
        event : {default: null, type: cc.Node},
        // 动作节点
        action : {default: null, type: cc.Node},

        // 记录当前音效值
        bgmVolume : 0,
        sfxVolume : 0,

        //适配
        bgAllNode:cc.Node,//背景节点，适配

        //游戏开始时的时间(分数上报时要用到)
        startTime : null,
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
        util.log("游戏场景onload");

        audioUtils.playGameBgm();

        this.logScroll.active = false;

        GameConfig.resizeCard(this.node.width);
    },

    start () {
        util.log("游戏场景start开始");

        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
           
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            
        }else if(gameData.canvasWidth/gameData.canvasHeight>2){
            this.bgAllNode.scale = 1.1;
        } 
        //适配刘海屏
        var isNotch = util.isNotchPhone(gameData.FrameWidth,gameData.FrameHeight);
        if(isNotch){
            var chatNode = cc.find("button/left/chat",this.node);
            var chatNodeX = chatNode.getPositionX();
            chatNode.setPositionX(chatNodeX + 35);
        }

        network.stop();
        this.blockStatus = false;
        this.unblockStatus = true;
        this.blockList = {};
        this.unblockList = {};

        // 设置中心
        var turn = cc.find("table/center/turn_bg", this.node);
        this.centerX = turn.x;
        this.centerY = turn.y;


        // 根据玩法设置不同函数实现，creator继承不好用，暂时使用此方法实现
        if (gameData.mapId) {
            if (gameData.mapId === config.HENAN_TUIDAOHU) {
                // 河南推倒胡
                var GameType = require("HeNanTuiDaoHu");
                this.gameType = new GameType();
                this.gameType.setGame(this);
            }
            else if (gameData.mapId === config.HENAN_ZHENGZHOU) {
                // 郑州麻将
                var GameType = require("ZhengZhouMaJiang");
                this.gameType = new GameType();
                this.gameType.setGame(this);
            }//信阳麻将没有特殊玩法
            else if (gameData.mapId === config.HENAN_NANYANG) {
                // 南阳麻将（第一版和郑州麻将一模一样，有一个下跑不一样） 下漂
                var GameType = require("NanYangMaJiang");
                this.gameType = new GameType();
                this.gameType.setGame(this);
            }
            else if (gameData.mapId === config.HENAN_ZHOUKOU) {
                // 周口和南阳一样
                var GameType = require("NanYangMaJiang");
                this.gameType = new GameType();
                this.gameType.setGame(this);
            }
            else if (gameData.mapId === config.HENAN_ZHUMADIAN) {
                // 驻马店和郑州一样
                var GameType = require("ZhengZhouMaJiang");
                this.gameType = new GameType();
                this.gameType.setGame(this);
            }
        }
        


        // 设置UI
        // this.setNet();
        // this.setTime();
        // this.setBattery();
        
        // 设置癞子牌属性
        cc.find("table/left/god_card_bg/card_s_f", this.node).getComponent("GameCard").setCardData({
            valueRes : 1,
            valueRotation : 0,
        }, {
            scaleX : 0.25,
            scaleY : 0.25,
        });

        // 创建玩家对象
        this.initPlayer();
        // 添加事件监听
        this.initEvent();
        // 绑定网络
        this.initNetwork();

        this.initGame();

        if (this.gameType && this.gameType.initType) {
            this.gameType.initType();
        }

        // 根据游戏类型设置显示
        if (gameData.kindId === config.KIND_MATE) {
            // 匹配
            util.loadSprite("game/type/"+gameData.mapId, cc.find("table/center/type", this.node));
            cc.find("table/center/room_id_text", this.node).active = false;
            cc.find("table/center/room_id_number", this.node).getComponent(cc.Label).string = "";
            this.setInviteBtn(false);
            this.gameStatus = GameConfig.STATUS_MATCHING;
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            // 好友
            util.loadSprite("game/type/"+gameData.mapId, cc.find("table/center/type", this.node));
            cc.find("table/center/room_id_text", this.node).active = true;
            cc.find("table/center/room_id_number", this.node).getComponent(cc.Label).string = ""+gameData.roomId;
            this.setInviteBtn(true);
            this.gameStatus = GameConfig.STATUS_WAITING;
        }

        // 设置断网回调
        let that = this;
        network.setOnDisconnectListener(function () {
            util.log("mjf--断网1");
            that.setDisconnect(true);
            that.isDisconnect = true;
            that.reconnect();
        });
        // 添加监听前台
        sdk.onEnterBackground["GameScene"] = {
            obj : this,
            handler : this.onEnterBackground,
        };
        // 添加监听后台
        sdk.onEnterForeground["GameScene"] = {
            obj : this,
            handler : this.onEnterForeground,
        };

        GameTest.call(this);

        if (gameData.reconnectData) {
            // 断线重连
            this.isReconnect = true;
            this.setReconnecting(true);
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function () {
                        this.setReconnecting(false);
                        this.onNetPlayerReconnect(gameData.reconnectData);
                        gameData.reconnectData = null;
                        network.start();
                    }, this)
                )
            );
        }
        else {
            // 玩家自己进入房间
            this.isReconnect = false;
            this.setReconnecting(false);
            this.onNetPlayerEnter(gameData.createData);
            gameData.createData = null;
            network.start();
        }
        

        util.log("游戏场景start结束");
    },

    // // 设置网络显示
    // setNet () {},
    // // 设置时间显示
    // setTime () {},
    // // 设置电量
    // setBattery () {},

    // 初始化玩家
    initPlayer () {
        // 初始化玩家
        this.players[0] = cc.find("player/center/me", this.node).getComponent("GamePlayer");
        this.players[0].initPlayer(0, this);

        this.players[1] = cc.find("player/right/player", this.node).getComponent("GamePlayer");
        this.players[1].initPlayer(1, this);

        this.players[2] = cc.find("player/center/player", this.node).getComponent("GamePlayer");
        this.players[2].initPlayer(2, this);

        this.players[3] = cc.find("player/left/player", this.node).getComponent("GamePlayer");
        this.players[3].initPlayer(3, this);

        // 初始化轮盘
        this.turnsInit[0] = cc.find("table/center/turn_bg/turn_east", this.node);
        this.turnsInit[1] = cc.find("table/center/turn_bg/turn_south", this.node);
        this.turnsInit[2] = cc.find("table/center/turn_bg/turn_west", this.node);
        this.turnsInit[3] = cc.find("table/center/turn_bg/turn_north", this.node);
    },

    // 添加事件监听，creator的事件系统真的不好用，跟以前相比，开倒车
    initEvent () {
        // 游戏开始动画
        this.event.on("actGameStart", this.actStartAnim, this);
        // 开局动画播放完毕，玩家头像移动
        this.event.on("actStartAnimOver", this.actPlayerMove, this);
        // 玩家头像移动完毕，显示玩家牌垛
        this.event.on("actPlayerMoveOver", this.actPlayerLeftCard, this);
        // 显示玩家手牌完毕，开始掷骰子
        this.event.on("actPlayerLeftCardOver", this.actDice, this);
        // 骰子结束，定庄
        this.event.on("actDiceOver", this.actZhuang, this);
        // 定庄完毕，显示玩家手牌
        this.event.on("actZhuangOver", this.actPlayerHandCard, this);
        // 玩家手牌显示完毕，继续游戏，摸牌，显示吃碰杠提示
        this.event.on("actPlayerHandCardOver", this.actGameGoing, this);

        // 添加刷新玩家财富的事件监听
        this.event.on("refreshPlayerMoney", this.refreshPlayerMoney, this);

        if (this.gameType && this.gameType.addEvent) {
            this.gameType.addEvent();
        }
    },

    // 添加网络监听
    initNetwork () {
        this.netlist = [
            {protocal : 2101, handler : this.onNetPlayerSameIp},            // 相同ip提示
            {protocal : 2202, handler : this.onNetPlayerMating},            // 匹配
            {protocal : 2205, handler : this.onNetPlayerGoOn},              // 继续下一局
            {protocal : 2302, handler : this.onNetPlayerOffLineReconnect},  // 玩家断线重连（不在房间内）
            {protocal : 3002, handler : this.onNetPlayerEnter},             // 加入房间消息
            {protocal : 3003, handler : this.onNetPlayerExit},              // 离开房间消息
            {protocal : 3004, handler : this.onNetPlayerReady},             // 玩家准备消息
            {protocal : 3006, handler : this.onNetPlayerReconnect},         // 玩家断线重连（在房间内）
            {protocal : 3008, handler : this.onNetPlayerChat},              // 聊天
            {protocal : 3009, handler : this.onNetPlayerDismiss},           // 解散房间
            {protocal : 3013, handler : this.onNetPlayerMoney},             // 同步玩家财富
            {protocal : 3200, handler : this.onNetPlayerNotice},            // 提示
            {protocal : 3201, handler : this.onNetPlayerBackNotice},        // 强制返回提示
            {protocal : 4020, handler : this.onNetPlayerOffLine},           // 断线
            {protocal : 5002, handler : this.onNetPlayerAuto},              // 托管

            {protocal : 4000, handler : this.onNetGameTurn},                // 轮流，不需要摸牌需要出牌时，例如碰完出牌
            {protocal : 4001, handler : this.onNetGameExtraCard},           // 摸牌，摸完牌，自动轮到出牌
            {protocal : 4002, handler : this.onNetGameOutCard},             // 出牌
            {protocal : 4003, handler : this.onNetGameOpResult},            // 吃碰杠胡结果
            {protocal : 4004, handler : this.onNetGameOpTip},               // 吃碰杠胡提示
            {protocal : 4062, handler : this.onNetGameTingTip},             // 听牌提示
            {protocal : 4200, handler : this.onNetGameStart},               // 初始发牌

            {protocal : 4008, handler : this.onNetGameResult},              // 小结算
            {protocal : 4009, handler : this.onNetGameEnding},              // 总结算

            {protocal : 5003, handler : this.onNetGameGangScore},           // 杠分现结
        ];

        this.unblockList[2101] = true;
        this.unblockList[3008] = true;
        this.unblockList[3009] = true;
        this.unblockList[3013] = true;
        this.unblockList[3200] = true;
        this.unblockList[3201] = true;
        this.unblockList[4020] = true;
        this.unblockList[5002] = true;
        this.unblockList[4008] = true;
        this.unblockList[4009] = true;
        this.unblockList[5003] = true;

        var that = this;
        for (let i = 0; i < this.netlist.length; i++) {
            let protocal = this.netlist[i].protocal;
            let handler = this.netlist[i].handler;
            network.addListener(protocal, function (data) {
                // 计算时间偏差
                if (data.ts) {
                    let curTime = (new Date()).getTime();
                    this.timeDiff = curTime - data.ts;
                    util.log("----时间差=" + (this.timeDiff/1000) + "秒");
                }
                if (that.blockStatus) {
                    // 动作阻塞
                    if (!that.unblockList[protocal]) {
                        // 不在非阻塞列表中
                        util.log("----阻塞状态 阻塞消息 protocal="+protocal);
                        that.blockData.push({
                            protocal : protocal,
                            handler : handler,
                            data : data,
                        });
                    }
                    else {
                        util.log("----阻塞状态 非阻塞消息 protocal="+protocal+" data="+JSON.stringify(data));
                        handler.call(that, data);
                    }
                }
                else {
                    util.log("----非阻塞状态 处理消息 protocal="+protocal+" data="+JSON.stringify(data));
                    handler.call(that, data);
                }
            });
        }

        if (this.gameType && this.gameType.addNetwork) {
            this.gameType.addNetwork();
        }
    },
    initNetwork1 () {
        // 听牌亮牌
        network.addListener(4005, function (data) {

        });
        
        // 漏胡提示
        network.addListener(4010, function (data) {
            var msg = data.msg;
        });
        // 抓鸟
        network.addListener(4012, function (data) {

        });
        // 听牌
        network.addListener(4013, function (data) {

        });
        // 听牌
        network.addListener(4014, function (data) {

        });
        // 听牌
        network.addListener(4015, function (data) {
            
        });
        // 玩家状态改变
        network.addListener(4020, function (data) {

        });
    },

    // 每局开始前初始化
    initGame () {
        // 清理所有动作
        this.initAction();
        // 清理听牌数据
        this.tingData = null;
        // 设置骰子
        cc.find("table/center/turn_bg/dice", this.node).active = false;
        // 清空计时器
        this.setTimer();
        // 设置操作
        this.setOp();
        this.setOpMultiPop();
        // 设置听牌提示按钮
        this.setTingBtn();
        this.setTingPop();
        // 剩余牌
        this.setLeftCard();
        // 玩家
        if (gameData.kindId === config.KIND_MATE) {
            // 匹配刷新玩家
            // for (var i = 1; i < GameConfig.PLAYER_MAX; i++) {
            //     this.players[i].setPlayerData();
            // }
            for (var i = 0; i < GameConfig.PLAYER_MAX; i++) {
                this.players[i].initGame();
            }
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            // 好友不刷新玩家
            for (var i = 0; i < GameConfig.PLAYER_MAX; i++) {
                this.players[i].initGame();
            }
        }
        // 结算界面
        this.setMateResultPop();
        this.setFriendResultPop();
        // 相同ip提示
        this.setSameIpPop();
        // 托管
        this.setAutoPop();
        // 出牌提示
        cc.find("action/center/out_tip", this.node).active = false;
        // 下一局
        cc.find("button/center/next", this.node).active = false;


        // 特殊玩法初始化
        if (this.gameType && this.gameType.initGame) {
            this.gameType.initGame();
        }
    },

    // 设置计时器，需要时间戳校正
    setTimer (time, ts) {
        if (ts) {
            let curTime = (new Date()).getTime();
            time = Math.floor((ts - curTime + (this.timeDiff || 0))/1000) + time;
            time = time >= 0 ? time : 0;
        }
        var timer = cc.find("table/center/turn_bg/timer", this.node).getComponent(cc.Label);
        timer.unscheduleAllCallbacks();
        if (time) {
            timer.string = time;
            let that = this;
            timer.schedule(function () {
                if (that.players[0].current && time === 1 || time === 2 || time === 3) {
                    audioUtils.playSFX("resources/sound/game/effect/alarm.mp3");
                }
                this.string = --time;
            }, 1, time-1);
        }
        else {
            timer.string = "";
        }
    },
    // 显示可执行的操作
    setOp (opData) {
        // 计算可执行操作数量
        var count = 0;
        var opBg = cc.find("button/right/op_bg", this.node);
        if (opData) {
            for (var i = 0; i < opData.length; i++)
            {
                if (opData[i]) {
                    count++;
                }
            }
        }
        if (count !== 0) {
            
            var handBg = opBg.getChildByName("hand_bg");
            handBg.width = count*153 + 133 + 200;
            // 操作
            for (var i = 0; i < GameConfig.OP_SP_NUMBER; i++)
            {
                var opSp = handBg.getChildByName("op_" + i);
                if (opData[i]) {
                    opSp.x = - 185 - 153*count;
                    count--;
                    opSp.active = true;
                    opSp.getChildByName("halo").getComponent(cc.Animation).play("halo");
                }
                else {
                    opSp.active = false;
                    opSp.getChildByName("halo").getComponent(cc.Animation).stop("halo");
                }
            }
            // 过
            {
                var opSp = handBg.getChildByName("op_pass");
                opSp.x = -220;
                opSp.active = true;
            }

            opBg.active = true;
        }
        else {
            opBg.active = false;
        }
    },
    // 设置剩余牌数
    setLeftCard (number) {
        var leftCardBg = cc.find("table/left/left_card_bg", this.node);
        var leftCard = leftCardBg.getChildByName("card_left").getComponent(cc.Label);
        if (number || number === 0) {
            leftCard.string = number + "张";
            leftCardBg.active = true;
        }
        else {
            leftCard.string = "";
            leftCardBg.active = false;
        }
    },
    // 设置流水按钮
    setRecordBtn (number) {
        if (gameData.kindId === config.KIND_MATE) {
            // 匹配不显示
            cc.find("button/right/record", this.node).active = false;
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            // 好友显示
            cc.find("button/right/record/number", this.node).getComponent(cc.Label).string = "" + ( number + 1 );
            cc.find("button/right/record", this.node).active = true;
        }
    },
    // 设置邀请按钮
    setInviteBtn (flag) {
        cc.find("button/center/invite", this.node).active = !!flag;
    },
    // 设置退出按钮
    setBackBtn (flag) {
        cc.find("button/left/back", this.node).active = !!flag;
    },


    onDestroy () {
        // 断线重连
        sdk.onEnterBackground["GameScene"] = null;
        sdk.onEnterForeground["GameScene"] = null;
        this.removeListeners();
        this.removeEvent();
        for (var i = 0; i < GameConfig.OP_SP_NUMBER; i++) {
            let node = cc.find("button/right/op_bg/hand_bg/op_"+i+"/halo", this.node);
            if (node && node.getComponent(cc.Animation)) {
                node.getComponent(cc.Animation).stop("halo");
            }
        }
        network.disconnect();
    },

    // 移除事件监听
    removeEvent () {
        // 游戏开始动画
        this.event.off("actGameStart", this.actStartAnim, this);
        // 开局动画播放完毕，玩家头像移动
        this.event.off("actStartAnimOver", this.actPlayerMove, this);
        // 玩家头像移动完毕，显示玩家牌垛
        this.event.off("actPlayerMoveOver", this.actPlayerLeftCard, this);
        // 显示玩家手牌完毕，开始掷骰子
        this.event.off("actPlayerLeftCardOver", this.actDice, this);
        // 骰子结束，定庄
        this.event.off("actDiceOver", this.actZhuang, this);
        // 定庄完毕，显示玩家手牌
        this.event.off("actZhuangOver", this.actPlayerHandCard, this);
        // 玩家手牌显示完毕，继续游戏，摸牌，显示吃碰杠提示
        this.event.off("actPlayerHandCardOver", this.actGameGoing, this);

        // 刷新玩家财富的事件监听
        this.event.off("refreshPlayerMoney", this.refreshPlayerMoney, this);


        for (let i = 0; i < GameConfig.PLAYER_MAX; i++) {
            this.players[i].removeEvent();
        }

        if (this.gameType && this.gameType.removeEvent) {
            this.gameType.removeEvent();
        }
    },

    removeListeners () {
        for (let i = 0; i < this.netlist.length; i++) {
            network.removeListeners(this.netlist[i].protocal);
        }
        // network.removeListeners([2101, 3002, 3003, 3004, 3008, 3009, 3013, 4000, 4001, 4002, 4003, 4004, 4005, 4200, 4062, 5001, 4008, 4009, 4010, 4012, 4013, 4014, 4015, 4020, 4083]);
        if (this.gameType && this.gameType.removeListeners) {
            this.gameType.removeListeners();
        }
    },


    // 功能函数
    // 轮到uid玩家
    takeTurn (uid) {
        // 转盘
        for (var i = 0; i < GameConfig.PLAYER_MAX; i++) {
            this.turnsInit[i].active = false;
            this.players[i].current = false;
            this.players[i].setTingArrow();
        }
        if (uid) {
            var index = this.pos[uid];
            var turn = this.turns[index];
            var player = this.players[index];
            if (turn && player) {
                turn.active = true;
                player.current = true;
                turn.stopAllActions();
                turn.runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.fadeTo(1, 50),
                            cc.fadeTo(1, config.maxOpacity)
                        )
                    )
                );
                // 听牌提示
                if (index === 0) {
                    // 设置听牌按钮显示
                    this.setTingBtn(false);
                    player.setTingArrow(this.tingData);
                }
                else {
                    this.setTingBtn(true);
                }
            }
        }
    },
    // 设置turn方向
    setTurn (offset, maxPlayer) {
        // 设置东南西北
        var turns = [];
        for (var i = 0; i < 4; i++) {
            var index = (i - offset + maxPlayer) % maxPlayer;
            turns[index] = this.turnsInit[i];
        }
        this.turns = turns;
        cc.find("table/center/turn_bg", this.node).rotation = 90*(offset + 3);
        cc.find("table/center/turn_bg/timer", this.node).rotation = -90*(offset + 3);
        cc.find("table/center/turn_bg/dice", this.node).rotation = -90*(offset + 3);
    },
    // 设置听牌弹窗，出value牌后胡牌
    setTingPop (value, swallow) {
        let flag = false;
        if (value && this.tingData && this.tingData[""+value] && this.tingData[""+value].length) {
            flag = true;
        }

        if (flag) {
            if (!this.TingPop) {
                let that = this;
                util.loadGamePrefab("TingPop", function (perfab) {
                    if (!that.TingPop) {
                        let tingPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(tingPop, GameConfig.POP_ZORDER["TingPop"]);
                        that.TingPop = tingPop.getComponent("TingPop");
                        that.TingPop.setGame(that);
                        that.TingPop.refresh(that.tingData[""+value], swallow);
                    }
                    else {
                        that.TingPop.refresh(that.tingData[""+value], swallow);
                    }
                });
            }
            else {
                this.TingPop.refresh(this.tingData[""+value], swallow);
            }
        }
        else {
            if (this.TingPop) {
                this.TingPop.hide();
            }
        }
    },
    // 设置听牌按钮显示
    setTingBtn (flag) {
        if (flag && this.tingData && Object.keys(this.tingData).length === 1) {
            // 检查是否有听牌数据，只有能听牌才显示听牌按钮
            cc.find("button/right/ting", this.node).active = true;
        }
        else {
            cc.find("button/right/ting", this.node).active = false;
        }
    },
    // 设置操作选择弹窗
    setOpMultiPop (op, data) {
        let flag = false;
        if (op && data) {
            flag = true;
        }

        if (flag) {
            if (!this.OpMultiPop) {
                let that = this;
                util.loadGamePrefab("OpMultiPop", function (perfab) {
                    if (!that.OpMultiPop) {
                        let opMultiPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(opMultiPop, GameConfig.POP_ZORDER["OpMultiPop"]);
                        that.OpMultiPop = opMultiPop.getComponent("OpMultiPop");
                        that.OpMultiPop.setGame(that);
                        that.OpMultiPop.refresh(op, data);
                    }
                    else {
                        that.OpMultiPop.refresh(op, data);
                    }
                });
            }
            else {
                this.OpMultiPop.refresh(op, data);
            }
        }
        else {
            if (this.OpMultiPop) {
                this.OpMultiPop.hide();
            }
        }
    },
    // 根据op获取下标
    getOpIndex (op) {
        let index = {};
        index[GameConfig.OP_CHI] = 0;
        index[GameConfig.OP_PENG] = 1;
        index[GameConfig.OP_GANG] = 2;
        index[GameConfig.OP_HU] = 3;
        index[GameConfig.OP_TING] = 4;
        return index[op];
    },
    // 设置匹配场结算弹窗
    setMateResultPop (data) {
        if (data) {
            if (!this.MateResultPop) {
                let that = this;
                util.loadGamePrefab("MateResultPop", function (perfab) {
                    if (!that.MateResultPop) {
                        let mateResultPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(mateResultPop, GameConfig.POP_ZORDER["MateResultPop"]);
                        that.MateResultPop = mateResultPop.getComponent("MateResultPop");
                        that.MateResultPop.setGame(that);
                        that.MateResultPop.refresh(data);
                        sdk.uploadPlayerScore(that.startTime, gameData.gameBean);
                    }
                    else {
                        that.MateResultPop.refresh(data);
                    }
                });
            }
            else {
                this.MateResultPop.refresh(data);
            }
        }
        else {
            if (this.MateResultPop) {
                this.MateResultPop.hide();
            }
        }
    },
    // 设置好友场结算弹窗
    setFriendResultPop (data) {
        if (data) {
            if (!this.FriendResultPop) {
                let that = this;
                util.loadGamePrefab("FriendResultPop", function (perfab) {
                    if (!that.FriendResultPop) {
                        let friendResultPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(friendResultPop, GameConfig.POP_ZORDER["FriendResultPop"]);
                        that.FriendResultPop = friendResultPop.getComponent("FriendResultPop");
                        that.FriendResultPop.setGame(that);
                        that.FriendResultPop.refresh(data);
                    }
                    else {
                        that.FriendResultPop.refresh(data);
                    }
                });
            }
            else {
                this.FriendResultPop.refresh(data);
            }
        }
        else {
            if (this.FriendResultPop) {
                this.FriendResultPop.hide();
            }
        }
    },
    // 设置好友场大结算
    setFriendEndingPop () {
        if (this.endingData) {
            if (!this.FriendEndingPop) {
                let that = this;
                util.loadGamePrefab("FriendEndingPop", function (perfab) {
                    if (!that.FriendEndingPop) {
                        let friendEndingPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(friendEndingPop, GameConfig.POP_ZORDER["FriendEndingPop"]);
                        that.FriendEndingPop = friendEndingPop.getComponent("FriendEndingPop");
                        that.FriendEndingPop.setGame(that);
                        that.FriendEndingPop.refresh(that.endingData);
                        that.endingData = null;
                    }
                    else {
                        that.FriendEndingPop.refresh(that.endingData);
                        that.endingData = null;
                    }
                });
            }
            else {
                this.FriendEndingPop.refresh(this.endingData, this);
                this.endingData = null;
            }
        }
    },
    // 设置防作弊提示弹窗
    setSameIpPop (data) {
        if (data) {
            if (!this.SameIpPop) {
                let that = this;
                util.loadGamePrefab("SameIpPop", function (perfab) {
                    if (!that.SameIpPop) {
                        let sameIpPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(sameIpPop, GameConfig.POP_ZORDER["SameIpPop"]);
                        that.SameIpPop = sameIpPop.getComponent("SameIpPop");
                        that.SameIpPop.refresh(data);
                    }
                    else {
                        that.SameIpPop.refresh(data);
                    }
                });
            }
            else {
                this.SameIpPop.refresh(data);
            }
        }
        else {
            if (this.SameIpPop) {
                this.SameIpPop.hide();
            }
        }
    },
    // 设置好友退出弹窗
    setFriendExitPop (flag) {
        if (flag) {
            if (!this.FriendExitPop) {
                let that = this;
                util.loadGamePrefab("FriendExitPop", function (perfab) {
                    if (!that.FriendExitPop) {
                        let friendExitPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(friendExitPop, GameConfig.POP_ZORDER["FriendExitPop"]);
                        that.FriendExitPop = friendExitPop.getComponent("FriendExitPop");
                        that.FriendExitPop.setGame(that);
                        that.FriendExitPop.show();
                    }
                    else {
                        that.FriendExitPop.show();
                    }
                });
            }
            else {
                this.FriendExitPop.show();
            }
        }
        else {
            if (this.FriendExitPop) {
                this.FriendExitPop.hide();
            }
        }
    },
    // 设置好友解散弹窗
    setFriendDismissPop (data) {
        if (data) {
            if (!this.FriendDismissPop) {
                let that = this;
                util.loadGamePrefab("FriendDismissPop", function (perfab) {
                    if (!that.FriendDismissPop) {
                        let friendDismissPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(friendDismissPop, GameConfig.POP_ZORDER["FriendDismissPop"]);
                        that.FriendDismissPop = friendDismissPop.getComponent("FriendDismissPop");
                        that.FriendDismissPop.setGame(that);
                        that.FriendDismissPop.refresh(data, that.pos);
                    }
                    else {
                        that.FriendDismissPop.refresh(data, that.pos);
                    }
                });
            }
            else {
                this.FriendDismissPop.refresh(data, this.pos);
            }
        }
        else {
            if (this.FriendDismissPop) {
                this.FriendDismissPop.hide();
            }
        }
    },
    // 设置匹配退出弹窗
    setMateExitPop (flag) {
        if (flag) {
            if (!this.MateExitPop) {
                let that = this;
                util.loadGamePrefab("MateExitPop", function (perfab) {
                    if (!that.MateExitPop) {
                        let mateExitPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(mateExitPop, GameConfig.POP_ZORDER["MateExitPop"]);
                        that.MateExitPop = mateExitPop.getComponent("MateExitPop");
                        that.MateExitPop.setGame(that);
                        that.MateExitPop.show();
                    }
                    else {
                        that.MateExitPop.show();
                    }
                });
            }
            else {
                this.MateExitPop.show();
            }
        }
        else {
            if (this.MateExitPop) {
                this.MateExitPop.hide();
            }
        }
    },
    // 设置自己的托管弹窗
    setAutoPop (flag) {
        if (flag) {
            if (!this.AutoPop) {
                let that = this;
                util.loadGamePrefab("AutoPop", function (perfab) {
                    if (!that.AutoPop) {
                        let autoPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(autoPop, GameConfig.POP_ZORDER["AutoPop"]);
                        that.AutoPop = autoPop.getComponent("AutoPop");
                        that.AutoPop.setGame(that);
                        that.AutoPop.show();
                    }
                    else {
                        that.AutoPop.show();
                    }
                });
            }
            else {
                this.AutoPop.show();
            }
        }
        else {
            if (this.AutoPop) {
                this.AutoPop.hide();
            }
        }
    },
    // 设置杠分现结
    setGangScore (data) {
        if (!data) {
            return;
        }

        for (let uid in data) {
            let score = data[uid];
            let player = this.players[this.pos[uid]];
            if (player) {
                player.setGangScore(score);
            }
        }
    },
    // 设置匹配中
    setMateWaiting (flag) {
        let mating = cc.find("action/center/mating", this.node);
        if (flag) {
            if (this.matingFlag) {
                return;
            }
            if (!mating.getComponent(cc.Sprite).spriteFrame) {
                util.loadSprite("game/mating", mating);
            }
            // 显示正在匹配中
            this.matingFlag = true;
            let time = 20;
            var timer = cc.find("time", mating).getComponent(cc.Label);
            timer.unscheduleAllCallbacks();
            if (time) {
                timer.string = time;
                timer.schedule(function () {
                    this.string = --time;
                }, 1, time-1);
            }
            else {
                timer.string = "";
            }
            mating.active = true;
        }
        else {
            this.matingFlag = false;
            cc.find("time", mating).getComponent(cc.Label).unscheduleAllCallbacks();
            mating.active = false;
        }
    },
    // 设置断线重连中
    setReconnecting (flag) {
        let reconnecting = cc.find("action/center/reconnecting", this.node);
        if (flag) {
            if (!reconnecting.getComponent(cc.Sprite).spriteFrame) {
                util.loadSprite("game/reconnecting", reconnecting);
            }
            reconnecting.active = true;
        }
        else {
            reconnecting.active = false;
        }
    },
    // 断线提示
    setDisconnect (flag) {
        let disconnect = cc.find("action/center/disconnect", this.node);
        if (flag) {
            if (!disconnect.getComponent(cc.Sprite).spriteFrame) {
                util.loadSprite("game/disconnect", disconnect);
            }
            disconnect.active = true;
        }
        else {
            disconnect.active = false;
        }
    },
    // 返回大厅
    backToHall () {
        util.log("返回大厅");
        // 清理监听
        network.setOnDisconnectListener();
        // 清理监听后台
        sdk.onEnterBackground["GameScene"] = null;
        sdk.onEnterForeground["GameScene"] = null;
        network.send(2002);
        for (var i = 0; i < GameConfig.OP_SP_NUMBER; i++) {
            cc.find("button/right/op_bg/hand_bg/op_"+i+"/halo", this.node).getComponent(cc.Animation).stop("halo");
        }
        cc.director.loadScene("hall");
    },
    // 匹配中断线重连
    reconnectMating (data) {
        util.log("--------断线重连 匹配状态");
        this.block(1);
        this.unblock(1);
    },
    // 好友等待断线重连
    reconnectWaiting (data) {
        util.log("--------断线重连 等待状态");
        this.block(2);

        // 玩家进入消息
        {
            let info = {
                app_id : data.app_id,
                mapId : data.mapid,
                gameKind : data.gameKind,
                room_id : data.room_id,
                players : data.players,
                owner : data.ownerid,
                playerNum : data.playerNum,
                max_player_cnt : data.max_player_cnt,
                ts : data.ts,
            };
            this.onNetPlayerEnter(info);
        }

        // 准备
        {
            for (let i = 0; i < data.players.length; i++) {
                let uid = data.players[i].uid;
                var player = this.players[this.pos[uid]];
                if (player) {
                    player.setReady(data.players[i].ready);
                }
                else {
                    util.error("玩家"+uid+"不在当前牌桌 "+JSON.stringify(this.pos));
                }
                if (uid === gameData.uid) {
                    // 玩家自己准备了
                    cc.find("button/center/ready", this.node).active = false;
                }
            }
        }

        this.unblock(2);
    },
    // 游戏开始断线重连
    reconnectGaming (data) {
        util.log("--------断线重连 游戏状态");
        this.block(3);

        util.log("--------断线重连 游戏数据 = " + JSON.stringify(data));

        // 隐藏邀请按钮
        this.setInviteBtn(false);

        // 玩家进入消息
        {
            let info = {
                app_id : data.app_id,
                mapId : data.mapid,
                gameKind : data.gameKind,
                room_id : data.room_id,
                players : data.players,
                owner : data.ownerid,
                playerNum : data.playerNum,
                max_player_cnt : data.max_player_cnt,
                ts : data.ts,
            };
            this.onNetPlayerEnter(info);
            // 头像移动
            for (var i = 0; i < this.players.length; i++) {
                var player = this.players[i];
                player.actPlayerMove();
            }
        }

        // 解散房间，单独发
        // if (data.roomJieSanRecord && data.roomJieSanRecord !== "null") {
        //     this.onNetPlayerDismiss(data.roomJieSanRecord);
        // }

        // 离线
        if (gameData.kindId === config.KIND_FRIEND) {
            // 只有好友局显示断线，匹配直接托管，不显示
            for (let i = 0; i < data.players.length; i++) {
                let uid = data.players[i].uid;
                var player = this.players[this.pos[uid]];
                if (player) {
                    player.setOffline(data.players[i].isOffline);
                }
                else {
                    util.error("玩家"+uid+"不在当前牌桌 "+JSON.stringify(this.pos));
                }
            }
        }

        // 癞子
        if (this.gameType && this.gameType.reconnectGaming) {
            this.gameType.reconnectGaming(data);
        }

        // 设置牌
        for (let i = 0; i < data.player_pai.length; i++) {

            let info = data.player_pai[i];
            let index = this.pos[info.uid];
            let player = this.players[index];
            // 自己
            if (info.uid === gameData.uid) {
                // 听牌
                this.tingData = info.tingpai;
                //判断是否为空对象 {}
                var isEmptyObject = function (obj) {
                    for(var key in obj){
                        return false
                    };
                    return true
                }

                if (isEmptyObject(info.tingpai)) {
                    this.tingData = null;
                }

                util.log("--------断线重连 自己听牌数据 = " + JSON.stringify(info.tingpai));
                // 吃碰杠胡
                // if (info.chipengganghu) {
                //     let data = {
                //         uid : gameData.uid,
                //         pai_id : info.chipengganghu.pai_id,
                //         op : info.chipengganghu.op,
                //     }
                //     this.onNetGameOpTip(data);
                // }
            }
            if (!player) {
                continue;
            }
            // 牌组
            for (let j = 0; j < info.dui_arr.length; j++) {
                let opData = info.dui_arr[j];
                if (opData.type === 1) {
                    // 吃
                    player.setChiCard(false);
                }
                else if (opData.type === 2) {
                    // 碰
                    player.setPengCard(false, opData.pai_arr[0]);
                }
                else if (opData.type === 3) {
                    // 杠
                    player.setGangCard(false, opData.pai_arr[0], 2);
                }
                else if (opData.type === 4) {
                    // 暗杠
                    player.setGangCard(false, opData.pai_arr[0], 1);
                }
            }
            // 手牌
            player.setHandCard(info.pai_arr, info.cur_pai_num, info.lastmopaiid);
            // 牌堆
            player.setTableCard(info.used_pai_arr);

            // 下跑
            player.setXiaPaoScore(info.paocnt);
        }
        // 剩余牌数
        this.setLeftCard(data.left_pai_num);
        // 当前局数
        this.setRecordBtn(data.cur_round);
        // 轮流
        this.takeTurn(data.turn_uid);
        // 倒计时
        this.setTimer(data.left_sec, data.ts);

        // 设置托管
        if (gameData.kindId === config.KIND_MATE && data.auto) {
            this.setAutoPop(true);
            this.players[0].setAuto(true);
        }
        else {
            this.setAutoPop(false);
            this.players[0].setAuto(false);
        }

        this.unblock(3);
    },
    // 游戏结束断线重连
    reconnectEnding (data) {
        util.log("--------断线重连 结束状态");
        this.block(4);
        this.unblock(4);
        // 隐藏邀请按钮
        this.setInviteBtn(false);
        this.reconnectWaiting(data);
    },

    // 阻塞
    block (index) {   
        // network.stop();
        // return;
        // 阻塞时，既不接受新的消息，也不继续处理阻塞消息
        this.blockStatus = true;
        this.unblockStatus = false;
        this.blockNumber++;
        util.log("阻塞 blockStatus=" + this.blockStatus + " blockNumber=" + this.blockNumber + " index=" + index);
    },
    // 非阻塞
    unblock (index) {
        // network.start();
        // return;
        // 必须等待之前的消息完全处理完毕，才能处理新的消息，blockStatus=true
        // 处理的过程中，如果需要再次阻塞，不再处理阻塞消息，unblockStatus=true
        this.unblockStatus = true;
        while (this.blockData.length > 0) {
            if (this.unblockStatus) {
                // 可处理阻塞消息
                let block = this.blockData.shift();
                let protocal = block.protocal;
                let handler = block.handler;
                let data = block.data;
                util.log("解除阻塞 处理消息 protocal="+protocal+" data="+JSON.stringify(data));
                handler.call(this, data);
            }
            else {
                // 不可处理阻塞消息，直接返回
                return;
            }
        };
        // 阻塞消息处理完毕，再接受新的消息
        this.blockStatus = false;
        this.blockNumber--;
        util.log("解除阻塞 blockStatus=" + this.blockStatus + " blockNumber=" + this.blockNumber + " index=" + index);
    },
    


    // 按钮回调
    // 返回
    onBtnBack (event, custom) {
        util.log("点击返回按钮");
        audioUtils.playCloseSoundEffect();

        if (gameData.kindId === config.KIND_MATE) {
            // 匹配
            if (this.gameStatus === GameConfig.STATUS_MATCHING) {
                // 正在匹配，退出游戏服
                util.log("正在匹配  --  this.gameStatus  == "+this.gameStatus);
                network.send(3009, {room_id: gameData.roomId, is_accept : 1});//先加一个退出房间
                this.backToHall();
            }
            else if (this.gameStatus === GameConfig.STATUS_GOING) {
                // 已开始，未结束，托管
                this.setMateExitPop(true);
            }
            else if (this.gameStatus === GameConfig.STATUS_ENDING) {
                // 已结束，退出游戏服
                this.backToHall();
            }
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            // 好友
            if (this.gameStatus === GameConfig.STATUS_WAITING) {
                // 等待队友，解散
                if (this.ownerUid && gameData.uid === this.ownerUid) {
                    // 房主提示是否解散房间
                    let that = this;
                    util.tip({
                        node : this.node,
                        type : 2,
                        string : "是否解散房间",
                        isShowLeftBtn : true,
                        isShowRightBtn : true,
                        rightCallback : function () {
                            that.sendPlayerDismiss();
                        },
                    });
                }
                else {
                    // 其他玩家提示是否退出房间
                    let that = this;
                    util.tip({
                        node : this.node,
                        type : 2,
                        string : "是否退出房间",
                        isShowLeftBtn : true,
                        isShowRightBtn : true,
                        rightCallback : function () {
                            that.sendPlayerDismiss();
                        },
                    });
                }
                
            }
            else if (this.gameStatus === GameConfig.STATUS_GOING) {
                // 已开始，未结束，解散
                this.setFriendExitPop(true);
            }
            else if (this.gameStatus === GameConfig.STATUS_ENDING) {
                // 已结束，解散
                this.setFriendExitPop(true);
            }
        }
    },
    // 聊天
    onBtnChat (event, custom) {
        util.log("点击聊天按钮");
        audioUtils.playClickSoundEffect();

        if (!this.ChatPop) {
            let that = this;
            util.loadGamePrefab("ChatPop", function (perfab) {
                if (!that.ChatPop) {
                    let chatPop = cc.instantiate(perfab);
                    cc.find("pop/left", that.node).addChild(chatPop, GameConfig.POP_ZORDER["ChatPop"]);
                    that.ChatPop = chatPop.getComponent("ChatPop");
                    that.ChatPop.setGame(that);
                    that.ChatPop.show();
                }
                else {
                    that.ChatPop.show();
                }
            });
        }
        else {
            this.ChatPop.show();
        }
    },
    // 语音
    onBtnVoice (event, custom) {
        util.log("点击语音按钮");
        audioUtils.playClickSoundEffect();
    },
    // 任务
    onBtnTask (event, custom) {
        util.log("点击任务按钮");
        audioUtils.playClickSoundEffect();
        var self = this;
        util.loadPrefab("taskLayer",function(data){
            if(util.isNodeExist(self.node,"taskLayer")){
                util.log("taskLayer已存在");
                return;
            }
            var task_node = cc.instantiate(data);
            self.node.addChild(task_node);
            util.getTaskStatus(
                function(respJsonInfo){
                    if(respJsonInfo["code"] == "0"){
                        //util.log("任务成功 +=== "+ respJsonInfo['msg']);
                        var msg = JSON.parse(respJsonInfo['msg']);
                        util.log("task  === "+ msg);
                        task_node.getComponent("taskLayer").setTaskData(msg);
                        task_node.getComponent("taskLayer").setBg(2);

                    }else{
                        util.log("getTaskStatus error code:"+respJsonInfo["code"]);
                    }
                },
                null,
                null
            );
        });
    },
    // 规则（带反馈）
    onBtnGameRule (event, custom) {
        util.log("点击规则按钮");
        audioUtils.playClickSoundEffect();
        var self = this;
        util.log("gameData.mapId =======   "+gameData.mapId);
        util.log("12341gameData.mateLevel ===  "+ gameData.mateLevel);
        var ziid = gameData.mapId;
        var level = gameData.mateLevel;
        var mapId = gameData.mapId;
        var id = 0;
        if(gameData.mapId == 100){//跑得快
            id = 1;
        }else if(gameData.mapId == 1001){//推倒胡
            id = 2;
        }else if(gameData.mapId == 1101){//郑州
            id = 3;
        }else if(gameData.mapId == 1201){//信阳
            id = 4;
        }else if(gameData.mapId == 1301){//南阳
            id = 5;
        }else if(gameData.mapId == 1401){//南阳
            id = 6;
        }
        util.loadPrefab("gameRuleLayer",function(data){
            if(util.isNodeExist(self.node,"gameRuleLayer")){
                return;
            }
            var task_node = cc.instantiate(data);
            task_node.getComponent("gameRuleLayer").initScene(id,ziid,level,mapId);
            task_node.setName("gameRuleLayer");
            self.node.addChild(task_node);
        });
        
    },

    // 流水
    onBtnRecord (event, custom) {
        util.log("点击流水按钮");
        audioUtils.playClickSoundEffect();
    },
    // 邀请
    onBtnInvite (event, custom) {
        util.log("点击邀请按钮");
        audioUtils.playClickSoundEffect();
        sdk.inviteFriendToFriendGame({
            mapId : gameData.mapId,
            kindId : gameData.kindId,
            serverUrl : gameData.serverUrl,
            roomId : gameData.roomId,
        });
    },
    // 准备
    onBtnReady (event, custom) {
        util.log("点击准备按钮");
        audioUtils.playClickSoundEffect();
        this.initGame();
        this.sendPlayerReady(true);
    },
    // 下一局
    onBtnNext (event, custom) {
        util.log("点击下一局按钮");
        audioUtils.playClickSoundEffect();
        this.initGame();
        this.setMateWaiting(true);
        // 发送匹配消息
        network.send(2201, {
            playerId: gameData.uid,
            mapId: gameData.mapId,//玩法ID 现在只做了两个，暂时写死
            piLevel: gameData.mateLevel,
            gameKind : config.KIND_MATE,
            app_id : gameData.appId,
            restart : true,
            roomId : gameData.roomId
        });
    },
    // 听牌
    onBtnTing (event, custom) {
        util.log("点击听牌按钮 "+JSON.stringify(this.tingData));
        audioUtils.playClickSoundEffect();
        if (this.tingData) {
            let tingValue = Object.keys(this.tingData);
            if (tingValue.length === 1) {
                // 只有一张听牌
                this.setTingPop(tingValue[0], true);
            }
        }
    },
    //自动胡牌
    onBtnAutoHuPai (event, custom) {
        cc.find("button/right/auto_hupai", this.node).active = false;
        this.sendPlayerAuto(true);
        this.setAutoPop(true);
        this.players[0].setAuto(true);
    },
    // 操作
    onBtnOp (event, custom) {
        util.log("点击操作按钮 custom="+custom);
        // 隐藏提示
        this.setOp();
        if (!this.opCardValue) {
            return;
        }
        var op = null;
        if (custom === "pass") {
            // 过
            op = GameConfig.OP_PASS;
        }
        else if (custom === "0") {
            // 吃
            op = GameConfig.OP_CHI;
        }
        else if (custom === "1") {
            // 碰
            op = GameConfig.OP_PENG;
        }
        else if (custom === "2") {
            // 杠
            op = GameConfig.OP_GANG;
        }
        else if (custom === "3") {
            // 胡
            op = GameConfig.OP_HU;
        }
        else if (custom === "4") {
            // 听
            op = GameConfig.OP_TING;
        }
        if (!op || op === GameConfig.OP_PASS) {
            // 过
            // todo改成一次性处理
            let opData = [];
            for (let i = 0; i < this.opCardValue.length; i++) {
                let data = this.opCardValue[i];
                for (let j = 0; j < data.length; j++) {
                    opData = data[j]
                    break;
                }
            }
            this.sendGameOp(GameConfig.OP_PASS, opData);
        }
        else {
            // 有操作
            let opData = this.opCardValue[this.getOpIndex(op)];
            if (opData.length > 1) {
                // 多种选择，设置多选弹窗
                this.curOp = op;
                this.setOpMultiPop(op, opData);
            }
            else {
                // 只有一种选择，发送操作消息
                this.sendGameOp(op, opData[0]);
            }
        }
    },

    
    // 吞噬
    onBtnSwallow (event, custom) {},

    // 网络消息
    // 接收消息
    // 相同ip提示
    onNetPlayerSameIp (data) {
        util.log("--------相同ip提示");
        if (!data) {
            return;
        }

        // 设置显示
        this.setSameIpPop(data);
    },
    // 玩家匹配
    onNetPlayerMating (data) {
        // 根据救济金提示
        if (!data) {
            return;
        }

        if (data.alms) {
            let alms = data.alms;
            if (alms.hintCode === 0) {
                // 救济金
                let content = "您的金豆不足！系统赠送您"+alms.award+"豆,今天第"+(parseInt(alms.todayAlmsTimes)+1)+"次领取，一共可领取"+alms.awardTimes+"次。";
                //领取救济金提示
                util.tip4({
                    node : this.node,
                    type : 1,
                    string : content,
                    level : gameData.mateLevel,
                    num : alms.award,
                    leftCallback : null,
                    centerCallback : null,
                    rightCallback : null,
                });
            }
            else if (alms.hintCode === 1) {
                // 正常开始
                this.initGame();
                this.setMateWaiting(true);
            }
            // else if (alms.hintCode === 2) {
            //     //
            //     this.initGame();
            //     this.setMateWaiting(true);
            // } 
            else if (alms.hintCode === 3) {
                // 充值提示
                util.tip4({
                    node : this.node,
                    type : 2,
                    string : decodeURIComponent(alms.hintContent),
                    level : gameData.mateLevel,
                    num : alms.award,
                    leftCallback : null,
                    centerCallback : null,
                    rightCallback : null,
                });
            }
        }
    },
    // 玩家进入房间
    onNetPlayerEnter (data) {
        if (!data) {
            return;
        }

        // todo，过滤后端数据，全部转化一次

        gameData.appId = data.app_id;
        gameData.mapId = data.mapid || data.mapId;
        gameData.kindId = data.gameKind;
        gameData.roomId = data.room_id;

        // this.maxPlayerNum = data.max_player_cnt;
        this.curPlayerNum = data.playerNum;

        this.ownerUid = data.owner;

        // this.desp = data.desp;
        // this.isDaiKai = data.isDaiKai;
        // this.isClubOwner = data.isClubOwner;


        // 绑定数据和界面
        // 查询自己在后端下标与前端下标0的偏移
        var offset = 0;
        for (var i = 0; i < data.max_player_cnt; i++) {
            if (data.players[i] && data.players[i].uid === gameData.uid) {
                // 当前玩家
                offset = i;
                break;
            }
        }

        this.pos = {};
        let actionFlag = false;
        
        if (gameData.kindId === config.KIND_MATE) {
            // 匹配场只处理一个玩家和玩家全部进入的情况，其他情况，不处理
            if (data.players.length === 1) {
                // 只有自己，正常处理
                actionFlag = false;
            }
            else if (data.max_player_cnt === this.curPlayerNum) {
                // 延迟动作
                actionFlag = false;
                if(data.cheat){//新手 玩家  匹配机器人 需要延迟，作弊局
                    util.log("data.cheat == " + data.cheat);
                    actionFlag = true;
                }
            }
            else if(data.players.length == 2 || data.players.length == 3){
                // // 玩家不足，放弃处理
                // return;
                //匹配机制改动
                actionFlag = false;
                if(data.cheat){//新手 玩家  匹配机器人 需要延迟，作弊局
                    return;
                }

            }
            if(data.continue == false){//重新匹配
                this.gameStatus = GameConfig.STATUS_MATCHING;
            }
        }
        // 断线重连
        if (this.isReconnect) {
            actionFlag = false;
        }
        
        if ( actionFlag ) {
            util.log("--------玩家延迟进入房间");
            // 匹配而且玩家满了
            // 播放动画延迟，提前进入游戏状态
            if(this.curPlayerNum == data.max_player_cnt){
                this.gameStatus = GameConfig.STATUS_GOING;
            }
            // 延迟处理
            this.block(5);
            // 设置玩家数据，记录uid对应前端下标
            let delay = 0;
            for (var i = 0; i < data.max_player_cnt; i++) {
                let index = (i - offset + data.max_player_cnt) % data.max_player_cnt;
                let player = this.players[index];
                if (data.players[i]) {
                    // 该位置有玩家
                    player.setPlayerData(data.players[i]);
                    this.pos[data.players[i].uid] = index;
                    // 匹配延迟显示
                    if (index !== 0) {
                        // 不是玩家自己，延迟
                        delay += 1;
                        player.node.stopAllActions();
                        player.node.runAction(
                            cc.sequence(
                                cc.delayTime(delay),
                                cc.callFunc(function () {
                                    player.refreshInfoUI();
                                }, this)
                            )
                        );
                    }
                    else {
                        // 玩家自己，直接显示
                        player.refreshInfoUI();
                    }
                }
                else {
                    // 该位置没有玩家
                    player.infoNode.active = false;
                }
            }
            // 延迟开始
            this.action.runAction(
                cc.sequence(
                    cc.delayTime(delay),
                    cc.callFunc(function () {
                        this.setMateWaiting(false);
                        this.setTurn(offset, data.max_player_cnt);
                        this.unblock(5);
                    }, this)
                )
            );
        }
        else {
            // 设置玩家数据，记录uid对应前端下标
            util.log("--------玩家进入房间");
            for (var i = 0; i < data.max_player_cnt; i++) {
                let index = (i - offset + data.max_player_cnt) % data.max_player_cnt;
                let player = this.players[index];
                if (data.players[i]) {
                    // 该位置有玩家
                    player.setPlayerData(data.players[i]);
                    player.refreshInfoUI();
                    this.pos[data.players[i].uid] = index;
                    // 直接显示
                    player.infoNode.active = true;
                }
                else {
                    // 该位置没有玩家
                    player.infoNode.active = false;
                }
            }
            this.setTurn(offset, data.max_player_cnt);
        }

        // 正在匹配中
        if (gameData.kindId === config.KIND_MATE) {
            if (data.max_player_cnt === this.curPlayerNum) {
                // 人满
                if (this.isReconnect) {
                    // 断线重连，隐藏正在匹配中
                    this.setMateWaiting(false);
                }
                else {
                    // 不处理，延时隐藏
                    if(!data.cheat){//不是新手
                        this.setMateWaiting(false);
                    }
                }
            }
            else {
                this.setMateWaiting(true);
            }
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            // 隐藏正在匹配中
            this.setMateWaiting(false);
        }

        // 设置房主
        if (gameData.kindId === config.KIND_FRIEND) {
            let player = this.players[this.pos[data.owner]];
            if (player) {
                player.setOwner(true);
            }
            else {
                util.error("玩家"+data.owner+"不在当前牌桌 "+JSON.stringify(this.pos));
            }
        }

        // 没有玩家的位置设置active，三人场之外的人
        for (var i = data.max_player_cnt; i < GameConfig.PLAYER_MAX; i++) {
            this.players[i].active = false;
        }
    },
    // 玩家离开房间
    onNetPlayerExit (data) {
        //两个人匹配到一起，一个人先点了下一局，然后另一个人点换桌后收到3003 ，此时不处理
        if(data.kickouted){//不该退出房间，因为其他原因被退出房间
            return;
        }
        util.log("--------玩家"+this.pos[data.uid]+"离开房间");
        // 玩家自己离开房间，回到大厅
        if (""+data.uid === ""+gameData.uid) {
            this.backToHall();
            return;
        }

        if (data.del_room) {
            // 房主退出房间，解散
            var str = "房主已解散房间";
            if (data.jiesanhint) {
                // 代开房
                str = decodeURIComponent(data.jiesanhint);
            }
            var that = this;
            //util.tip(str, function () {
            //    that.backToHall();
            //});
            // util.tip(that.node, 2, str, null, function () {
            //         that.backToHall();
            //     },
            //     null, false, true, false);
            util.tip({
                node : that.node,
                type : 2,
                string : str,
                leftCallback : null,
                centerCallback : function () {
                    that.backToHall();
                },
                rightCallback : null,
                isShowLeftBtn : false,
                isShowCenterBtn : true,
                isShowRightBtn : false,
            });
        }
        else {
            // 移除退出房间的玩家
            var index = this.pos[data.uid];
            var player = this.players[index];
            if (player) {
                player.setPlayerData();
                player.refreshInfoUI();
                delete this.pos[data.uid];
            }
        }
    },
    // 玩家准备
    onNetPlayerReady (data) {
        util.log("--------玩家"+this.pos[data.uid]+"准备");
        var player = this.players[this.pos[data.uid]];
        if (player) {
            player.setReady(true);
        }
        else {
            util.error("玩家"+data.uid+"不在当前牌桌 "+JSON.stringify(this.pos));
        }
        if (data.uid === gameData.uid) {
            // 玩家自己准备了
            cc.find("button/center/ready", this.node).active = false;
        }
    },
    //玩家继续下一局
    onNetPlayerGoOn (data){
        util.log("继续下一局");
        util.log("--------玩家"+this.pos[data.uid]+"继续下一局");

        this.initGame();
        this.setMateWaiting(false);
    },
    // 断线重连
    onNetPlayerReconnect (data) {
        util.log("--------断线重连");
        this.isReconnect = true;
        gameData.appId = data.app_id;
        gameData.mapId = data.mapid;
        gameData.kindId = data.gameKind;
        gameData.mateLevel = data.gameLevel;
        gameData.roomId = data.room_id;

        if (data.room_status === 0) {
            // 未开始
            if (gameData.kindId === KIND_MATE) {
                // 匹配
                this.gameStatus = GameConfig.STATUS_MATCHING;
                this.reconnectMating(data);
            }
            else if (gameData.kindId === KIND_FRIEND) {
                // 好友
                this.gameStatus = GameConfig.STATUS_WAITING;
                this.reconnectWaiting(data);
            }
        }
        else if (data.room_status === 1) {
            // 进行
            this.gameStatus = GameConfig.STATUS_GOING;
            this.reconnectGaming(data);
        }
        else if (data.room_status === 2) {
            // 结束
            util.log("mjf--断线重连结束状态");
            this.gameStatus = GameConfig.STATUS_ENDING;
            this.reconnectEnding(data);
        }


        this.isReconnect = false;
        // // this.curOp;
        // // this.opCardValue;
    },
    //断线重连不在房间内
    onNetPlayerOffLineReconnect (data) {
        util.log("mjf--断线重连后是否在房间中");
        this.isInRoom = data.isInroom;
        if(!data.isInroom){
            util.log("mjf--  断线重连后不在房间内，返回大厅");
            this.backToHall();
        }
    },
    // 玩家聊天
    onNetPlayerChat (data) {
        util.log("--------玩家"+this.pos[data.uid]+"聊天");
        if (this.ChatPop) {
            this.ChatPop.onNetQuick(data);
        }
    },
    // 玩家解散房间
    onNetPlayerDismiss (data) {
        util.log("--------玩家解散房间 "+data.is_jiesan);
        if (!data) {
            return;
        }
        this.setFriendDismissPop(data);
    },
    // 同步玩家财富
    onNetPlayerMoney (data) {
        util.log("--------玩家财富刷新");
        gameData.numOfCards = data.roomCard;
        gameData.gameBean = data.happyBeans;
        gameData.gameDiamond = data.diamond;
        gameData.gameGradeXP = data.rankXp;
    },
    // 提示
    onNetPlayerNotice (data) {
        util.log("--------提示 "+decodeURIComponent(data.content));
        util.tip2(decodeURIComponent(data.content));
    },
    // 强制返回提示
    onNetPlayerBackNotice (data) {
        util.log("--------强制返回提示 "+decodeURIComponent(data.content));
        let msg = decodeURIComponent(data.content);
        var canvas = cc.director.getScene().getChildByName("Canvas");
        let that = this;
        util.tip({
            node : canvas,
            type : 2,
            string : msg,
            leftCallback : null,
            centerCallback : function () {
                that.backToHall();
            },
            rightCallback : null,
            isShowLeftBtn : false,
            isShowCenterBtn : true,
            isShowRightBtn : false
        });
    },
    // 断线
    onNetPlayerOffLine (data) {
        util.log("--------玩家"+this.pos[data.uid]+"断线");
        if (!data) {
            return;
        }

        if (gameData.kindId === config.KIND_FRIEND) {
            // 只有好友局显示断线，匹配直接托管，不显示
            let player = this.players[this.pos[data.uid]];
            if (player) {
                player.setOffline(data.is_offline);
            }
            else {
                util.error("玩家"+data.uid+"不在当前牌桌 "+JSON.stringify(this.pos));
            }
        }
    },
    // 游戏开始，发牌
    onNetGameStart (data) {
        util.log("--------游戏开始，发牌");
        if (!data) {
            return;
        }
        this.block(6);

        // 游戏状态
        this.gameStatus = GameConfig.STATUS_GOING;
        // 隐藏邀请按钮
        this.setInviteBtn(false);
        //游戏开始隐藏退出按钮
        if (gameData.kindId === config.KIND_MATE){//匹配
            this.setBackBtn(false);
        }

        // 隐藏玩家已准备
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].setReady(false);
        }
        // 当前局数
        this.setRecordBtn(data.cur_round);
        // 剩余局数
        data.left_round;
        // 游戏开始
        this.event.emit("actGameStart", {data : data});
        //游戏开始时间
        this.startTime = (new Date()).getTime();
    },
    // 轮到
    onNetGameTurn (data) {
        util.log("--------轮到玩家"+this.pos[data.uid]);
        this.takeTurn(data.uid);
        // 倒计时
        this.setTimer(data.left_sec, data.ts);
    },
    // 摸牌
    onNetGameExtraCard (data) {
        util.log("--------玩家"+this.pos[data.uid]+"摸牌 "+data.pai_id);
        if (!data) {
            return;
        }

        // 设置摸牌
        this.setLeftCard(data.left);
        var player = this.players[this.pos[data.uid]];
        if (player) {
            player.setExtraCard(true, data.pai_id);
        }
        else {
            util.error("玩家"+data.uid+"不在当前牌桌 "+JSON.stringify(this.pos));
        }
        this.takeTurn(data.uid);
        // 倒计时
        this.setTimer(data.left_sec, data.ts);
    },
    // 出牌
    onNetGameOutCard (data) {
        util.log("--------玩家"+this.pos[data.uid]+"出牌 "+data.pai_id);
        var index = this.pos[data.uid];
        var player = this.players[index];
        if (player) {
            let that = this;
            player.OutCard(data.pai_id, data.idx, function () {
                util.log("----玩家"+that.pos[data.uid]+"出牌 "+data.pai_id+" 回调");
                player.setHandCard(data.pai_arr, data.pai_cnt || data.pai_arr.length);
                player.setExtraCard(false);
            });
        }
        else {
            util.error("玩家"+data.uid+"不在当前牌桌 "+JSON.stringify(this.pos));
        }
        // 刷新听牌数据
        if (index === 0) {
            if (this.tingData && this.tingData[data.pai_id]) {
                // 只保留出牌的听牌数据
                let curTingData = this.tingData[data.pai_id];
                this.tingData = {};
                this.tingData[data.pai_id] = curTingData;
                util.log("刷新听牌数据 "+JSON.stringify(this.tingData));
                //显示自动胡牌按钮
                cc.find("button/right/auto_hupai", this.node).active = true;
                this.players[0].previousClickCard = null;
            } else {
                if (!this.players[0].auto) {
                    this.tingData = null;      
                }
                cc.find("button/right/auto_hupai", this.node).active = false;
            }
        }
    },
    // 吃碰杠胡提示
    onNetGameOpTip (data) {
        util.log("--------玩家"+this.pos[data.uid]+"操作提示 "+JSON.stringify(data.op) + "操作的牌 " + JSON.stringify(data.pai_id));
        if (!data) {
            return;
        }
        // 只有玩家自己能操作才显示
        if (data.uid === gameData.uid) {
            // 设置显示
            this.opCardValue = data.pai_id;
            //托管状态下，可以胡牌时，不用进行操作，直接胡牌
            if (this.players[0].auto === true && data.op[3] === true) {
                this.sendGameOp(op, data.pai_id[3][0]);
                return;
            }
            this.setOp(data.op);
            // 设置轮流
            this.takeTurn(gameData.uid);
            // 倒计时
            this.setTimer(data.left_sec, data.ts);
        }
        else {
            // 不轮到当前玩家出牌，此时，不修改风指向，但是限制玩家出牌，而且不显示听牌箭头
            this.players[0].current = false;
            this.players[0].setTingArrow();
        }
    },
    // 吃碰杠胡结果
    onNetGameOpResult (data) {
        util.log("--------玩家"+this.pos[data.uid]+"操作结果 "+JSON.stringify(data.op));
        var player = this.players[this.pos[data.uid]];
        if (player) {
            if (data.op[0]) {
                // 吃
                player.setChiCard(true);
                // 删除被操作的玩家的牌堆
                if (data.from_uid && (data.from_uid !== data.uid))
                {
                    var fromPlayer = this.players[this.pos[data.from_uid]];
                    if (fromPlayer) {
                        fromPlayer.deleteTableCard();
                    }
                }
                // 设置新的手牌
                player.setHandCard(data.pai_arr, data.pai_cnt || data.pai_arr.length);
            }
            else if (data.op[1]) {
                // 碰
                player.setPengCard(true, data.pai_id);
                // 删除被操作的玩家的牌堆
                if (data.from_uid && (data.from_uid !== data.uid))
                {
                    var fromPlayer = this.players[this.pos[data.from_uid]];
                    if (fromPlayer) {
                        fromPlayer.deleteTableCard();
                    }
                }
                // 设置新的手牌
                player.setHandCard(data.pai_arr, data.pai_cnt || data.pai_arr.length);
            }
            else if (data.op[2]) {
                // 杠
                player.setGangCard(true, data.pai_id, data.gang, data.dui_arr);
                // 删除被操作的玩家的牌堆
                if (data.from_uid && (data.from_uid !== data.uid))
                {
                    var fromPlayer = this.players[this.pos[data.from_uid]];
                    if (fromPlayer) {
                        fromPlayer.deleteTableCard();
                    }
                }
                // 设置新的手牌
                player.setHandCard(data.pai_arr, data.pai_cnt || data.pai_arr.length);
            }
            else if (data.op[3]) {
                // 胡
                player.setHuCard(true);
            }
            else if (data.op[4]) {
                // 听
                player.setTingCard(true);
            }
            else {
                // 过
                player.setPass(true);
            }
        }
        else {
            util.error("玩家"+data.uid+"不在当前牌桌 "+JSON.stringify(this.pos));
        }
        // 玩家操作，隐藏
        if (data.uid === gameData.uid) {
            this.setOp();
            this.takeTurn(data.uid);
        }
    },
    // 听牌提示
    onNetGameTingTip (data) {
        util.log("--------听牌提示 "+JSON.stringify(data.tishi));
        if (!data) {
            return;
        }
        // 隐藏自动胡牌按钮
        cc.find("button/right/auto_hupai", this.node).active = false;
        // 显示听牌
        this.tingData = data.tishi;
        // 听牌提示
        if (this.players[0].current) {
            // 轮到自己出牌，显示箭头
            this.players[0].setTingArrow(this.tingData);
        }
        else {
            // 不该自己出牌，显示按钮
            this.setTingBtn(true);
        }
    },
    // 单局结算
    onNetGameResult (data) {
        util.log("--------单局结算");
        // 设置游戏状态
        this.gameStatus = GameConfig.STATUS_ENDING;
        // 解散特殊处理，解散未开始房间，不显示小结算，直接显示大结算
        if (data.hu_type === 3) {
            // 解散
            if (!data.curRoundStatus) {
                // 本局未开始
                util.log("--------本局未开始 显示大结算");
                this.dismissFlag = true;
                return;
            }
        }
        // 解散房间需要停止动作
        if (data.hu_type === 3) {
            this.initAction();
        }
        // 关灯
        this.takeTurn();
        // 倒计时
        this.setTimer();
        // 隐藏听牌提示
        this.setTingPop();
        // 隐藏自动胡牌按钮
        cc.find("button/right/auto_hupai", this.node).active = false;
        // 设置手牌显示
        for (let i = 0; i < data.players.length; i++) {
            let playerData = data.players[i];
            let index = this.pos[playerData.uid];
            this.players[index].setResultCard(playerData.pai_arr, playerData.pai_arr.length);
        }
        if (data.hu_type === 0 || data.hu_type === 3) {
            // 解散和流局，先显示流局，再显示小结算的弹窗
            this.action.runAction(
                cc.sequence(
                    cc.delayTime(2),
                    cc.callFunc(function(){
                        // 流局
                        cc.find("action/center/peace", this.node).active = true;
                    }, this),
                    cc.delayTime(1.5),
                    cc.callFunc(function(){
                        // 小结算
                        if (gameData.kindId === config.KIND_MATE) {
                            // 匹配
                            this.setMateResultPop(data);
                        }
                        else if (gameData.kindId === config.KIND_FRIEND) {
                            // 好友
                            this.setFriendResultPop(data);
                        }
                        cc.find("action/center/peace", this.node).active = false;
                    }, this)
                )
            );
        }
        else {
            // 显示小结算的弹窗
            this.action.runAction(
                cc.sequence(
                    cc.delayTime(2),
                    cc.callFunc(function(){
                        if (gameData.kindId === config.KIND_MATE) {
                            // 匹配
                            this.setMateResultPop(data);
                        }
                        else if (gameData.kindId === config.KIND_FRIEND) {
                            // 好友
                            this.setFriendResultPop(data);
                        }
                    }, this)
                )
            );
        }
    },
    // 总结算
    onNetGameEnding (data) {
        util.log("--------总结算");
        if (!data) {
            return;
        }

        this.endingData = data;

        if (this.dismissFlag) {
            // 解散房间直接显示大结算
            this.setFriendEndingPop();
        }
    },
    // 托管
    onNetPlayerAuto (data) {
        util.log("--------玩家托管 "+data.tuoguan[gameData.uid]);
        // 关闭听牌提示
        this.setTingPop();
        if (gameData.kindId === config.KIND_MATE) {
            // 匹配只有自己托管才显示
            if (data.tuoguan && data.tuoguan[gameData.uid]) {
                this.setAutoPop(true);
                // 设置玩家托管状态
                this.players[0].setAuto(true);
            }
            else {
                this.setAutoPop(false);
                // 设置玩家托管状态
                this.players[0].setAuto(false);
            }
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            // 好友局不显示
            this.setAutoPop(false);
            this.players[0].setAuto(false);
        }
    },
    // 杠分现结
    onNetGameGangScore (data) {
        util.log("--------杠分现结");
        this.setGangScore(data.gang);
    },
    // 发送消息
    // 发送出牌消息
    sendGameOutCard (index, value) {
        util.log("--------发送出牌消息 value="+value);
        // 出牌
        network.send(4002, {room_id: gameData.roomId, pai_id: value, idx: index});
    },
    // 发送操作消息
    sendGameOp (op, value) {
        util.log("--------发送操作消息 op="+op+" value="+value);
        if (op && value) {
            network.send(4003, {room_id: gameData.roomId, op: op, pai_id: value});
            this.opCardValue = null;
        }
    },
    // 发送托管消息
    sendPlayerAuto (flag) {
        util.log("--------发送托管消息 flag="+flag);
        network.send(5002, {tuoguan : !!flag, room_id : gameData.roomId});
    },
    // 发送解散消息
    sendPlayerDismiss () {
        util.log("--------发送解散消息");
        network.send(3009, {room_id: gameData.roomId, is_accept : 1});
    },
    // 发送准备消息
    sendPlayerReady (flag) {
        util.log("--------发送准备消息");
        network.send(3004, {room_id: gameData.roomId, uid : gameData.uid});
    },

    // 切换到后台回调
    onEnterBackground () {
        util.log("切换到后台");
        // 停止播放音效
        this.bgmVolume = audioUtils.bgmVolume;
        this.sfxVolume = audioUtils.sfxVolume;
        gameData.musicStatus = 1;
        // audioUtils.setChangeBgm(0);
        sdk.pauseMusic();
        audioUtils.setSFXVolume(0);
        gameData.musicStatus = 2;
    },
    // 切换到前台回调
    onEnterForeground () {
        util.log("切换到前台");

        // gameData.musicStatus = 2;//gameData.musicStatus 1 是开 2 是关
        // audioUtils.setChangeBgm(1);
        // gameData.musicStatus = 1;

        // //音乐
        // var musicstatus = util.getLocalValue('musicStatus');
        // if(musicstatus && musicstatus == 1){
        //     sdk.stopMusic();
        //     var audioUrl = cc.url.raw(config.musicPath);
        //     sdk.playMusic(audioUrl);
        //     util.log("游戏界面--切换前台-播放背景音乐1--有音乐--hallScene_statr--musicstatus==1");
        // }else if(musicstatus && musicstatus == 2){//gameData.musicStatus 1 是开 2 是关
        //     sdk.stopMusic();
        //     var audioUrl = cc.url.raw(config.silencePath);
        //     sdk.playMusic(audioUrl);
        //     util.log("游戏界面--切换前台-播放背景音乐2--静音音乐--hallScene_statr--musicstatus==2");
        // }else{//新用户
        //     audioUtils.playBGM(config.musicPath);
        //     util.log("游戏界面--切换前台--播放背景音乐3--you音乐--hallScene_statr--新用户");
        // }
        sdk.resumeMusic();
        //音效
        var EffectValue = util.getLocalValue('soundEffectStatus');
        if(EffectValue && EffectValue == 2){
            util.log("游戏界面--切换前台-EffectValue == 0");
            audioUtils.setSFXVolume(0);
        }
        else if(EffectValue && EffectValue == 1){
            util.log("游戏界面--切换前台-EffectValue == 1");
            audioUtils.setSFXVolume(1);
        }
        else{
            util.log("游戏界面--切换前台-没有记录，默认播放");
            audioUtils.setSFXVolume(1);
        }
        // if (!network.isConnecting()) {
        //     // 断网
        //     util.log("断网");
        //     util.log("mjf--断网2");
        //     this.reconnect();
        // }
    },
    // 断线重连
    reconnect () {
        util.log("重连");
        this.blockData = [];
        this.unblock(7);
        // this.setReconnecting(true);
        // 直接重连
        let that = this;
        network.connect({
            serverUrl : gameData.serverUrl,
            openId : gameData.openid,
            successCB : function () {
                util.log("重连成功");
                that.setDisconnect(false);
                that.setReconnecting(true);
                that.isDisconnect = false;
                // 断线重连请求(在房间内服务器回3006，不在房间内回2302)
                network.send(2302, {
                    uid : gameData.uid
                });

                if(that.isInRoom){
                    util.log("mjf-- that.isInRoom == "+that.isInRoom);
                    // 重连成功
                    that.initGame();
                    // that.setReconnecting(false);
                    that.node.runAction(
                        cc.sequence(
                            cc.delayTime(2),
                            cc.callFunc(function () {
                                that.setReconnecting(false)
                            })
                        )
                    ); 
                }  
            },
            failureCB : function () {
                that.reconnect();
            }
        });
    },


    // 动作
    // 开局动画
    actStartAnim (event) {
        util.log("----播放开局动画");

        audioUtils.playSFX("resources/sound/game/effect/start.mp3");

        let data = event.detail.data;
        // 显示本场消耗
        let consume = cc.find("table/right/consume_bg", this.node);
        if (data.roomprice && data.roomprice !== 0) {
            util.log("gameData.mateLevel   ==  "+gameData.mateLevel );
            if(gameData.mateLevel == 3){//高级场
                consume.getChildByName("consume").getComponent(cc.Label).string = "赢家将付本场门票";
            }else{
                consume.getChildByName("consume").getComponent(cc.Label).string = "本场门票消耗 "+data.roomprice+" 金豆";
            }
            consume.active = true;
        }
        else {
            consume.active = false;
        }

        let start = cc.find("action/center/start", this.node);

        let anim = start.getChildByName("anim");
        anim.active = true;
        anim.getComponent(cc.Animation).play("anim");

        let sp = start.getChildByName("sp");
        sp.opacity = 0;
        sp.active = true;
        sp.stopAllActions();
        sp.runAction(
            cc.sequence(
                cc.fadeTo(0.7, config.maxOpacity),
                cc.delayTime(0.5),
                cc.callFunc(function () {
                    sp.active = false;
                    anim.getComponent(cc.Animation).stop("anim");
                    anim.active = false;
                    consume.active = false;
                    this.event.emit("actStartAnimOver", {data : data});             
                }, this)
            )
        );

        start.active = true;
    },
    // 玩家头像散开
    actPlayerMove (event) {
        util.log("----播放玩家头像散开动画");
        var data = event.detail.data;
        {
            // 玩家需要加回调
            var player = this.players[0];
            var that = this;
            player.actPlayerMove(function () {
                that.event.emit("actPlayerMoveOver", {data : data});
            });
        }
        for (var i = 1; i < this.players.length; i++) {
            var player = this.players[i];
            player.actPlayerMove();
        }
    },
    // 显示玩家牌垛
    actPlayerLeftCard (event) {
        util.log("----播放显示玩家牌垛动画");
        var data = event.detail.data;
        {
            // 玩家需要加回调
            var player = this.players[0];
            var that = this;
            player.actShowLeftCard(function () {
                that.event.emit("actPlayerLeftCardOver", {data : data});
            });
        }
        for (var i = 1; i < this.players.length; i++) {
            var player = this.players[i];
            player.actShowLeftCard();
        }
        // todo设置剩余牌数
        this.setLeftCard(data.totalPaisCnt);
    },
    // 骰子
    actDice (event) {
        util.log("----播放骰子动画");
        audioUtils.playSFX("resources/sound/game/effect/dice.mp3");
        var data = event.detail.data;
        var dice = cc.find("table/center/turn_bg/dice", this.node);
        // 骰子
        var dice_1 = dice.getChildByName("dice_1").getComponent(cc.Animation);
        var dice_2 = dice.getChildByName("dice_2").getComponent(cc.Animation);
        var anim_1_1 = dice_1.playAdditive("dice_1");
        var anim_1_2 = dice_1.playAdditive("circle_1");
        var anim_2_1 = dice_2.playAdditive("dice_1");
        var anim_2_2 = dice_2.playAdditive("circle_2");
        dice.active = true;
        dice.stopAllActions();
        dice.runAction(
            cc.sequence(
                cc.show(),
                cc.delayTime(1.5),
                cc.callFunc( function() {
                    dice_1.stop();
                    dice_2.stop();
                    util.loadSprite("game/dice/"+data.touzi1, dice.getChildByName("dice_1"));
                    util.loadSprite("game/dice/"+data.touzi2, dice.getChildByName("dice_2"));
                    this.event.emit("actDiceOver", {data : data});
                }, this),
                cc.delayTime(2),
                cc.hide()
            )
        );
    },
    // 设置庄家
    actZhuang (event) {
        util.log("----播放设置庄家动画");
        audioUtils.playSFX("resources/sound/game/effect/zhuang.mp3");
        
        var data = event.detail.data;
        var uid = data.zhuang_uid;
        // 设置庄家
        var turn = cc.find("table/center/turn_bg", this.node);
        var mainZhuang = cc.find("action/center/main_zhuang", this.node);
        mainZhuang.stopAllActions();
        mainZhuang.x = turn.x;
        mainZhuang.y = turn.y;
        mainZhuang.scaleX = 1.5;
        mainZhuang.scaleY = 1.5;
        mainZhuang.opacity = 200;

        mainZhuang.active = true;

        var player = this.players[this.pos[uid]];
        if (player) {
            var dest = player.infoNode.getChildByName("zhuang").convertToWorldSpaceAR(cc.p(0, 0));
            dest = cc.find("action/center", this.node).convertToNodeSpaceAR(dest);
            mainZhuang.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.fadeTo(0.2, config.maxOpacity),
                        cc.scaleTo(0.2, 1, 1),
                    ),
                    cc.moveTo(0.3, dest.x, dest.y),
                    cc.callFunc(function () {
                        player.setZhuang(true);
                        this.event.emit("actZhuangOver", {data : data});
                    }, this),
                    cc.hide()
                )
            );
        }
        else {
            util.error("玩家"+uid+"不在当前牌桌 "+JSON.stringify(this.pos));
            this.event.emit("actZhuangOver", {data : data});
        }
    },
    // 玩家显示手牌
    actPlayerHandCard (event) {
        util.log("----播放玩家显示手牌动画");
        var data = event.detail.data;
        var that = this;
        {
            var player = this.players[0];
            player.actShowHandCard(function (target) {
                util.log("----播放玩家显示手牌动画回调");
                target.setHandCard(data.paiArr, data.paiArr.length);
                target.setExtraCard(false);
                // 设置剩余牌，总牌数，减去手牌
                that.setLeftCard(data.totalPaisCnt - that.curPlayerNum*13);
                that.event.emit("actPlayerHandCardOver", {data : data});
            });
        }
        for (var i = 1; i < this.players.length; i++) {
            var player = this.players[i];
            player.actShowHandCard(function (target) {
                util.log("----播放玩家显示手牌动画回调");
                target.setHandCard(data.paiArr, data.paiArr.length);
                target.setExtraCard(false);
            });
        }
    },
    // 动作结束，继续游戏
    actGameGoing (event) {
        util.log("----动作结束，继续游戏");
        this.unblock(6);
    },

    // 刷新玩家财富
    refreshPlayerMoney (event) {
        util.log("监听事件刷新玩家财富");

        if (gameData.kindId === config.KIND_MATE) {
            // 豆
            this.players[0].info.score = gameData.gameBean;
        }

        // 刷新玩家财富
        for (let i = 0; i < config.PLAYER_MAX; i++) {
            this.players[i].refreshMoney();
        }
    },

    // 停止所有动作
    initAction () {
        util.log("----停止动作");
        {
            // actDice
            var dice = cc.find("table/center/turn_bg/dice", this.node);
            // 骰子
            var dice_1 = dice.getChildByName("dice_1").getComponent(cc.Animation);
            dice_1.stop();
            var dice_2 = dice.getChildByName("dice_2").getComponent(cc.Animation);
            dice_2.stop();
            dice.stopAllActions();
            dice.active = false;
        }
        {
            // actZhuang
            var mainZhuang = cc.find("action/center/main_zhuang", this.node);
            mainZhuang.stopAllActions();
            mainZhuang.active = false;
        }
        this.action.stopAllActions();
        for (let i = 0; i < GameConfig.PLAYER_MAX; i++) {
            this.players[i].initAction();
            this.players[i].node.stopAllActions();
        }
        if (this.gameType && this.gameType.initAction) {
            this.gameType.initAction();
        }
    },
});
