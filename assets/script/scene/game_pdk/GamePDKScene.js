// 游戏场景类

var GamePDKConfig = require("GamePDKConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        //是否是断线重连
        isReconnect : null,
        //是否断开连接
        isDisconnect : false,
        //断线重连后是否在房间内
        isInRoom : true,//默认在房间里面，只有收到2302后才不再房间里面
        // 当前玩家数量
        curPlayerNum : null,
        // 房主id
        ownerUid : null,
        // 不同玩法对象，游戏的mapid
        gameType : null,

        // 网络接口
        netlist : null,

        // 玩家对象数组，按显示下标访问
        players : [],
        // 玩家UID对应显示下标
        pos : null,
        curPlayerIndex : null,

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

        // 时间偏差
        timeDiff : 0,

        // 是否显示正在匹配中
        matingFlag : null,
        //ops是否显示
        isShowOps : false,
        //是否是强制出牌
        isQiangZhi : false,
        //设置不出按钮  true,显示灰色状态
        isBuchu : false,

        // 大结算数据
        endingData : null,

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

        btn_buchu:cc.Button,
        btn_tishi:cc.Button,
        btn_chupai:cc.Button,

        //适配
        bgAllNode:cc.Node,//背景节点，适配

        // 事件节点
        event : {default: null, type: cc.Node},
         // 动作节点
         action : {default: null, type: cc.Node},
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        util.log("跑得快游戏场景onload");

        audioUtils.playGameBgm();
        var width = this.node.getComponent("cc.Canvas").node.width;
        var height = this.node.getComponent("cc.Canvas").node.height;
        gameData.canvasWidth = width;
        gameData.canvasHeight = height;

        // GameConfig.resizeCard(this.node.width);//矫正扑克的尺寸，以后再加，by majiangfan
    },

    start () {
        util.log("跑得快游戏场景start开始");

        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
           
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            
        }else if(gameData.canvasWidth/gameData.canvasHeight>2){
            this.bgAllNode.scale = 1.1;
        } 

        network.stop();
        this.blockStatus = false;//阻塞状态
        this.unblockStatus = true;//解除阻塞状态
        this.blockList = {};
        this.unblockList = {};

        // 创建玩家对象
        this.initPlayer();
        // 添加事件监听
        this.initEvent();
        // 绑定网络
        this.initNetwork();

        this.initGame();

        util.log("mjf-- gameData.kindId == "+gameData.kindId);
        util.log("mjf-- gameData.mapId == "+gameData.mapId);//gameData.mateLevel
        util.log("mjf-- gameData.roomId == "+gameData.roomId);
        // 根据游戏类型设置显示
        if (gameData.kindId === config.KIND_MATE) {
            cc.find("table/center/type", this.node).active = true;
            cc.find("table/center/content_bg", this.node).width = 222;
            //场次
            cc.find("table/center/type2", this.node).active = true;
            var mateLevel = gameData.mateLevel;
            if(mateLevel>3){
                mateLevel -= 3;
            }
            util.loadSprite("pdkGame/txt_tab_"+mateLevel, cc.find("table/center/type2", this.node));

            // 必出
            if(gameData.all_rule["rule_youdabichu"]){
                util.loadSprite("pdkGame/txt_tab_bichu", cc.find("table/center/type", this.node));
            }else{
                util.loadSprite("pdkGame/txt_tab_feibichu", cc.find("table/center/type", this.node));
            }
            
            cc.find("table/center/room_id_text", this.node).active = false;
            cc.find("table/center/room_id_number", this.node).getComponent(cc.Label).string = "";
            cc.find("table/center/room_jushu_text", this.node).active = false;
            cc.find("table/center/room_jushu_number1", this.node).getComponent(cc.Label).string = "";
            cc.find("table/center/room_jushu_number2", this.node).getComponent(cc.Label).string = "";
            cc.find("table/center/room_jushu_text2", this.node).active = false;
            this.setInviteBtn(false);
            this.gameStatus = GamePDKConfig.STATUS_MATCHING;
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            cc.find("table/center/type", this.node).active = true;
            cc.find("table/center/content_bg", this.node).width = 400;
            //场次
            cc.find("table/center/type2", this.node).active = false;

            // 必出
            if(gameData.all_rule["rule_youdabichu"]){
                util.loadSprite("pdkGame/txt_tab_bichu", cc.find("table/center/type", this.node));
            }else{
                util.loadSprite("pdkGame/txt_tab_feibichu", cc.find("table/center/type", this.node));
            }
            cc.find("table/center/room_id_text", this.node).active = true;
            cc.find("table/center/room_id_number", this.node).getComponent(cc.Label).string = ""+gameData.roomId;
            cc.find("table/center/room_jushu_text", this.node).active = true;
            cc.find("table/center/room_jushu_number1", this.node).getComponent(cc.Label).string = "0";
            cc.find("table/center/room_jushu_number2", this.node).getComponent(cc.Label).string = gameData.rule_jushu;
            cc.find("table/center/room_jushu_text2", this.node).active = true;
            this.setInviteBtn(true);
            this.gameStatus = GamePDKConfig.STATUS_WAITING;
        }
        // 设置断网回调
        let that = this;
        network.setOnDisconnectListener(function () {
            util.log("mjf--断网1");
            that.setDisconnect(true);//显示网络已断开，请您检查
            that.isDisconnect = true;
            that.reconnect();
        });

        // 添加监听前台
        sdk.onEnterBackground["GamePDKScene"] = {
            obj : this,
            handler : this.onEnterBackground,
        };
        // 添加监听后台
        sdk.onEnterForeground["GamePDKScene"] = {
            obj : this,
            handler : this.onEnterForeground,
        };
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
    // 初始化玩家 304
    initPlayer () {
        // 初始化玩家
        this.players[0] = cc.find("player/center/me", this.node).getComponent("GamePDKPlayer");
        this.players[0].initPlayer(0, this);

        this.players[1] = cc.find("player/right/player", this.node).getComponent("GamePDKPlayer");
        this.players[1].initPlayer(1, this);

        this.players[2] = cc.find("player/left/player", this.node).getComponent("GamePDKPlayer");
        this.players[2].initPlayer(2, this);
    },
    // 添加事件监听，creator的事件系统真的不好用，跟以前相比，开倒车
    initEvent () {  //326
        this.players[0].onTouchCardEvent();//出牌监听
        // // 游戏开始动画
        this.event.on("actGameStart", this.actStartAnim, this);
        // // 开局动画播放完毕，玩家头像移动
        this.event.on("actStartAnimOver", this.actPlayerMove, this);
        // // 玩家头像移动完毕，显示玩家牌垛
        this.event.on("actPlayerMoveOver", this.actPlayerLeftCard, this);
        // // 显示玩家手牌完毕，开始掷骰子
        // this.event.on("actPlayerLeftCardOver", this.actDice, this);

        // // 显示玩家牌垛完毕，开始播放发牌动画
        this.event.on("actPlayerLeftCardOver", this.actFaPai, this);
        
        // // 发牌动画完成显示玩家手牌
        this.event.on("actFaPaiOver", this.actPlayerHandCard, this);

        //显示完玩家手牌，播放黑桃三谁先出的动画
        this.event.on("actPlayerHandCardOver", this.actFirstPlayer, this);

        // 播放动画完毕完毕，继续游戏
        this.event.on("actFirstPlayerOver", this.actGameGoing, this);
        // // 玩家手牌显示完毕，继续游戏，摸牌，显示吃碰杠提示
        // this.event.on("actPlayerHandCardOver", this.actGameGoing, this);

        // // 添加刷新玩家财富的事件监听
        this.event.on("refreshPlayerMoney", this.refreshPlayerMoney, this);

        // if (this.gameType && this.gameType.addEvent) {
        //     this.gameType.addEvent();
        // }
    },
    // 添加网络监听351
    initNetwork () {
        this.netlist = [
            {protocal : 2202, handler : this.onNetPlayerMating},            // 匹配
            {protocal : 2205, handler : this.onNetPlayerGoOn},              // 继续下一局
            {protocal : 2302, handler : this.onNetPlayerOffLineReconnect},  // 玩家断线重连（不在房间内）
            {protocal : 3002, handler : this.onNetPlayerEnter},             // 加入房间消息
            {protocal : 3003, handler : this.onNetPlayerExit},              // 离开房间消息
            {protocal : 3004, handler : this.onNetPlayerReady},             // 玩家准备消息
            {protocal : 3006, handler : this.onNetPlayerReconnect},         // 玩家断线重连（在房间内）
            
            {protocal : 3009, handler : this.onNetPlayerDismiss},           // 解散房间
            {protocal : 3013, handler : this.onNetPlayerMoney},             // 同步玩家财富
            {protocal : 3201, handler : this.onNetPlayerBackNotice},        // 强制返回提示
            {protocal : 5002, handler : this.onNetPlayerAuto},              // 托管

            {protocal : 4000, handler : this.onNetGameTurn},                // 轮流
            {protocal : 4002, handler : this.onNetGameOutCard},             // 出牌
            {protocal : 4003, handler : this.onNetGameTiShiOutCard},        // 提示出牌
            {protocal : 4200, handler : this.onNetGameStart},               // 初始发牌

            {protocal : 4008, handler : this.onNetGameResult},              // 小结算
            {protocal : 4009, handler : this.onNetGameEnding},              // 总结算
        ];
        
        this.unblockList[3009] = true;
        this.unblockList[3201] = true;
        this.unblockList[4008] = true;
        this.unblockList[4009] = true;

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
                if (that.blockStatus) {//有消息被锁着，锁住状态
                    // 动作阻塞
                    if (!that.unblockList[protocal]) {//如果下一条消息，是在非阻塞列表中，即使是锁着的状态，也要去执行else
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
    },
    // 每局开始前初始化  465
    initGame () {
        // 清理所有动作
        this.initAction();
        // 玩家
        if (gameData.kindId === config.KIND_MATE) {
            // 匹配刷新玩家
            // for (var i = 1; i < GamePDKConfig.PLAYER_MAX; i++) {
            //     this.players[i].setPlayerData();
            // }
            for (var i = 0; i < GamePDKConfig.PLAYER_MAX; i++) {
                this.players[i].initGame();
            }
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            // 好友不刷新玩家
            for (var i = 0; i < GamePDKConfig.PLAYER_MAX; i++) {
                this.players[i].initGame();
            }
            
        }
        // 结算界面
        this.setMateResultPop();
        this.setFriendResultPop();

        // 托管
        this.setAutoPop();

        //提示出牌按钮
        this.setOpsBtn(false,false);

        // 下一局
        cc.find("button/center/next", this.node).active = false;
        cc.find("action/center/errorTip", this.node).active = false;
        cc.find("action/center/baopeiTip", this.node).active = false;
    },
    // 设置流水按钮  598
    setRecordBtn (number) {//当前局数
        if (gameData.kindId === config.KIND_FRIEND) {
            // 好友显示
            cc.find("table/center/room_jushu_number1", this.node).getComponent(cc.Label).string = "" + ( number + 1 );
        }
    },
     // 设置邀请按钮611
    setInviteBtn (flag) {
        cc.find("button/center/invite", this.node).active = !!flag;
    },
     // 设置退出按钮
     setBackBtn (flag) {
        cc.find("button/left/back", this.node).active = !!flag;
    },
    setOpsBtn (flag,isChuPai){
        

        if(gameData.all_rule["rule_youdabichu"]){//强制
            cc.find("button/center/ops/btn_buchu", this.node).active = false;
            cc.find("button/center/ops/btn_buchu_hui", this.node).active = false;
            cc.find("button/center/ops/btn_tishi", this.node).x = -180;
            cc.find("button/center/ops/btn_chupai", this.node).x = 180;
            cc.find("button/center/ops/btn_chupai_hui", this.node).x = 180;
        }else{
            if(this.isBuchu == true){//显示灰色
                cc.find("button/center/ops/btn_buchu", this.node).active = false;
                cc.find("button/center/ops/btn_buchu_hui", this.node).active = true;
            }else{
                cc.find("button/center/ops/btn_buchu", this.node).active = true;
                cc.find("button/center/ops/btn_buchu_hui", this.node).active = false;
            }
            cc.find("button/center/ops/btn_tishi", this.node).x = 0;
            cc.find("button/center/ops/btn_chupai", this.node).x = 250;
            cc.find("button/center/ops/btn_chupai_hui", this.node).x = 250;
        }
        this.isShowOps = !!flag;
        cc.find("button/center/ops", this.node).active = !!flag;
        //出牌按钮
        cc.find("button/center/ops/btn_chupai_hui", this.node).active = !isChuPai;
        cc.find("button/center/ops/btn_chupai", this.node).active = !!isChuPai;
    },
    setOpsBuchu(buChu){
        this.isBuchu = buChu;
        if(gameData.all_rule["rule_youdabichu"]){
            cc.find("button/center/ops/btn_buchu", this.node).active = false;
            cc.find("button/center/ops/btn_buchu_hui", this.node).active = false;
        }else{
            cc.find("button/center/ops/btn_buchu", this.node).active = true;
            cc.find("button/center/ops/btn_buchu_hui", this.node).active = false;
            if(buChu == false){
                cc.find("button/center/ops/btn_buchu", this.node).active = true;
                cc.find("button/center/ops/btn_buchu_hui", this.node).active = false;
            }else if(buChu == true){//不可以不出
                cc.find("button/center/ops/btn_buchu", this.node).active = false;
                cc.find("button/center/ops/btn_buchu_hui", this.node).active = true;
            }
        }
    },
    getIsShowOps(){
        return  this.isShowOps;
    },
    // 移除事件监听 631
    removeEvent () {
        this.players[0].offTouchCardEvent();//出牌监听
        // 游戏开始动画
        this.event.off("actGameStart", this.actStartAnim, this);
        // 开局动画播放完毕，玩家头像移动
        this.event.off("actStartAnimOver", this.actPlayerMove, this);
        // // 玩家头像移动完毕，显示玩家牌垛
        this.event.off("actPlayerMoveOver", this.actPlayerLeftCard, this);
        // // 显示玩家手牌完毕，开始掷骰子
        // this.event.off("actPlayerLeftCardOver", this.actDice, this);

        // // 显示玩家牌垛完毕，开始播放发牌动画
        this.event.off("actPlayerLeftCardOver", this.actFaPai, this);


        // // 发牌动画完成显示玩家手牌
        this.event.off("actFaPaiOver", this.actPlayerHandCard, this);

        //显示完玩家手牌，播放黑桃三谁先出的动画
        this.event.off("actPlayerHandCardOver", this.actFirstPlayer, this);

        // 播放动画完毕完毕，继续游戏
        this.event.off("actFirstPlayerOver", this.actGameGoing, this);
        // this.event.off("actFirstPlayerOver",this.)

        // // 玩家手牌显示完毕，继续游戏，摸牌，显示吃碰杠提示
        // this.event.off("actPlayerHandCardOver", this.actGameGoing, this);

        // // 刷新玩家财富的事件监听
        this.event.off("refreshPlayerMoney", this.refreshPlayerMoney, this);


        // for (let i = 0; i < GameConfig.PLAYER_MAX; i++) {
        //     this.players[i].removeEvent();
        // }

        // if (this.gameType && this.gameType.removeEvent) {
        //     this.gameType.removeEvent();
        // }
    },
    // 功能函数
    // 轮到uid玩家  672
    takeTurn (uid,data,is_beat) {
    
        for (var i = 0; i < GamePDKConfig.PLAYER_MAX; i++) {
            this.players[i].current = false;
            this.players[i].setHideCountDown();//隐藏计时器
            this.players[i].setYaoBuQi(false);
        }
        if(data){
            var isYaodeqi = is_beat || false;//后端判断是否要的起
            
            if(data.updateScores.length > 0){//炸弹现结
                this.setZhaDanScore(data.updateScores)
            }
            if(uid){
                var index = this.pos[uid];
                if(index == 0 && isYaodeqi){//只有是自己并且是要的起
                    if(data.nextPaiNum == 1){//提示放走包赔
                        let errorTip = cc.find("action/center/baopeiTip", this.node);
                        if(errorTip.active){
                            this.scheduleOnce(function() {
                                errorTip.active = false;
                            }, 3);
                        }else{
                            errorTip.active = true;
                            this.scheduleOnce(function() {
                                errorTip.active = false;
                            }, 3);
                        }
                    }
                }
            }
        }
        
        
        if (uid) {
            var index = this.pos[uid];
            this.curPlayerIndex = index;
            util.log("mjf--跑得快uid == "+uid);
            util.log("mjf--跑得快index == "+index);

            this.countDown(index,data.left_sec, data.ts);//倒计时时间,位置，时间，时间戳
            var player = this.players[index];
            if (player) {
                if(isYaodeqi){
                    var enforce = false;//在大鱼中控制不出按钮显示不显示
                    util.log("11111data.validUid == "+data.validUid);
                    util.log("11111gameData.uid == "+gameData.uid);
                    if(data.validUid == gameData.uid){//先用
                        enforce = true;
                    }
                    if(index == 0){
                        
                        player.current = true;
                        // this.btn_chupai.setEnabled(false);
                        this.setOpsBtn(true,false);
                        player.checkUpPai();//检查是否有排站起来，如果有，设置出牌按钮是亮着的
                        if(data.curUid == gameData.uid){//相等则不出按钮变灰色
                            this.setOpsBuchu(true);
                        }else{
                            this.setOpsBuchu(false);
                        }
                    }
                    else{
                        this.setOpsBtn(false,false);
                    }
                    this.setYaoBuQi(index,false);
                }else{
                    this.scheduleOnce(function() {
                        this.setYaoBuQi(index,true);
                    }, 1);
                    
                }
            }
            
        }
        
    },
    //时间倒计时
    countDown(index,time,ts){
        var player = this.players[index];
        util.log("time00 == "+time);
        player.setCountDown(time,ts,this.timeDiff);
    },
    //要不起
    setYaoBuQi(index,isYaoDeQi){
        var player = this.players[index];
        player.setYaoBuQi(isYaoDeQi);
    },
    // 设置匹配场结算弹窗
    setMateResultPop (data) {
        if (data) {
            util.log("跑得快--显示匹配局小结算弹窗");
            if (!this.MateResultPop) {
                let that = this;
                util.loagGamePDKPrefab("PdkMateResultPop", function (perfab) {
                    if (!that.MateResultPop) {
                        let mateResultPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(mateResultPop, GamePDKConfig.POP_ZORDER["MateResultPop"]);
                        that.MateResultPop = mateResultPop.getComponent("PdkMateResultPop");
                        that.MateResultPop.setGame(that);
                        that.MateResultPop.refresh(data);

                        // sdk.uploadPlayerScore(that.startTime, gameData.gameBean);
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
    // 设置好友场结算弹窗 845
    setFriendResultPop (data) {
        if (data) {
            util.log("跑得快--显示好友局小结算弹窗 ");
            if (!this.PdkFriendResultPop) {
                let that = this;
                util.loagGamePDKPrefab("PdkFriendResultPop", function (perfab) {
                    if (!that.PdkFriendResultPop) {
                        let PdkFriendResultPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(PdkFriendResultPop, GamePDKConfig.POP_ZORDER["FriendResultPop"]);
                        that.PdkFriendResultPop = PdkFriendResultPop.getComponent("PdkFriendResultPop");
                        that.PdkFriendResultPop.setGame(that);
                        that.PdkFriendResultPop.refresh(data);
                    }
                    else {
                        that.PdkFriendResultPop.refresh(data);
                    }
                });
            }
            else {
                this.PdkFriendResultPop.refresh(data);
            }
        }
        else {
            if (this.PdkFriendResultPop) {
                this.PdkFriendResultPop.hide();
            }
        }
    },
    // 设置好友退出弹窗
    setFriendExitPop (flag) {
        if (flag) {
            if (!this.FriendExitPop) {
                let that = this;
                util.loagGamePDKPrefab("PdkFriendExitPop", function (perfab) {
                    if (!that.FriendExitPop) {
                        let friendExitPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(friendExitPop, GamePDKConfig.POP_ZORDER["FriendExitPop"]);
                        that.FriendExitPop = friendExitPop.getComponent("PdkFriendExitPop");
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
    // 设置好友解散弹窗 954
    setFriendDismissPop (data) {
        if (data) {
            if (!this.FriendDismissPop) {
                let that = this;
                util.loagGamePDKPrefab("PdkFriendDismissPop", function (perfab) {
                    if (!that.FriendDismissPop) {
                        let friendDismissPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(friendDismissPop, GamePDKConfig.POP_ZORDER["FriendDismissPop"]);
                        that.FriendDismissPop = friendDismissPop.getComponent("PdkFriendDismissPop");
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
    // 设置好友场大结算 874
    setFriendEndingPop () {
        if (this.endingData) {
            util.log("跑得快大结算数据");
            if (!this.PdkFriendEndingPop) {
                let that = this;
                util.loagGamePDKPrefab("PdkFriendEndingPop", function (perfab) {
                    if (!that.PdkFriendEndingPop) {
                        let PdkfriendEndingPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(PdkfriendEndingPop, GamePDKConfig.POP_ZORDER["FriendEndingPop"]);
                        that.PdkFriendEndingPop = PdkfriendEndingPop.getComponent("PdkFriendEndingPop");
                        that.PdkFriendEndingPop.setGame(that);
                        that.PdkFriendEndingPop.refresh(that.endingData);
                        that.endingData = null;
                    }
                    else {
                        that.PdkFriendEndingPop.refresh(that.endingData);
                        that.endingData = null;
                    }
                });
            }
            else {
                this.PdkFriendEndingPop.refresh(this.endingData, this);
                this.endingData = null;
            }
        }
    },
    // 设置匹配退出弹窗 982
    setMateExitPop (flag) {
        if (flag) {
            if (!this.MateExitPop) {
                let that = this;
                util.loadGamePrefab("MateExitPop", function (perfab) {
                    if (!that.MateExitPop) {
                        let mateExitPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(mateExitPop, GamePDKConfig.POP_ZORDER["MateExitPop"]);
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
    // 设置自己的托管弹窗   1010
    setAutoPop (flag) {
        if (flag) {
            if (!this.AutoPop) {
                let that = this;
                util.loagGamePDKPrefab("PdkAutoPop", function (perfab) {
                    if (!that.AutoPop) {
                        let autoPop = cc.instantiate(perfab);
                        cc.find("pop/center", that.node).addChild(autoPop, GamePDKConfig.POP_ZORDER["AutoPop"]);
                        that.AutoPop = autoPop.getComponent("PdkAutoPop");
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
    // 设置炸弹现结
    setZhaDanScore (data) {
        if (!data) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            let uid = data[i].uid;
            let score = data[i].score;
            var player = this.players[this.pos[uid]];
            if (player) {
                player.setZhaDanScore(score);
            }
        }
    },
    // 设置匹配中1044
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
    // 设置断线重连中 1075
    setReconnecting (flag) {
        util.log("mjf-- 跑得快设置断线重连 ");
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
    // 返回大厅 1089
    backToHall () {
        util.log("返回大厅");
        cc.audioEngine.stopAll();
        // 清理监听
        network.setOnDisconnectListener();
        // 清理监听后台
        // sdk.onEnterBackground["GamePDKScene"] = null;
        // sdk.onEnterForeground["GamePDKScene"] = null;
        network.send(2002);
        // for (var i = 0; i < GameConfig.OP_SP_NUMBER; i++) {
        //     cc.find("button/right/op_bg/hand_bg/op_"+i+"/halo", this.node).getComponent(cc.Animation).stop("halo");
        // }
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
                firstchu : data.firstchu,
                qiangzhi : data.qiangzhi

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
                    util.error("玩家"+uid+"不在当前牌桌6 "+JSON.stringify(this.pos));
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
                firstchu : data.firstchu,
                qiangzhi : data.qiangzhi
            };
            this.onNetPlayerEnter(info);
            // 头像移动
            for (var i = 0; i < this.players.length; i++) {
                var player = this.players[i];
                player.actPlayerMove();
            }
        }

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
                    util.error("玩家"+uid+"不在当前牌桌1 "+JSON.stringify(this.pos));
                }
            }
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
            // 手牌
            player.setHandCard(info.pai_arr, info.cur_pai_num, info.lastmopaiid);
            player.updateHandCard(info.pai_arr, info.cur_pai_num, GamePDKConfig.HAND_MAX-info.cur_pai_num);
            // 牌堆
            player.setTableCard(data.chu_pai_arr);
            player.setShengyuPaiNum(true,info.cur_pai_num);

            // 下跑
            // player.setXiaPaoScore(info.paocnt);
        }
        // 剩余牌数
        // this.setLeftCard(data.left_pai_num);
        // 当前局数
        this.setRecordBtn(data.cur_round);
        var  is_beat = false;
        for (let i = 0; i < data.players.length; i++) {
            let uid = data.player_pai[i].uid;
            if(uid == data.turn_uid){
                is_beat = data.player_pai[i].is_beat;
            }
        }
        // 轮流
        this.takeTurn(data.turn_uid,data,is_beat);
        // 倒计时
        // this.setTimer(data.left_sec, data.ts);

        cc.find("action/center/errorTip", this.node).active = false;
        cc.find("action/center/baopeiTip", this.node).active = false;

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
    // 按钮回调1325
    // 返回
    onBtnBack (event, custom) {
        util.log("点击返回按钮");
        audioUtils.playCloseSoundEffect();

        if (gameData.kindId === config.KIND_MATE) {
            // 匹配
            if (this.gameStatus === GamePDKConfig.STATUS_MATCHING) {
                // 正在匹配，退出游戏服
                util.log("正在匹配  --  this.gameStatus  == "+this.gameStatus);
                network.send(3009, {room_id: gameData.roomId, is_accept : 1});//先加一个退出房间
                this.backToHall();
            }
            else if (this.gameStatus === GamePDKConfig.STATUS_GOING) {
                // 已开始，未结束，托管
                this.setMateExitPop(true);
            }
            else if (this.gameStatus === GamePDKConfig.STATUS_ENDING) {
                // 已结束，退出游戏服
                this.backToHall();
            }
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            // 好友
            if (this.gameStatus === GamePDKConfig.STATUS_WAITING) {
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
            else if (this.gameStatus === GamePDKConfig.STATUS_GOING) {
                // 已开始，未结束，解散
                this.setFriendExitPop(true);
            }
            else if (this.gameStatus === GamePDKConfig.STATUS_ENDING) {
                // 已结束，解散
                this.setFriendExitPop(true);
            }
        }
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
    // 准备1487
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
    //出牌
    onBtnChuPai(){
        var player = this.players[this.curPlayerIndex];
        var chuPaiValueArr = player.getUpPaiValueArr().value;
        var chuPaiIdxArr = player.getUpPaiValueArr().idx;
        this.sendGameOutCard(chuPaiIdxArr,chuPaiValueArr);
    },
    //不出
    onBtnBuChu(){
        this.setOpsBtn(false,false);
        // this.setYaoBuQi(0,true);
        network.send(4002, {room_id: gameData.roomId, cards: [], idx: []});//idx牌的下标数组
    },
    //提示
    onBtnTiShi(){
        network.send(4003, {room_id: gameData.roomId});
    },
    // 玩家匹配1605
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
                var nowSelLevel = gameData.mateLevel;
                if(nowSelLevel>3){
                    nowSelLevel -= 3;
                }
                //领取救济金提示
                util.tip4({
                    node : this.node,
                    type : 1,
                    string : content,
                    level : nowSelLevel,
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
            else if (alms.hintCode === 3) {
                // 充值提示
                var nowSelLevel = gameData.mateLevel;
                if(nowSelLevel>3){
                    nowSelLevel -= 3;
                }
                util.tip4({
                    node : this.node,
                    type : 2,
                    string : decodeURIComponent(alms.hintContent),
                    level : nowSelLevel,
                    num : alms.award,
                    leftCallback : null,
                    centerCallback : null,
                    rightCallback : null,
                });
            }
        }
    },
    // 玩家进入房间  1621
    onNetPlayerEnter (data) {
        if (!data) {
            return;
        }

        gameData.appId = data.app_id;//麻将还是扑克
        gameData.mapId = data.mapid || data.mapId;//玩法ID
        gameData.kindId = data.gameKind;//类型
        gameData.roomId = data.room_id;//房间号
        gameData.all_rule["rule_youdabichu"] = data.qiangzhi;
        gameData.all_rule["rule_shouchuxuanze"] = data.firstchu;
        gameData.all_rule["rule_xiajuxianchu"] = data.nextfirstchu;
        gameData.rule_jushu = data.totalRound;
        
        this.curPlayerNum = data.playerNum;//当前人数
        this.ownerUid = data.owner;

        // 查询自己在后端下标与前端下标0的偏移
        var offset = 0;
        for (var i = 0; i < data.max_player_cnt; i++) {
            if (data.players[i] && data.players[i].uid === gameData.uid) {
                // 当前玩家
                offset = i;
                break;
            }
        }
        util.log("mjf-- 跑得快offset == "+offset);
        this.pos = {};//玩家UID对应显示下标

        let actionFlag = false;
        if (gameData.kindId === config.KIND_MATE) {
            // 匹配场只处理一个玩家和玩家全部进入的情况，其他情况，不处理
            if (data.players.length === 1) {
                // 只有自己，正常处理
                actionFlag = false;
            }
            else if (data.max_player_cnt === this.curPlayerNum) {
                // // 延迟动作
                // actionFlag = true;
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
                this.gameStatus = GamePDKConfig.STATUS_MATCHING;
            }
        }
        // 断线重连
        if (this.isReconnect) {
            actionFlag = false;
        }
        
        if (actionFlag) {
            util.log("--------玩家延迟进入房间");
            // 匹配而且玩家满了
            // 跑得快先不做匹配
            if(this.curPlayerNum == data.max_player_cnt){
                this.gameStatus = GamePDKConfig.STATUS_GOING;
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
                        // this.setTurn(offset, data.max_player_cnt);
                        this.unblock(5);
                    }, this)
                )
            );
        }else{
            // 设置玩家数据，记录uid对应前端下标
            util.log("--------玩家进入房间");
            for (var i = 0; i < data.max_player_cnt; i++) {
                let index = (i - offset + data.max_player_cnt) % data.max_player_cnt;
                let player = this.players[index];
                util.log("mjf-- 跑得快 index =  "+index);
                if (data.players[i]) {
                    // 该位置有玩家
                    player.setPlayerData(data.players[i]);
                    player.refreshInfoUI();
                    this.pos[data.players[i].uid] = index;
                    // 直接显示
                    player.infoNode.active = true;//玩家信息节点
                }
                else {
                    // 该位置没有玩家
                    player.infoNode.active = false;
                }
            }
            // this.setTurn(offset, data.max_player_cnt);
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
                util.error("玩家"+data.owner+"不在当前牌桌2 "+JSON.stringify(this.pos));
            }
        }
        // 没有玩家的位置设置active，三人场之外的人
        for (var i = data.max_player_cnt; i < GamePDKConfig.PLAYER_MAX; i++) {
            this.players[i].active = false;
        }
        
    },
    // 玩家离开房间 1788
    onNetPlayerExit (data) {
        //两个人匹配到一起，一个人先点了下一局，然后另一个人点换桌后收到3003 ，此时不处理
        if(data.kickouted){//不该退出房间，因为其他原因被退出房间
            return;
        }
        // util.log("--------玩家"+this.pos[data.uid]+"离开房间");
        util.log("--------玩家"+data.uid+"离开房间");
        util.log("--------玩家1"+gameData.uid+"离开房间");
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
        }else {
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
            util.error("玩家"+data.uid+"不在当前牌桌3 "+JSON.stringify(this.pos));
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
        gameData.all_rule["rule_shouchuxuanze"] = data.firstchu;
        gameData.all_rule["rule_youdabichu"] = data.qiangzhi;
        gameData.all_rule["rule_xiajuxianchu"] = data.nextfirstchu;
        gameData.rule_jushu = data.totalRound;

        if (data.room_status === 0) {
            // 未开始
            if (gameData.kindId === KIND_MATE) {
                // 匹配
                this.gameStatus = GamePDKConfig.STATUS_MATCHING;
                this.reconnectMating(data);
            }
            else if (gameData.kindId === KIND_FRIEND) {
                // 好友
                this.gameStatus = GamePDKConfig.STATUS_WAITING;
                this.reconnectWaiting(data);
            }
        }
        else if (data.room_status === 1) {
            // 进行
            this.gameStatus = GamePDKConfig.STATUS_GOING;
            this.reconnectGaming(data);
        }
        else if (data.room_status === 2) {
            // 结束
            util.log("mjf--断线重连结束状态");
            this.gameStatus = GamePDKConfig.STATUS_ENDING;
            this.reconnectEnding(data);
        }


        this.isReconnect = false;
        // // this.curOp;
        // // this.opCardValue;
    },
    onNetPlayerOffLineReconnect (data) {
        util.log("mjf--断线重连后是否在房间中");
        this.isInRoom = data.isInroom;
        if(!data.isInroom){
            util.log("mjf--  断线重连后不在房间内，返回大厅");
            this.backToHall();
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
    // 游戏开始，发牌 1966
    onNetGameStart (data) {
        util.log("--------跑得快游戏开始，发牌");
        if (!data) {
            return;
        }
        this.block(6);

        // // 游戏状态
        this.gameStatus = GamePDKConfig.STATUS_GOING;
        // // 隐藏邀请按钮
        this.setInviteBtn(false);
        //游戏开始隐藏退出按钮
        if (gameData.kindId === config.KIND_MATE){//匹配
            this.setBackBtn(false);
        }

        // 隐藏玩家已准备
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].setReady(false);
        }
        // // 当前局数
        this.setRecordBtn(data.cur_round);
        // // 剩余局数
        // data.left_round;
        // // 游戏开始
        this.event.emit("actGameStart", {data : data});
    },
    // 轮到1989
    onNetGameTurn (data) {
        util.log("--------跑得快轮到玩家"+this.pos[data.turn_uid]);

        this.takeTurn(data.turn_uid,data,data.is_beat);
        // // 倒计时
        // this.setTimer(data.left_sec, data.ts);
    },
    // 出牌
    onNetGameOutCard (data) {
        if(data.isBuChu){//点击不出按钮，服务器广播
            var index = this.pos[data.uid];
            var player = this.players[index];
            if(player){
                // this.scheduleOnce(function() {
                    this.setYaoBuQi(index,true);
                // }, 1);
                return;
            }
        }

        if(data.can_chu_pai){
            
            this.setOpsBtn(false,false);//出完牌隐藏OPS
            util.log("--------玩家"+this.pos[data.uid]+"出牌 "+data.pai_id);
            var index = this.pos[data.uid];
            var player = this.players[index];
            //剩余牌数
            var left_pai_cnt = data.left_pai_cnt;

            if (player) {
                if(left_pai_cnt == 1){//单张警告
                    util.log("单张警告1111111111  += "+ index);
                    player.playJingGaoAnim(true);
                }
                let that = this;
                if(data.pai_type){//出牌的类型
                    this.actPaiTypeAnim(data.pai_type);//播放特效以及特效本身的音效
                }
                player.OutCard(data.pai_arr, data.idx_arr,data.pai_type,data.pai_num, function () {
                    util.log("----玩家"+that.pos[data.uid]+"出牌 "+data.pai_id+" 回调");
                    player.updateHandCard(data.pai_arr_left, data.left_pai_cnt || data.pai_arr_left.length,data.pai_arr.length);
                });
            }
            else {
                util.error("玩家"+data.uid+"不在当前牌桌4 "+JSON.stringify(this.pos));
            }
        }else{
            this.setOpsBtn(true,false);//出完牌隐藏OPS
            let errorTip = cc.find("action/center/errorTip", this.node);
            if(errorTip.active){
                this.scheduleOnce(function() {
                    errorTip.active = false;
                }, 3);
            }else{
                errorTip.active = true;
                this.scheduleOnce(function() {
                    errorTip.active = false;
                }, 3);
            }
            
            util.log("不能出牌");
        }
        
    },
    //提示出牌
    onNetGameTiShiOutCard(data){
        //让所有手牌下来
        this.players[0].setAllHandCardDownPos();
        //让提示的牌站起来
        this.players[0].setUpPaiByPaiArr(data.pai_arr);

        // var index = this.pos[data.uid];
        // var player = this.players[index];
        // if (player) {
        //     let that = this;
        //     player.OutCard(data.pai_arr, data.idx_arr, function () {
        //         util.log("----玩家"+that.pos[data.uid]+"出牌 "+data.pai_id+" 回调");
        //         player.updateHandCard(data.pai_arr_left, data.left_pai_cnt || data.pai_arr_left.length,data.pai_arr.length);
        //     });
        // }
        // else {
        //     util.error("玩家"+data.uid+"不在当前牌桌4 "+JSON.stringify(this.pos));
        // }
    },
    removeAllTableCard(){
        for (var i = 0; i < GamePDKConfig.PLAYER_MAX; i++) {
            this.players[i].removeTableCard();
        }
    },
    // 单局结算 2197
    onNetGameResult (data) {
        util.log("--------单局结算");
        // 设置游戏状态
        this.gameStatus = GamePDKConfig.STATUS_ENDING;
        // 解散特殊处理，解散未开始房间，不显示小结算，直接显示大结算
        // if (data.hu_type === 3) {
        //     // 解散
        //     if (!data.curRoundStatus) {
        //         // 本局未开始
        //         util.log("--------本局未开始 显示大结算");
        //         // this.dismissFlag = true;
        //         return;
        //     }
        // }
        // 解散房间需要停止动作
        // if (data.hu_type === 3) {
            // this.initAction();
        // }
        // // 隐藏计时器 不传uid
        this.takeTurn();
        
        // // 倒计时  //扑克中是每个人的倒计时，先不设置
        // this.setTimer();
        // // 隐藏听牌提示
        // this.setTingPop();
        // // 隐藏自动胡牌按钮
        // cc.find("button/right/auto_hupai", this.node).active = false;
        // 设置结算牌显示 自己的不用显示 从1开始
        var isQuanGuan = false;
        for (let i = 0; i < data.players.length; i++) {
            let playerData = data.players[i];
            let index = this.pos[playerData.uid];
            this.players[i].playJingGaoAnim(false);
            this.players[index].setResultCard(playerData.pai_arr, playerData.pai_arr.length);
            if(playerData.pai_arr.length == GamePDKConfig.HAND_MAX){
                isQuanGuan = true;//只要有全关就播放，大锁
                //谁的手牌是16张就播放小锁头像
                this.players[index].playXiaoSuoAnim(true);
            }
        }
        if(isQuanGuan && data.isJieSan == false){
            let paiType = cc.find("action/center/paiType", this.node);
            audioUtils.playSFX("resources/sound/PdkGame/effect/cage.mp3");
            let anim = paiType.getChildByName("dasuoAnim");
            util.loadGameAnim("pdkGame/anim/dasuo", function (data) {
                anim.active = true; 
                anim.scaleX = 3;
                anim.scaleY = 3;
                anim.getComponent(cc.Animation).addClip(data);
                anim.getComponent(cc.Animation).play("dasuo");
            });
            
            // anim.getComponent(cc.Animation).play("dasuo");

            this.scheduleOnce(function() {
                paiType.active = false;
                anim.getComponent(cc.Animation).stop("dasuo");
                anim.active = false;
            }, 1);
            this.scheduleOnce(function() {
                this.action.runAction(
                    cc.sequence(
                        cc.delayTime(0.8),
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
                        }, this)
                    )
                );
            }, 1.3);
        }else{
            this.action.runAction(
                cc.sequence(
                    cc.delayTime(0.8),
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
                    }, this)
                )
            );
        }
    },
    // 总结算2274
    onNetGameEnding (data) {
        util.log("--------总结算");
        // if (!data) {
        //     return;
        // }

        this.endingData = data;

        // if (this.dismissFlag) {
        //     // 解散房间直接显示大结算
        //     this.setFriendEndingPop();
        // }
    },
    // 托管2288
    onNetPlayerAuto (data) {
        util.log("--------玩家托管 "+data.tuoguan[gameData.uid]);
        // 关闭听牌提示
        // this.setTingPop();
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
    // 发送消息
    // 发送出牌消息
    sendGameOutCard (index, value) {//都是数组
        util.log("--------发送出牌消息 value="+value);
        // 出牌
        network.send(4002, {room_id: gameData.roomId, cards: value, idx: index});//idx牌的下标数组
    },
    // 发送托管消息
    sendPlayerAuto (flag) {
        util.log("--------发送托管消息 flag="+flag);
        network.send(5002, {tuoguan : !!flag, room_id : gameData.roomId});
    },
    // 发送解散消息 2337
    sendPlayerDismiss () {
        util.log("--------发送解散消息");
        network.send(3009, {room_id: gameData.roomId, is_accept : 1});
    },
    // 发送准备消息2342
    sendPlayerReady (flag) {
        util.log("--------发送准备消息");
        network.send(3004, {room_id: gameData.roomId, uid : gameData.uid});
    },
    // 切换到后台回调 2301
    onEnterBackground () {
        util.log("mjf-- 跑得快切换到后台");
        // // 停止播放音效
        // this.bgmVolume = audioUtils.bgmVolume;
        // this.sfxVolume = audioUtils.sfxVolume;
        // gameData.musicStatus = 1;
        // audioUtils.setChangeBgm(0);
        // audioUtils.setSFXVolume(0);
        // gameData.musicStatus = 2;
    },
    // 切换到前台回调 2312
    onEnterForeground () {
        util.log("mjf-- 跑得快切换到前台");

        // // gameData.musicStatus = 2;//gameData.musicStatus 1 是开 2 是关
        // // audioUtils.setChangeBgm(1);
        // // gameData.musicStatus = 1;
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
        // //音效
        // var EffectValue = util.getLocalValue('soundEffectStatus');
        // if(EffectValue && EffectValue == 2){
        //     util.log("游戏界面--切换前台-EffectValue == 0");
        //     audioUtils.setSFXVolume(0);
        // }
        // else if(EffectValue && EffectValue == 1){
        //     util.log("游戏界面--切换前台-EffectValue == 1");
        //     audioUtils.setSFXVolume(1);
        // }
        // else{
        //     util.log("游戏界面--切换前台-没有记录，默认播放");
        //     audioUtils.setSFXVolume(1);
        // }
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
    //播放炸弹、三带二等特效
    actPaiTypeAnim(type){
        //5 是三顺  （就是飞机不带翅膀）
        //8 是 三带1 
        //9 是 三带2  
        // 10 是 四带两个单
        // 11 是 四带一对
        // 12 是 四带两对
        // 13 是 对王
        // 14 是 四张连
        // 14 是 四张连
        // 14 是 四张连
        // 17 是 三不带
        let paiType = cc.find("action/center/paiType", this.node);
        let name = cc.find("action/center/paiType/type", this.node);
        paiType.active = true;
        if(type == 1){//炸弹
            audioUtils.playSFX("resources/sound/PdkGame/effect/bomb.mp3");
            let anim = paiType.getChildByName("zhadanAnim");
            util.loadGameAnim("pdkGame/anim/zhadan", function (data) {
                anim.active = true; 
                anim.scaleX = 2;
                anim.scaleY = 2;
                anim.getComponent(cc.Animation).addClip(data);
                anim.getComponent(cc.Animation).play("zhadan");
            });
            // anim.active = true; 
            // anim.scaleX = 2;
            // anim.scaleY = 2;
            // anim.getComponent(cc.Animation).play("zhadan");

            // paiType.stopAllActions();
            // paiType.runAction(
            //     cc.sequence(
            //         cc.delayTime(1.3), 
            //         cc.callFunc(function () {
            //             paiType.active = false;
            //             anim.getComponent(cc.Animation).stop("zhadan");
            //             anim.active = false;
            //         }, this)
            //     )
            // );
            this.scheduleOnce(function() {
                paiType.active = false;
                anim.getComponent(cc.Animation).stop("zhadan");
                anim.active = false;
            }, 1.3);
        }else if(type == 2){//顺子
            audioUtils.playSFX("resources/sound/PdkGame/effect/shunzi.mp3");
            let anim = paiType.getChildByName("shunziAnim");
            anim.active = true; 
            anim.scaleX = 1.5;
            anim.scaleY = 1.5;
            anim.getComponent(cc.Animation).play("shunzi");

            // paiType.stopAllActions();
            // paiType.runAction(
            //     cc.sequence(
            //         cc.delayTime(1), 
            //         cc.callFunc(function () {
            //             paiType.active = false;
            //             anim.getComponent(cc.Animation).stop("shunzi");
            //             anim.active = false;
            //         }, this)
            //     )
            // );
            this.scheduleOnce(function() {
                paiType.active = false;
                anim.getComponent(cc.Animation).stop("shunzi");
                anim.active = false;
            }, 1);
        }else if(type == 3 || type == 4){// 3  4  都是连队  
            audioUtils.playSFX("resources/sound/PdkGame/effect/liandui.mp3");
            let anim = paiType.getChildByName("lianduiAnim");

            util.loadGameAnim("pdkGame/anim/liandui", function (data) {
                anim.active = true; 
                anim.scaleX = 2;
                anim.scaleY = 2;
                anim.getComponent(cc.Animation).addClip(data);
                anim.getComponent(cc.Animation).play("liandui");
            });
            // anim.active = true; 
            // anim.scaleX = 2;
            // anim.scaleY = 2;
            // anim.getComponent(cc.Animation).play("liandui");

            // paiType.stopAllActions();
            // paiType.runAction(
            //     cc.sequence(
            //         cc.delayTime(1), 
            //         cc.callFunc(function () {
            //             paiType.active = false;
            //             anim.getComponent(cc.Animation).stop("liandui");
            //             anim.active = false;
            //         }, this)
            //     )
            // );
            this.scheduleOnce(function() {
                paiType.active = false;
                anim.getComponent(cc.Animation).stop("liandui");
                anim.active = false;
            }, 1);
        }
        else if(type == 6 || type == 7){//  6 是飞机带单排 7 飞机带对子
            audioUtils.playSFX("resources/sound/PdkGame/effect/feiji.mp3");
            let anim = paiType.getChildByName("feijiAnim");
            anim.active = true; 
            anim.scaleX = 2;
            anim.scaleY = 2;
            anim.getComponent(cc.Animation).play("feiji");

            // paiType.stopAllActions();
            // paiType.runAction(
            //     cc.sequence(
            //         cc.delayTime(1), 
            //         cc.callFunc(function () {
            //             paiType.active = false;
            //             anim.getComponent(cc.Animation).stop("feiji");
            //             anim.active = false;
            //         }, this)
            //     )
            // );
            this.scheduleOnce(function() {
                paiType.active = false;
                anim.getComponent(cc.Animation).stop("feiji");
                anim.active = false;
            }, 1);
        }
        else if(type == 8 || type == 9 || type == 5 || type == 17 || type == 10 || type == 12){
            if(type == 12){
                type = 10;
            }
            audioUtils.playSFX("resources/sound/PdkGame/effect/starShine.mp3");
            util.loadSprite("pdkGame/paiType/paiType_"+type, name);

            let anim = paiType.getChildByName("xingguang");
            name.x = -gameData.canvasWidth/2-200;
            
            name.active = true;
            name.opacity = 1;
            name.scaleX = 2;
            name.scaleY = 2;
            name.runAction(
                cc.sequence(
                    cc.fadeTo(0.4, config.maxOpacity),
                    cc.moveTo(0.4, 0, 0),
                    cc.callFunc(function () {
                        util.loadGameAnim("pdkGame/anim/xingguang", function (data) {
                            anim.active = true; 
                            anim.scaleX = 2;
                            anim.scaleY = 2;
                            anim.getComponent(cc.Animation).addClip(data);
                            anim.getComponent(cc.Animation).play("xingguang");
                        });

                        // anim.scaleX = 2;
                        // anim.scaleY = 2;
                        // anim.active = true; 
                        // anim.getComponent(cc.Animation).play("xingguang");
                    }, this),
                    cc.delayTime(2),
                    cc.callFunc(function () {
                        paiType.active = false;
                        util.loadGameAnim("pdkGame/anim/xingguang", function (data) {
                             
                            // anim.scaleX = 2;
                            // anim.scaleY = 2;
                            anim.getComponent(cc.Animation).addClip(data);
                            anim.getComponent(cc.Animation).stop("xingguang");
                            anim.active = false;
                        });
                        // anim.getComponent(cc.Animation).stop("xingguang");
                        // anim.active = false;
                        name.x = -605;
                        name.active = false;
                    }, this)

                )
            );
        }
    },
    // 开局动画2388
    actStartAnim (event) {
        util.log("----播放开局动画");

        // audioUtils.playSFX("resources/sound/game/effect/start.mp3");

        let data = event.detail.data;
        // 显示本场消耗
        let consume = cc.find("table/right/consume_bg", this.node);
        if (data.roomprice && data.roomprice !== 0) {
            util.log("gameData.mateLevel   ==  "+gameData.mateLevel );
            var level = gameData.mateLevel;
            if(gameData.mateLevel>3){
                level = gameData.mateLevel-3;
            }
            
            if(level == 3){//高级场
                consume.getChildByName("consume").getComponent(cc.Label).string = "赢家将付本场门票";
            }else{
                consume.getChildByName("consume").getComponent(cc.Label).string = "本场门票消耗 "+data.roomprice+" 金豆";
            }
            consume.active = true;
        }
        else {
            consume.active = false;
        }
        this.scheduleOnce(function() {
            consume.active = false;
        }, 1.5);
        this.event.emit("actStartAnimOver", {data : data});    
        // let start = cc.find("action/center/start", this.node);

        // let anim = start.getChildByName("anim");
        // anim.active = true;
        // anim.getComponent(cc.Animation).play("anim");

        // let sp = start.getChildByName("sp");
        // sp.opacity = 0;
        // sp.active = true;
        // sp.stopAllActions();
        // sp.runAction(
        //     cc.sequence(
        //         cc.fadeTo(0.7, config.maxOpacity),
        //         cc.delayTime(0.5),
                // cc.callFunc(function () {
                //     sp.active = false;
                //     anim.getComponent(cc.Animation).stop("anim");
                //     anim.active = false;
                //     consume.active = false;
                //     this.event.emit("actStartAnimOver", {data : data});             
                // }, this)
        //     )
        // );

        // start.active = true;
    },
    // 玩家头像散开2430
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
        util.log("----跑得快播放显示玩家牌垛动画");
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
        // todo设置剩余牌数//先不弄
        // this.setLeftCard(data.totalPaisCnt);
    },
    // 发牌
    actFaPai (event) {
        util.log("----跑得快播放发牌动画");
        var data = event.detail.data;
        {
            // 玩家需要加回调
            var player = this.players[0];
            var that = this;
            player.actFaPai(function () {
                that.event.emit("actFaPaiOver", {data : data});
            });
        }
        for (var i = 1; i < this.players.length; i++) {
            var player = this.players[i];
            player.actFaPai();
        }
        
    },
    // 玩家显示手牌2540
    actPlayerHandCard (event) {
        util.log("----跑得快播放玩家显示手牌动画");
        var data = event.detail.data;
        var that = this;
        {
            var player = this.players[0];
            player.actShowHandCard(function (target) {
                // util.log("----播放玩家0显示手牌动画回调");
                target.setHandCard(data.paiArr, data.paiArr.length);
                // target.setExtraCard(false);
                // // 设置剩余牌，总牌数，减去手牌
                // that.setLeftCard(data.totalPaisCnt - that.curPlayerNum*13);
                util.log("cur_round --  == "+data.cur_round);
                if(data.cur_round == 0){//第一局播放黑桃三动画
                    that.event.emit("actPlayerHandCardOver", {data : data});
                }else{
                    util.log("rule_xiajuxianchu   ==  "+gameData.all_rule["rule_xiajuxianchu"]);
                    if(gameData.all_rule["rule_xiajuxianchu"] == 1){//3先出
                        that.event.emit("actPlayerHandCardOver", {data : data});
                    }else if(gameData.all_rule["rule_xiajuxianchu"] == 2){//赢家先出
                        that.event.emit("actFirstPlayerOver", {data : data});
                    }else{
                        that.event.emit("actPlayerHandCardOver", {data : data});
                    }
                }
                
                
            });
        }
        for (var i = 1; i < this.players.length; i++) {
            var player = this.players[i];
            player.setShengyuPaiNum(true,GamePDKConfig.HAND_MAX);
        }
        // for (var i = 1; i < this.players.length; i++) {
        //     var player = this.players[i];
        //     player.actShowHandCard(function (target) {
        //         util.log("----播放玩家显示手牌动画回调");
        //         target.setHandCard(data.paiArr, data.paiArr.length);
        //         target.setExtraCard(false);
        //     });
        // }
    },
    //播放黑桃三动画
    actFirstPlayer (event){
        util.log("----跑得快播放黑桃三谁先出牌动画");
        // audioUtils.playSFX("resources/sound/game/effect/zhuang.mp3");
        
        var data = event.detail.data;
        var uid = data.zhuang_uid;
        // 设置庄家
        var mainZhuang = cc.find("action/center/main_zhuang", this.node);
        
        util.loadSprite("pdkGame/firstchu_"+gameData.all_rule["rule_shouchuxuanze"], mainZhuang, function (node) {
            // node.active = true;
        });
        mainZhuang.stopAllActions();
        mainZhuang.x = 0;
        mainZhuang.y = 0;
        mainZhuang.scaleX = 1;
        mainZhuang.scaleY = 1;
        mainZhuang.active = true;
        mainZhuang.opacity = 1;

        var player = this.players[this.pos[uid]];
        if (player) {
            var dest = player.infoNode.getChildByName("zhuang").convertToWorldSpaceAR(cc.p(0, 0));
            dest = cc.find("action/center", this.node).convertToNodeSpaceAR(dest);
            mainZhuang.runAction(
                cc.sequence(
                    cc.delayTime(2.5),
                    cc.spawn(
                        cc.fadeTo(0.2, config.maxOpacity),
                        cc.scaleTo(0.2, 1, 1),
                    ),
                    cc.scaleTo(0.4, 1.3, 1.3),
                    cc.scaleTo(0.4, 1, 1),
                    cc.scaleTo(0.4, 1.3, 1.3),
                    cc.scaleTo(0.4, 1, 1),
                    cc.spawn(
                        cc.fadeOut(0.6, 0),
                        cc.moveTo(0.6, dest.x, dest.y),
                    ),
                    cc.callFunc(function(){
                        mainZhuang.active = false;
                    }),
                    cc.callFunc(function () {
                        // player.setZhuang(true);
                        this.event.emit("actFirstPlayerOver", {data : data});
                    }, this),
                    // cc.hide()
                )
            );
        }
        else {
            util.error("玩家"+uid+"不在当前牌桌5 "+JSON.stringify(this.pos));
            this.event.emit("actFirstPlayerOver", {data : data});
        }
    },
    // 动作结束，继续游戏
    actGameGoing (event) {
        util.log("----跑得快动作结束，继续游戏");
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
        for (let i = 0; i < GamePDKConfig.PLAYER_MAX; i++) {
            this.players[i].refreshMoney();
        }
    },
    // 停止所有动作
    initAction () {
        util.log("----停止动作");
        {
            // actZhuang
            var mainZhuang = cc.find("action/center/main_zhuang", this.node);
            mainZhuang.stopAllActions();
            mainZhuang.active = false;
        }
        this.action.stopAllActions();
        for (let i = 0; i < GamePDKConfig.PLAYER_MAX; i++) {
            this.players[i].initAction();
            this.players[i].node.stopAllActions();
        }
    },
    // update (dt) {},
});
