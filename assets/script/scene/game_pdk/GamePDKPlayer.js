// 游戏玩家类，挂载在每个玩家节点上，创建所有牌

var GamePDKConfig = require("GamePDKConfig");
var GamePDKRule = require("GamePDKRule");

const STANDUP = 1;
const SITDOWN = 2;
cc.Class({
    extends: cc.Component,

    properties: {
        // 显示位置，自己位置为0，逆时针递增
    	index : null,
        // 玩家数据
        info : null,
        
        // 牌垛
        // 牌垛起始位置
        leftX : null,
        leftY : null,
        
        // 手牌
        // 是否已经创建手牌
        handInit : null,
        // 手牌位置
        handPos : [],
        // 手牌值
        handValue : [],
        // 手牌状态，0表示下面，1表示选中
        handStatus : [],
        handNowNum : 0,//现在的手牌数量
        handUpCard : [],//站起来的手牌idx
        handUpCardNum : 0,//站起来的手牌数量
        handUpValue : [],//发送给服务器的出牌牌值数组

        // 出牌
        // 出牌位置
        outX : null,
        outY : null,

        // 牌堆
        // 牌堆起始位置
        tableX : null,
        tableY : null,
        // 牌堆数量
        // tableNumber : null,

        // 托管状态
        auto : null,

        // UI
    	// 玩家信息容器
        infoNode : null,
        // 玩家牌容器
        cardNode : null,
        // 游戏组件
        game : null,

        //拖拽出牌
        //刚开始触摸时的touch位置(用以计算拖拽距离)
        touchStartPoint : null,
        //麻将牌节点的初始位置
        previousCardPos : null,
        //第一次点击的麻将牌节点
        previousClickCard : null,
        //是否触发了touchMove事件，与点击相区别
        isTouchMove : null,

        _touchBegan: null,
        _touchMoved: null,
    },
    // 初始化，设置位置，只执行一次
    initPlayer (index, game) {
        util.log("跑得快创建玩家 --  index == "+index);     
        // 位置
        this.index = index;
        this.game = game;
        this.infoNode = cc.find("player_info_bg", this.node);
        this.cardNode = cc.find("player_card_bg", this.node);

        // 显示
        // 手牌只需要初始化一次
        this.handInit = false;
        this.halfWidth = this.game.node.width/2;

        // 计算牌的位置
        this.initCardPos();
        
    },
    // 初始化计算扑克位置
    initCardPos () {
        // 轮盘尺寸
        // var turn = cc.find("table/center/turn_bg", this.game.node);
        // var turnX = turn.x;
        // var turnY = turn.y;
        // var turnX = 3;
        // var turnY = 28.8;
        var turnX = 0;
        var turnY = 0;
        // var turnHeight = turn.height*turn.scaleY;
        // var turnWidth = turn.width*turn.scaleX;

        // 牌垛0 手牌1 牌组2 出牌3 牌堆4 结算5
        if (this.index === 0) {
            // 牌垛位置，从右向左
            {
                var leftSize = this.getCardSize(this.index, 0, 0);
                var leftShift = GamePDKConfig.LEFT_SHIFT[this.index];
                this.leftX = turnX + leftShift.x + leftSize.width/2*(GamePDKConfig.LEFT_MAX - 1);
                this.leftY = turnY + leftShift.y;
            }
            // 手牌
            {
                this.updateCardPos(GamePDKConfig.HAND_MAX);
            }
            // 出牌
            {
                var outShift = GamePDKConfig.OUT_SHIFT[this.index];
                this.outX = turnX + outShift.x;
                this.outY = turnY + outShift.y;
            }
        }
        else if (this.index === 1) {
            // 牌垛位置，从右向左
            {
                var leftSize = this.getCardSize(this.index, 0, 0);
                var leftShift = GamePDKConfig.LEFT_SHIFT[this.index];
                this.leftX = turnX + leftShift.x;
                this.leftY = turnY + leftShift.y + leftSize.width/2*(GamePDKConfig.LEFT_MAX - 1);
            }
            // 出牌
            {
                var outShift = GamePDKConfig.OUT_SHIFT[this.index];
                this.outX = turnX + outShift.x - this.halfWidth;
                this.outY = turnY + outShift.y;
            }
        }
        else if (this.index === 2) {
            // 牌垛位置，从右向左
            {
                var leftSize = this.getCardSize(this.index, 0, 0);
                var leftShift = GamePDKConfig.LEFT_SHIFT[this.index];
                this.leftX = turnX + leftShift.x;
                this.leftY = turnY + leftShift.y - leftSize.width/2*(GamePDKConfig.LEFT_MAX - 1);
            }
            // 出牌removeEvent
            {
                var outShift = GamePDKConfig.OUT_SHIFT[this.index];
                this.outX = turnX + outShift.x + this.halfWidth;
                this.outY = turnY + outShift.y;
            }
        }
    },
    //根据触摸位置得到card
    getCardForTouch: function (touch, cardArr) {
        for(var k  = cardArr.length-1;k>=0;k--){
            var box = cardArr[k].getBoundingBox();//getContentSizeInPixels  getBoundingBox
            var cardW = cardArr[k].width;
            var cardH = cardArr[k].height;
            var cardR = Math.abs(cardArr[k].rotation);
            //大矩形的点 大矩形的边长
            // var boxX = Math.round(box.x);
            // var boxY =  Math.round(box.y);
            // var boxH =  Math.round(box.height);
            // var boxW =  Math.round(box.width);
            var boxX = box.x;
            var boxY = box.y;
            var boxH = box.height;
            var boxW = box.width;

            if(cardArr[k].rotation>=0){
                var point1 = cc.p(boxX , boxY + cardW * Math.sin(cardR/180*Math.PI));
                var point2 = cc.p(boxX + cardW * Math.cos(cardR/180*Math.PI) , boxY);
                var point3 = cc.p(boxX + boxW , boxY + cardH * Math.cos(cardR/180*Math.PI));
                var point4 = cc.p(boxX + cardH * Math.sin(cardR/180*Math.PI) , boxY + boxH);
            }else{
                var point1 = cc.p(boxX + cardH * Math.sin(cardR/180*Math.PI) , boxY);
                var point2 = cc.p(boxX + boxW , boxY + cardW * Math.sin(cardR/180*Math.PI));
                var point3 = cc.p(boxX + cardW * Math.cos(cardR/180*Math.PI) , boxY + boxH);
                var point4 = cc.p(boxX, boxY + cardH * Math.cos(cardR/180*Math.PI));
            }

            
            var pointArr = [];


            pointArr.push(point1);
            pointArr.push(point2);
            pointArr.push(point3);
            pointArr.push(point4);
            
            if (cc.Intersection.pointInPolygon(touch, pointArr)) {
                cardArr[k].isChiose = true;
                // cardArr[k].opacity = 155;
                cardArr[k].getChildByName("up").color = new cc.Color(120, 120, 120, 255);
                cardArr[k].getChildByName("up").getChildByName("value").color = new cc.Color(120, 120, 120, 255);
                cardArr[k].getChildByName("up").getChildByName("smallColor").color = new cc.Color(120, 120, 120, 255);
                cardArr[k].getChildByName("up").getChildByName("bigColor").color = new cc.Color(120, 120, 120, 255);
                return cardArr[k];
            }
        }
    },
    checkSelectCardReserve(touchBegan, touchMoved) {
        var p1 = touchBegan.x < touchMoved.x ? touchBegan : touchMoved;
        var width = Math.abs(touchBegan.x - touchMoved.x);
        var height = Math.abs(touchBegan.y - touchMoved.y) > 5 ? Math.abs(touchBegan.y - touchMoved.y) : 5;
        var rect = cc.rect(p1.x, p1.y, width, height);
        var handCard = this.cardNode.getChildByName("card_hand");
        
        // for (let i = 0; i < handCard.children.length; i++) {
        for (let i = handCard.children.length-1; i >= 0; i--) {
            var box = handCard.children[i].getBoundingBox();
            var cardW = handCard.children[i].width;
            var cardH = handCard.children[i].height;
            var cardR = Math.abs(handCard.children[i].rotation);
            var boxX = box.x;
            var boxY = box.y;
            var boxH = box.height;
            var boxW = box.width;
            if(handCard.children[i].rotation>=0){
                var point1 = cc.p(boxX , boxY + cardW * Math.sin(cardR/180*Math.PI));
                var point2 = cc.p(boxX + cardW * Math.cos(cardR/180*Math.PI) , boxY);
                var point3 = cc.p(boxX + boxW , boxY + cardH * Math.cos(cardR/180*Math.PI));
                var point4 = cc.p(boxX + cardH * Math.sin(cardR/180*Math.PI) , boxY + boxH);
            }else{
                var point1 = cc.p(boxX + cardH * Math.sin(cardR/180*Math.PI) , boxY);
                var point2 = cc.p(boxX + boxW , boxY + cardW * Math.sin(cardR/180*Math.PI));
                var point3 = cc.p(boxX + cardW * Math.cos(cardR/180*Math.PI) , boxY + boxH);
                var point4 = cc.p(boxX, boxY + cardH * Math.cos(cardR/180*Math.PI));
            }
            var pointArr = [];


            pointArr.push(point1);
            pointArr.push(point2);
            pointArr.push(point3);
            pointArr.push(point4);
            // if (!cc.rectIntersectsRect(handCard.children[i].getBoundingBox(), rect)) {
            if (!cc.Intersection.rectPolygon(rect,pointArr)) {
                handCard.children[i].isChiose = false;
                handCard.children[i].getChildByName("up").color = new cc.Color(254, 254, 254, 255);
                handCard.children[i].getChildByName("up").getChildByName("value").color = new cc.Color(254, 254, 254, 255);
                handCard.children[i].getChildByName("up").getChildByName("smallColor").color = new cc.Color(254, 254, 254, 255);
                handCard.children[i].getChildByName("up").getChildByName("bigColor").color = new cc.Color(254, 254, 254, 255);
                
            }
        }
        //向右滑动
        if (p1 === touchMoved) {
            util.log("p1 === "+p1);
            util.log("touchMoved === "+touchMoved);
            util.log("touchBegan === "+touchBegan);
            for (let i = handCard.children.length - 1; i >= 0; i--) {
                if (p1.x - handCard.children[i].x > 95) {  // 84 ->  95
                    handCard.children[i].getChildByName("up").color = new cc.Color(254, 254, 254, 255);
                    handCard.children[i].getChildByName("up").getChildByName("value").color = new cc.Color(254, 254, 254, 255);
                    handCard.children[i].getChildByName("up").getChildByName("smallColor").color = new cc.Color(254, 254, 254, 255);
                    handCard.children[i].getChildByName("up").getChildByName("bigColor").color = new cc.Color(254, 254, 254, 255);
                    handCard.children[i].isChiose = false; 
                }
            }
        }

    },
    //扑克出牌监听
    onTouchCardEvent(){
        var handCard = this.cardNode.getChildByName("card_hand");
        handCard.on(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
        // handCard.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        handCard.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        handCard.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
    },
    //取消扑克出牌监听
    offTouchCardEvent(){
        var handCard = this.cardNode.getChildByName("card_hand");
        handCard.off(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
        // handCard.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        handCard.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        handCard.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
    },
    touchBegan(event) {
        // var self = this;
        var handCard = this.cardNode.getChildByName("card_hand");
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        util.log("1111 xxxxx == "+touchLoc.x);
        util.log("1111 xxxxx == "+touchLoc.y);
        util.log("1111 gameData.canvasWidth == "+gameData.canvasWidth);
        util.log("1111 gameData.canvasHeight == "+gameData.canvasHeight);

        touchLoc.x -= gameData.canvasWidth/2;
        touchLoc.y -= gameData.canvasHeight/2;
        // touchLoc.x -= gameData.FrameWidth/2; 
        // touchLoc.y -= gameData.FrameHeight/2;
        this._touchBegan = handCard.convertToNodeSpace(touchLoc);
        // this._touchBegan = handCard.convertTouchToNodeSpace(event.touch);
        this.getCardForTouch(touchLoc,handCard.children);
    },
    touchMoved(event) {
        // var self = this;
        var handCard = this.cardNode.getChildByName("card_hand");
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        touchLoc.x -= gameData.canvasWidth/2;
        touchLoc.y -= gameData.canvasHeight/2; 
        // touchLoc.x -= gameData.FrameWidth/2; 
        // touchLoc.y -= gameData.FrameHeight/2; 
        this._touchMoved = handCard.convertToNodeSpace(touchLoc);
        this.getCardForTouch(touchLoc, handCard.children);
        this.checkSelectCardReserve(this._touchBegan, this._touchMoved);
    },

    touchCancel: function () {

    },
    touchEnd: function (event) {
        var handCard = this.cardNode.getChildByName("card_hand");
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        touchLoc.x -= gameData.canvasWidth/2;
        touchLoc.y -= gameData.canvasHeight/2; 
        // touchLoc.x -= gameData.FrameWidth/2; 
        // touchLoc.y -= gameData.FrameHeight/2; 
        for (var k in handCard.children) {
            // handCard.children[k].opacity = 255;
            handCard.children[k].getChildByName("up").color = new cc.Color(254, 254, 254, 255);
            handCard.children[k].getChildByName("up").getChildByName("value").color = new cc.Color(254, 254, 254, 255);
            handCard.children[k].getChildByName("up").getChildByName("smallColor").color = new cc.Color(254, 254, 254, 255);
            handCard.children[k].getChildByName("up").getChildByName("bigColor").color = new cc.Color(254, 254, 254, 255);
            if (handCard.children[k].isChiose === true) {
                handCard.children[k].isChiose = false;
                if (handCard.children[k].status === SITDOWN) {
                    audioUtils.playSFX("resources/sound/PdkGame/effect/mouseDown.mp3");
                    handCard.children[k].status = STANDUP;
                    handCard.children[k].y += 30;
                    handCard.children[k].isUp = true;
                    this.handUpCardNum++;
                    if(this.handUpCardNum>0 && this.game.getIsShowOps()){//有站起来的牌并且ops正在显示
                        this.game.setOpsBtn(true,true);
                    }
                } else {
                    audioUtils.playSFX("resources/sound/PdkGame/effect/mouseDown.mp3");
                    handCard.children[k].status = SITDOWN;
                    handCard.children[k].y -= 30;
                    handCard.children[k].isUp = false;
                    this.handUpCardNum--;
                    if(this.game.getIsShowOps()){
                        if(this.handUpCardNum>0){
                            this.game.setOpsBtn(true,true);
                        }else{
                            this.game.setOpsBtn(true,false);
                        }
                    }
                }
            }
        }
    },
    // 每局开始刷新状态304
    initGame () {
        util.log("玩家"+this.index+"每局初始化");
        // 牌
        // 牌垛
        this.cardNode.getChildByName("card_left").removeAllChildren();
        // 手牌
        this.setHandCard([], 0);
        //隐藏手牌
        this.setHideHandCard();
        // 牌堆
        this.cardNode.getChildByName("card_table").removeAllChildren();

        // 结算
        this.setResultCard([], 0);
        
        // 托管
        this.setAuto();
        // this.tableNumber = 0;
        // 信息
        // 玩家信息UI
        this.refreshInfoUI();
        // 节点初始位置
        this.setInfoStartPos();
        //隐藏要不起
        this.setYaoBuQi(false);
        //隐藏计时器
        this.setHideCountDown();
        //剩余牌数
        this.setShengyuPaiNum(false,0);
        //隐藏小锁动画
        this.playXiaoSuoAnim(false);
    },
    updateCardPos(cardNum){
        var dest = this.getCardPosAndAngle(cardNum);
        this.handPos = [];
        for (var i = 0; i < cardNum; i++) {
            this.handPos[cardNum - 1 - i] = {
                x : dest[i].x,
                y : dest[i].y,
                r : dest[i].r
            };
        }
    },
    // 设置玩家数据338
    setPlayerData (data) {
        if (data) {
            this.info = data;
        }
        else {
            this.info = null;
        }
    },
    // 刷新界面348
    refreshInfoUI () {
        // 不显示玩家不刷新
        if (!this.node.active) {//三人四人的时候，一般都是显示的
            return;
        }
        if (this.info) {
            //头像框
            if (this.index !== 0) {
                cc.find("head/frame", this.infoNode).active = false;
            }
            util.loadSprite("hall/bag/prop/"+this.info.headFrame, cc.find("head/frame", this.infoNode), function (node) {
                node.active = true;
            });
            //头像
            if (this.index !== 0) {
                cc.find("head/sp", this.infoNode).active = false;
            }
            sdk.getPlayerHead(this.info.headImage, cc.find("head/sp", this.infoNode), function (node) {
                node.active = true;
            });
            this.infoNode.getChildByName("nickname").getComponent(cc.Label).string = this.getNameByLength(decodeURIComponent(this.info.nickname), 8);
            this.refreshMoney();

            //剩余牌数
            this.setShengyuPaiNum(false,0);

            // 初始化手牌，进入游戏场景，玩家第一次进桌时创建
            if(this.index == 0){//只创建自己的
                if (!this.handInit) {
                    this.handInit = true;
                    var handCard = this.cardNode.getChildByName("card_hand");
                    for (var i = 0; i < GamePDKConfig.HAND_MAX; i++) {
                        var card = this.createCard(this.index, 1, 0);
                        card.name = "card_" + i;
                        card.active = false;
                        card.status = SITDOWN;//默认坐下
                        card.isChiose = false;
                        cc.find("up", card).active = false;
                        cc.find("back", card).active = true;
                        handCard.addChild(card, GamePDKConfig.HAND_ZORDER[this.index][i]);//右到左
                    }
                    this.handNowNum = GamePDKConfig.HAND_MAX;
                    // this.addCardListener();
                }   
            }
            this.infoNode.active = true;
        }else {
            // 设置玩家不显示
            cc.find("head/frame", this.infoNode).active = false;
            cc.find("head/sp", this.infoNode).active = false;
            this.infoNode.getChildByName("nickname").getComponent(cc.Label).string = "";
            this.infoNode.getChildByName("gold_num").getComponent(cc.Label).string = "";
            this.infoNode.active = false;
        }
        // 设置房主显示
        this.setOwner(false);
    },
    // 刷新财富399
    refreshMoney () {
        if (gameData.kindId === config.KIND_MATE) {
            // 豆
            this.infoNode.getChildByName("gold_num").getComponent(cc.Label).string = util.showNum3(this.info.score);
            util.loadSprite("game/player_gold_icon", this.infoNode.getChildByName("gold_icon"));
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            // 分
            this.infoNode.getChildByName("gold_num").getComponent(cc.Label).string = util.showNum2(this.info.score);
            util.loadSprite("game/player_score_icon", this.infoNode.getChildByName("gold_icon"));
        }
    },
    // 绑定牌的按钮响应411
    addCardListener () {
        if (this.index === 0) {
            // 只需要绑定玩家自己的牌
            var handCard = this.cardNode.getChildByName("card_hand");
            for (var i = 0; i < GamePDKConfig.HAND_MAX; i++) {
                var card = handCard.getChildByName("card_" + i);
                card.selIndex = i;
                // util.addClickEvent(card, this.node, "GamePDKPlayer", "onCardClick", i);
                // card.on("touchstart", this.touchStart, this);
                // card.on("touchmove", this.touchMove, this);
                // card.on("touchend", this.onCardClick, this);
                // card.on("touchcancel", this.touchCancel, this);
            }
            var handCard = this.cardNode.getChildByName("card_hand");//
        }
    },
    // 设置房主显示426
    setOwner (flag) {
        cc.find("head/owner", this.infoNode).active = !!flag;
    },
    // 设置准备
    setReady (flag) {
        this.infoNode.getChildByName("ready").active = !!flag;
    },
    // 设置初始位置435
    setInfoStartPos () {
        if (this.index === 0) {
            this.infoNode.x = 0;
            this.infoNode.y = -115;
        }
        else if (this.index === 1) {
            this.infoNode.x = 207 - this.halfWidth;
            this.infoNode.y = 28;
        }
        else if (this.index === 2) {
            this.infoNode.x = this.halfWidth - 207;
            this.infoNode.y = 28;
        }
        
    },
    //隐藏计时器
    setHideCountDown(){
        cc.find("jishiqi", this.infoNode).active = false;
    },
    //设置倒计时
    setCountDown(time,ts,timeDiff){
        if(this.index == 0){
            cc.find("jishiqi", this.infoNode).x = gameData.canvasWidth/2-527;
        }
        if(this.index == 1){
            cc.find("dengchupaiTip", this.infoNode).x = -gameData.canvasWidth/2+53;
        }else if(this.index == 2){
            cc.find("dengchupaiTip", this.infoNode).x = gameData.canvasWidth/2-53;
        }else if(this.index == 0){
            cc.find("dengchupaiTip", this.infoNode).x = gameData.canvasWidth/2-98;
        }
        cc.find("jishiqi", this.infoNode).active = true;
        var timer = cc.find("jishiqi/time", this.infoNode).getComponent(cc.Label);
        var progressBar = cc.find("jishiqi/progress", this.infoNode).getComponent(cc.ProgressBar);
        if (ts) {
            let curTime = (new Date()).getTime();
            util.log("ts1111  == "+ts);
            util.log("curTime1111  == "+curTime);
            util.log("timeDiff1111  == "+timeDiff);
            time = Math.floor((ts - curTime + (timeDiff || 0))/1000) + time;
            util.log("time1111  == "+time);
            time = time >= 0 ? time : 0;
        }else if(ts == 0){
            timer.string = 0;
            progressBar.progress = 0;
            return;
        }
        var speed = 0.1/time;
        util.log("1111111111  speed == "+ speed);
        util.log("1111111111  time == "+ time);
        
        progressBar.progress = 1;
        progressBar.unscheduleAllCallbacks();
        timer.unscheduleAllCallbacks();
        if (time) {
            util.log("time01 == "+time);
            timer.string = time;
            let that = this;
            progressBar.schedule(function () {
                this.progress -= speed; 
            }, 0.1, time*10);
            timer.schedule(function () {
                if(that.index == 0){
                    if (time === 1 || time === 2 || time === 3) {
                        audioUtils.playSFX("resources/sound/PdkGame/effect/alarm.mp3");
                    }
                }
                if(time == 1){
                    if(gameData.kindId === config.KIND_FRIEND){
                        cc.find("dengchupaiTip", that.infoNode).active = true;
                    }
                    
                    // cc.find("dengchupaiTip", that.infoNode).setLocalZOrder(500);
                    
                }
                
                this.string = --time;
            }, 1, time-1);
            
        }
        else {
            timer.string = "0";
            progressBar.active = false;
        }
    },
    //设置要不起
    setYaoBuQi(flag){
        if(this.index == 0){
            cc.find("yaobuqi", this.infoNode).x = gameData.canvasWidth/2-98;
        }
        if(!!flag){
            this.setHideCountDown();
            util.log("this.info.sex  ==  "+this.info.sex);
            this.playYaoBuQi();   
        }
        cc.find("yaobuqi", this.infoNode).active = !!flag;
    },
    playYaoBuQi(){
        var random = Math.floor(Math.random() * 2+1);
        if (this.info.sex) {
            audioUtils.playSFX("resources/sound/PdkGame/woman/w_yaobuqi_"+random+".mp3");
        }
        else {
            audioUtils.playSFX("resources/sound/PdkGame/man/m_yaobuqi_"+random+".mp3");
        }
    },
    // 设置玩家掉线
    setOffline (flag) {
        cc.find("head/offline", this.infoNode).active = !!flag;
    },

    // 动作
    // 开场玩家头像 487
    actPlayerMove (callback) {
        // 信息
        this.infoNode.stopAllActions();
        //适配刘海屏
        var isNotch = util.isNotchPhone(gameData.FrameWidth,gameData.FrameHeight);
        if (isNotch) {
            var dest = [
                {x : 98 - this.halfWidth + 75, y : -180},
                {x : -53, y : 72},
                {x : 53 + 60, y : 72}
            ][this.index];
        } else {
            var dest = [
                {x : 98 - this.halfWidth, y : -180},
                {x : -53, y : 72},
                {x : 53, y : 72}
            ][this.index];  
        }
   

        this.infoNode.runAction(
            cc.sequence(
                cc.moveTo(0.5, dest.x, dest.y),
                cc.callFunc(function () {
                    if (callback) {
                        callback();
                    }
                }, this)
            )
        );
    },
    // 牌垛509
    actShowLeftCard (callback) {
        // 牌垛从右向左
        var leftCard = this.cardNode.getChildByName("card_left");
        var leftSize = this.getCardSize(this.index, 0, 1);
        util.log("mjf-- 跑得快 leftSize == "+leftSize);
        if (this.index === 0) {
            util.log("mjf--跑得快 actShowLeftCard this.index === 0 ");
            leftCard.scaleY = 1;
            leftCard.active = true;
            leftCard.y = this.leftY;
            // for (var i = 0; i < 2; i++) {
                for (var j = 0; j < GamePDKConfig.LEFT_MAX; j++) {
                    var name = "" + (j);
                    var card_old = leftCard.getChildByName(name);
                    if (card_old) {
                        card_old.removeFromParent();
                    }
                    var card_new = this.createCard(this.index, 0, 1);
                    card_new.x = this.leftX - leftSize.width*j;// - i*5;
                    // card_new.y = i*leftSize.height;//i*15;
                    card_new.y = this.leftY - leftSize.height*j;
                    card_new.name = name;
                    leftCard.addChild(card_new, GamePDKConfig.LEFT_MAX-j);
                }
            // }
        }
        else if (this.index === 1) {
            // util.log("mjf--跑得快 actShowLeftCard this.index === 1 ");
            // leftCard.scaleX = 1;
            // leftCard.x = this.leftX;
            // // for (var i = 0; i < 2; i++) {
            //     // for (var j = 0; j < GamePDKConfig.LEFT_MAX; j++) {
            //         // var name = "" + (i*GamePDKConfig.LEFT_MAX + j);
            //         var name = "0";
            //         var card = leftCard.getChildByName(name);
            //         if (card) {
            //             card.removeFromParent();
            //         }
            //         card = this.createCard(this.index, 0, 1);
            //         // card.x = i*3;
            //         // card.y = this.leftY - leftSize.width*j + i*leftSize.height;// + i*15;
            //         card.y = this.leftY;// + i*15;
            //         card.name = name;
            //         // leftCard.addChild(card, i*GamePDKConfig.LEFT_MAX + j + GamePDKConfig.LEFT_MAX);
            //         leftCard.addChild(card, GamePDKConfig.LEFT_MAX);
            //     // }
            // // }
        }
        else if (this.index === 2) {
            // util.log("mjf--跑得快 actShowLeftCard this.index === 2 ");
            // leftCard.scaleX = 1;
            // leftCard.x = this.leftX;
            // // for (var i = 0; i < 2; i++) {
            //     // for (var j = 0; j < GamePDKConfig.LEFT_MAX; j++) {
            //         // var name = "" + (i*GamePDKConfig.LEFT_MAX + j);
            //         var name = "0";
            //         var card = leftCard.getChildByName(name);
            //         if (card) {
            //             card.removeFromParent();
            //         }
            //         card = this.createCard(this.index, 0, 1);
            //         // card.x = - i*3;
            //         // card.y = this.leftY + leftSize.width*j + i*leftSize.height;// + i*15;
            //         card.y = this.leftY;// + i*15;
            //         card.name = name;
            //         leftCard.addChild(card, i*GamePDKConfig.LEFT_MAX - j + GamePDKConfig.LEFT_MAX);
            //     // }
            // // }
        }
        leftCard.opacity = config.maxOpacity;

        if (callback) {
            callback(this);
        } 
    },
    // 发牌
    actFaPai (callback) {
        // 牌垛从右向左
        var leftCard = this.cardNode.getChildByName("card_left");
        var dest = this.getCardPosAndAngle(GamePDKConfig.HAND_MAX);
        var moveCard = function(name){
            var card = leftCard.getChildByName(name);
            if(parseInt(name) < GamePDKConfig.LEFT_MAX-1){
                if(card){
                    card.active = true;
                    card.stopAllActions();
                    card.runAction(
                        cc.sequence(
                            cc.delayTime(i*0.1),
                            cc.spawn(
                                cc.scaleTo(0.1,2),
                                cc.rotateTo(0.08,dest[i].r),
                                cc.moveTo(0.1, dest[i].x, dest[i].y),
                                cc.callFunc(function () {
                                    card.setLocalZOrder(50+i);
                                },this)
                            )
                        )
                    ); 
                }
            }else{//最后一张牌
                if(card){
                    card.active = true;
                    card.stopAllActions();
                    card.runAction(
                        cc.sequence(
                            cc.delayTime(i*0.1),
                            cc.spawn(
                                cc.scaleTo(0.1,2),
                                cc.rotateTo(0.08,dest[i].r),
                                cc.moveTo(0.1, dest[i].x, dest[i].y),
                                cc.callFunc(function () {
                                    card.setLocalZOrder(50+i);
                                },this)
                            ),
                            // cc.delayTime(0.1),
                            cc.callFunc(function () {
                                if (callback) {
                                    callback(this);
                                } 
                            },this)
                        )
                    ); 
                }
            }
            
        };
        if (this.index === 0) {//自己位置播放发牌动作
            util.log("mjf--跑得快 actFaPai" );
            audioUtils.playSFX("resources/sound/PdkGame/effect/sendPoker.mp3");
            for (var i = 0; i< GamePDKConfig.LEFT_MAX; i++) {
                var name = "" + (i);
                moveCard(name);
            }
        }

        // if (callback) {
        //     callback(this);
        // } 
    },
    // 牌垛消失，
    actShowHandCard (callback) {
        var leftCard = this.cardNode.getChildByName("card_left");
        leftCard.stopAllActions();
        // var scaleX = [1, 0, 1, 0][this.index];
        // var scaleY = [0, 1, 0, 1][this.index];
        leftCard.active = false;
        if (callback) {
            callback(this);
        }
        // if (this.index === 0) {
        //     leftCard.runAction(
        //         cc.spawn(
        //             // cc.scaleTo(0.10, scaleX, scaleY),
        //             // cc.fadeTo(0.10, 0),
        //             // cc.sequence(
        //             //     cc.moveBy(0.05, 0, -30),
        //             //     cc.moveBy(0.05, 0, 50)
        //             // ),
        //             cc.sequence(
        //                 // cc.delayTime(0.08),
        //                 cc.callFunc(function () {
        //                     // if (this.index === 0) {
        //                         // var handCard = this.cardNode.getChildByName("card_hand");
        //                         // handCard.y = -150;
        //                         // util.log("mjf -- 跑得快 0号位置手牌移动到0，0");
        //                         // handCard.stopAllActions();
        //                         // handCard.runAction(
        //                         //     cc.moveTo(0.2, 0, 0)
        //                         // );
        //                     // }
        //                     if (callback) {
        //                         callback(this);
        //                     }
        //                 }, this)
        //             )
        //         )
        //     );
        // }
        // else {
            // leftCard.runAction(
            //     cc.spawn(
            //         cc.scaleTo(0.15, scaleX, scaleY),
            //         cc.fadeTo(0.15, 0),
            //         cc.sequence(
            //             cc.delayTime(0.08),
            //             cc.callFunc(function () {
            //                 if (this.index === 0) {
            //                     var handCard = this.cardNode.getChildByName("card_hand");
            //                 }
            //                 if (callback) {
            //                     callback(this);
            //                 }
            //             }, this)
            //         )
            //     )
            // );
        // }
    },
    //设置隐藏手牌
    setHideHandCard(){
        if (!this.handInit) {
            // 初始化时，没有创建手牌对象
            util.error("没有创建手牌");
            return;
        }
        if (this.index === 0){
            var handCard = this.cardNode.getChildByName("card_hand");
            for (var i = 0; i < GamePDKConfig.HAND_MAX; i++) {
                var card = handCard.getChildByName("card_" + i);
                // var card = this.createCard(this.index, 1, 0);
                // card.name = "card_" + i;
                card.active = false;
                card.status = SITDOWN;//默认坐下
                card.isChiose = false;
                cc.find("up", card).active = false;
                cc.find("back", card).active = true;
                // handCard.addChild(card, GamePDKConfig.HAND_ZORDER[this.index][i]);//右到左
            }
            this.handNowNum = GamePDKConfig.HAND_MAX;
        }
    },
    setShengyuPaiNum(flag,num){
        if(this.index == 0){
            return;
        }
        var shengyu = cc.find("bg_shengyu/shengyu", this.infoNode).getComponent(cc.Label);
        shengyu.string = num;
        cc.find("bg_shengyu", this.infoNode).active = !!flag;
    },
    // 设置手牌，cardArray手牌值数组，cardNum手牌数量，显示手牌 651 （发完牌用这个，更新位置用updateHandCard）
    setHandCard (cardArray, cardNum) {
        if (!this.handInit) {
            // 初始化时，没有创建手牌对象
            util.error("没有创建手牌");
            return;
        }
        util.log("pdk-- setHandCardcardNum == "+ cardNum);
        if (this.index === 0) {
            // 手牌排序
            this.sortHandCard(cardArray,1);
        }
        var self = this;
        var turnCard = function(i){
            var handCard = self.cardNode.getChildByName("card_hand");
            var card = handCard.getChildByName("card_" + i);
            if(card){
                card.active = true;
                card.stopAllActions();
                var backNode = card.getChildByName("back");
                var upNode = card.getChildByName("up");
                upNode.active = false;
                
                backNode.runAction(
                    cc.sequence(
                        cc.delayTime((cardNum-i-1)*0.09),
                        cc.spawn(
                            cc.scaleTo(0.1, 0, 1),
                            cc.skewTo(0.1, 0, -30)
                        ),
                        cc.callFunc(function () {
                            util.log("扑克翻转，背面消失");
                            backNode.active = false;
                            upNode.scaleX = 0;
                            upNode.active = true;
                            upNode.runAction(cc.scaleTo(0.1, 1,1));
                        }),
                        cc.spawn(
                            cc.scaleTo(0.1,1,1),
                            cc.skewTo(0.1, 0, 0)
                        )
                    )
                );
                
            };
        };
        if (this.index === 0) {
            // 玩家自己
            // 设置选中牌
            this.selectIndex = -1;
            // 设置手牌值
            this.handValue = [];
            // 设置手牌显示
            var handCard = this.cardNode.getChildByName("card_hand");
            for (var i = 0; i < cardNum; i++) {
            // for (var i = cardNum-1; i >= 0; i--) {
                var card = handCard.getChildByName("card_" + i);
                card.status = SITDOWN;
                card.isChiose = false;
                card.isUp = false;
                this.handValue[i] = cardArray[i];
                this.setCardValue(card, cardArray[i]);
                this.setHandPos(card, i,cardNum);
            }
            if(cardNum){
                audioUtils.playSFX("resources/sound/PdkGame/effect/fanpai.mp3");
            }
            for (var i = cardNum-1; i >= 0; i--) {
                // var card = handCard.getChildByName("card_" + i);
                turnCard(i);
            }

        }
        else {
            // // 其他玩家
            
        }
    },
    //出牌后更新手牌
    updateHandCard(cardArray, cardNum,lastParNum){
        util.log("出牌后剩余手牌数量  == "+cardNum);
        util.log("这一次出的手牌数量  == "+lastParNum);
        this.handNowNum = cardNum;
        this.handUpCardNum = 0;
        this.handUpValue = [];
        if(this.index === 1 || this.index === 2){//更新其他人的手牌数量
            this.setShengyuPaiNum(true,cardNum);
        }
        if (!this.handInit) {
            // 初始化时，没有创建手牌对象
            util.error("没有创建手牌");
            return;
        }
        if (this.index === 0) {
            // 手牌排序
            this.sortHandCard(cardArray,1);
        }
        if (this.index === 0) {
            var handCard = this.cardNode.getChildByName("card_hand");
            if(handCard.childrenCount > cardNum){
                // 玩家自己
                // 设置选中牌
                this.selectIndex = -1;
                // 设置手牌值
                this.handValue = [];
                // 设置手牌显示
                
                for(var i = cardNum+lastParNum-1; i>cardNum-1; i--){
                    util.log("删除的牌  i =="+i);
                    var card = handCard.getChildByName("card_" + i);
                    card.scale = 1;
                    if(card){
                        card.active = false;
                    }
                }
                for (var i = 0; i < cardNum; i++) {
                // for (var i = cardNum-1; i >= 0; i--) {
                    var card = handCard.getChildByName("card_" + i);
                    // cc.find("back",card).active = false;
                    // cc.find("up",card).active = true;
                    card.active = true;
                    card.status = SITDOWN;
                    card.isUp = false;
                    card.scale = 1;
                    card.isChiose = false;
                    // card.setLocalZOrder(GamePDKConfig.HAND_ZORDER[0][i])
                    this.handValue[i] = cardArray[i];
                    this.setCardValue(card, cardArray[i]);
                    this.setHandPos(card, i,cardNum);
                }
            }
        }
    },
    // 手牌排序726
    sortHandCard (cardArray,flag) {
        // 1 从小到大   -1  从大到小
        // var flag = flag;
        var self = this;
        cardArray.sort(function(a,b){
            var wa = GamePDKRule.getCard(a).weight;
            var wb = GamePDKRule.getCard(b).weight;
            return wa == wb ? flag * (self.getHuaValue(a) - self.getHuaValue(b)) : flag * (wa - wb);
        });

    },
    getHuaValue (id) {
        if (id >= 0 && id <= 12) return 3;
        if (id >= 13 && id <= 25) return 4;
        if (id >= 26 && id <= 38) return 2;
        if (id >= 39 && id <= 51) return 1;
        if (id >= 100) return 0;
        return id;
    },
    // 设置单张牌，card牌对象751
    setCardValue (card, value) {
        card.cardNumValue = value;//这张牌的number（后端传过来的）
        // 数据组件
        var gamePDKCard = card.getComponent("GamePDKCard");
        // 渲染组件
        var cardValue = card.getChildByName("up").getChildByName("value");
        var type = 0;
        if (cardValue) {
            if(GamePDKRule.getCard(value).type == 3){//红黑梅方
                type = 2;
            }else if(GamePDKRule.getCard(value).type == 4){
                type = 1;
            }else{
                type = GamePDKRule.getCard(value).type;
            }
            var res = "pdkGame/puke/"+type+"_" + GamePDKRule.getCard(value).value;
            util.loadSprite(res, cardValue, function () {
                cardValue.rotation = gamePDKCard.valueRotation;
            });
        }
        var smallColor = card.getChildByName("up").getChildByName("smallColor");
        if (smallColor) {
            var res = "pdkGame/pukeColor/smallColor_" + GamePDKRule.getCard(value).type;//先不弄这个
            util.loadSprite(res, smallColor, function () {
                smallColor.rotation = gamePDKCard.valueRotation;
            });
        }
        var bigColor = card.getChildByName("up").getChildByName("bigColor");
        if (bigColor) {
            var res = "pdkGame/pukeColor/bigColor_" + GamePDKRule.getCard(value).type;
            util.loadSprite(res, bigColor, function () {
                bigColor.rotation = gamePDKCard.valueRotation;
            });
        }

        // var god = card.getChildByName("god");
        // if (god) {
        //     if (this.godValue && this.godValue === value && god) {
        //         // 临时
        //         if (gameData.mapId === config.HENAN_TUIDAOHU) {
        //             god.getChildByName("god_text_1001").active = true;
        //             god.getChildByName("god_text_1101").active = false;
        //         }
        //         else {
        //             god.getChildByName("god_text_1001").active = false;
        //             god.getChildByName("god_text_1101").active = true;
        //         }
        //         god.active = true;
        //     }
        //     else {
        //         god.active = false;   
        //     }
        // }
    },
    // 设置手牌的位置，card牌对象，index牌下标  785，设置牌的角度  带弧度
    setHandPos (card, index,cardNum) {
        this.updateCardPos(cardNum);
        var pos = this.handPos[index];
        card.x = pos.x;
        card.setRotation(pos.r);
        if (this.index === 0 && card.status === STANDUP) {
            card.y = pos.y + GamePDKConfig.HAND_SELECT;
        }
        else {
            card.y = pos.y;
        }
    },
    // 设置玩家显示，三人游戏，不显示第四个玩家，（还没用到，暂时没用） 836
    setPlayerShow (flag) {
        this.node.active = !!flag;
    },
    removeTableCard(){
        let cardTable0 = this.cardNode.getChildByName("card_table");
        cardTable0.removeAllChildren();
    },
    // 出牌，value出牌牌值（一个数组），index出牌下标(一个数组)，callback出完牌回调840  type 出牌类型  num 出牌数量
    OutCard (value, index, type,num, callback) {
        this.game.removeAllTableCard();//每次出牌删除所有人的桌面的牌
        // 回调使用，保存当前值  
        // var curNumber = this.tableNumber;
        // util.log("curNumber == "+curNumber);
        // this.tableNumber++;//不是加一个

        //等待好友出牌提示消失
        cc.find("dengchupaiTip", this.infoNode).active = false;

        this.scheduleOnce(function() {
            audioUtils.playSFX("resources/sound/PdkGame/effect/cardOut.mp3");
        }, 0.8);
        
        if (this.index === 0) {

            // 音效
            this.playOutEffect(type, num, this.info.sex);

            this.sortHandCard(this.handUpValue,-1);
            this.sortHandCard(value,-1);
            util.log("this.handUpValue.toString() == "+this.handUpValue.toString());
            util.log("value.toString() == "+value.toString());
            // if (this.handValue[index] === value) {
            // if(this.handUpValue.toString() == value.toString()){//数组中只有数字，且顺序不会变，所以用这个方法就行
                // 出牌效果
                util.log("GamePDKPlayer OutCard 出牌 index="+index+" value="+value.toString()+" origin="+this.handUpValue.toString());
                //牌堆
                let cardTable = this.cardNode.getChildByName("card_table");
                for (var i = 0 ;i < value.length; i++) {
                    var dest = this.getTableCardPos(value.length,i);
                    var tableCard = this.createCard(0, 4, 0);
                    util.log("dest.x == "+dest.x);
                    util.log("dest.y == "+dest.y);
                    tableCard.x = dest.x;
                    tableCard.y = dest.y;
                    tableCard.name = "tableCard_" + i;
                    tableCard.active = false;
                    cardTable.addChild(tableCard, dest.zorder);
                }
                var cardHand = this.cardNode.getChildByName("card_hand");
                for(var i = 0 ;i < value.length; i++){
                    // 手牌（出的这张牌）
                    // var handCard = cc.find("card_hand/card_" + index[i], this.cardNode);
                    
                    // 牌堆
                    let tableCard = cardTable.getChildByName("tableCard_" + i);
                    this.setCardValue(tableCard, value[i]);

                    // for(var j = cardHand.children.length-1;j>=0;j--){
                    //     if(cardHand.children[j].cardNumValue == value[i]){
                    //         var handCard = cardHand.children[j];
                    //     }
                    // }
                    for(var j = this.handNowNum-1;j>=0;j--){
                        var card = cardHand.getChildByName("card_"+j);
                        if(card.cardNumValue == value[i]){
                            var handCard = card;
                        }
                    }
                    

                    var outPos = this.getOtherOutCardPos(value.length,i);
                    let outCardScale = this.getCardSize(this.index, 3, 0).scale;
                    handCard.stopAllActions();
                    handCard.runAction(
                        cc.sequence(
                            cc.spawn(
                                cc.moveTo(0.2, outPos.x, outPos.y),
                                cc.rotateTo(0.2,0),
                                cc.scaleTo(0.2, outCardScale, outCardScale)
                            ),
                            cc.delayTime(0.4),
                            cc.callFunc(function() {
                                tableCard.active = true;
                                handCard.active = true;
                            }, this),
                            cc.scaleTo(0.2, 1,1),
                            cc.callFunc(function() {
                                if (callback) {
                                    callback();
                                }
                            }, this)
                            // cc.removeSelf()//先不删除了
                        )
                    );
                }
            // }else{
            //     // 错了
            //     util.error("GamePDKPlayer OutCard 出错牌了 index="+index+" value="+value+" origin="+this.handUpValue);
            // }
        }else{
            // 音效
            this.playOutEffect(type, num, this.info.sex);
            this.sortHandCard(value,-1);
            // 创建牌堆
            let cardTable = this.cardNode.getChildByName("card_table");
            for (var i = 0 ;i < value.length; i++) {
                var dest = this.getTableCardPos(value.length,i);
                var tableCard = this.createCard(0, 4, 0);
                util.log("dest.x == "+dest.x);
                util.log("dest.y == "+dest.y);
                tableCard.x = dest.x;
                tableCard.y = dest.y;
                tableCard.name = "tableCard_" + i;
                tableCard.active = false;
                cardTable.addChild(tableCard, dest.zorder);
            }
            for (var i = 0 ;i < value.length; i++) {
                var handCard = cc.find("card_hand", this.cardNode);//在头像中点
                // 牌堆
                let tableCard = cardTable.getChildByName("tableCard_" + i);
                this.setCardValue(tableCard, value[i]);

                // 创建出牌
                var outCard = this.createCard(this.index, 3, 0);
                var outPos = this.getOtherOutCardPos(value.length,i);
                var outCardScale = outCard.getComponent("GamePDKCard").cardScale;
                this.setCardValue(outCard, value[i]);
                outCard.x = handCard.x;
                outCard.y = handCard.y;
                outCard.scaleX = 0;
                outCard.scaleY = 0;
                outCard.setLocalZOrder(10+i);
                cc.find("back",outCard).active = false;
                this.cardNode.addChild(outCard);
                util.log("outPos.x  == " +outPos.x);
                util.log("outPos.y  == " +outPos.y);
                // outCardNode.addChild(outCard);
                outCard.stopAllActions();
                outCard.runAction(
                    cc.sequence(
                        cc.spawn(
                            cc.scaleTo(0.4, outCardScale, outCardScale),
                            cc.moveTo(0.4, outPos.x, outPos.y)
                        ),
                        cc.delayTime(0.4),
                        cc.callFunc(function () {
                            tableCard.active = true;
                            if (callback) {
                                callback();
                            }
                        }, this),
                        cc.removeSelf()
                    )
                );
            }
        }
    },
    playJingGaoAnim(flag){
        util.log("1111  index == "+ this.index);
        if(!!flag){//显示
            audioUtils.playSFX("resources/sound/PdkGame/effect/alert.mp3");
            this.scheduleOnce(function() {
                var random = Math.floor(Math.random() * 2+1);
                if (this.info.sex) {
                    audioUtils.playSFX("resources/sound/PdkGame/woman/w_yizhang_"+random+".mp3");
                }
                else {
                    audioUtils.playSFX("resources/sound/PdkGame/man/m_yizhang_"+random+".mp3");
                }
            }, 0.8);
            
            this.infoNode.stopAllActions();
            let anim = this.infoNode.getChildByName("warning");
            anim.active = true;
            anim.getComponent(cc.Animation).play("warning");
        }else{//隐藏
            let anim = this.infoNode.getChildByName("warning");
            anim.getComponent(cc.Animation).stop("warning");
            anim.active = false;
        }
        
    },
    playXiaoSuoAnim(flag){
        util.log("1111  index == "+ this.index);
        if(!!flag){//显示
            this.infoNode.stopAllActions();
            let anim = this.infoNode.getChildByName("head").getChildByName("suoAnim");
            util.loadGameAnim("pdkGame/anim/xiaosuo", function (data) {
                anim.active = true; 
                // anim.scaleX = 2;
                // anim.scaleY = 2;
                anim.getComponent(cc.Animation).addClip(data);
                anim.getComponent(cc.Animation).play("xiaosuo");
            });
            // anim.active = true;
            // anim.getComponent(cc.Animation).play("xiaosuo");
        }else{//隐藏
            let anim = this.infoNode.getChildByName("head").getChildByName("suoAnim");
            util.loadGameAnim("pdkGame/anim/xiaosuo", function (data) {
                
                anim.getComponent(cc.Animation).addClip(data);
                anim.getComponent(cc.Animation).stop("xiaosuo");
                anim.active = false; 
            });
            // anim.getComponent(cc.Animation).stop("xiaosuo");
            // anim.active = false;
        }
    },

    //断线重连回来，直接显示上次牌堆的牌
    setTableCard(value){
        this.sortHandCard(value,-1);
        this.game.removeAllTableCard();
        let cardTable = this.cardNode.getChildByName("card_table");
        for (var i = 0 ;i < value.length; i++) {
            var dest = this.getTableCardPos(value.length,i);
            var tableCard = this.createCard(0, 4, 0);
            util.log("dest.x == "+dest.x);
            util.log("dest.y == "+dest.y);
            tableCard.x = dest.x;
            tableCard.y = dest.y;
            tableCard.name = "tableCard_" + i;
            tableCard.active = false;
            cardTable.addChild(tableCard, dest.zorder);
        }
        for (var i = 0 ;i < value.length; i++) {
            // 牌堆
            let tableCard = cardTable.getChildByName("tableCard_" + i);
            this.setCardValue(tableCard, value[i]);
            tableCard.active = true;
        }

    },
    // 计算牌堆中牌的位置，number牌堆中牌的数量962
    getTableCardPos (number,i) {
        //牌之间的间距
        var spacing = 0;
        if(number<5 && number>0){
            spacing = 45;
        }else if(number<10 && number > 4){
            spacing = 38;
        }
        else if(number<17){
            spacing = 32;
        }
        var allRange = spacing*(number-1);//因牌数增加，增加的宽度
        var firsrCardPosX = -allRange/2;//第一张扑克位置
        return {
            x : firsrCardPosX+spacing*i,
            y : 80,
            zorder : 10+i,
        };
    },
    //出牌位置
    getOutCardPos(number,i){
        if(this.index == 0){
            //牌之间的间距
            var spacing = 0;
            if(number<5 && number>0){
                spacing = 55;
            }else if(number<10 && number > 4){
                spacing = 48;
            }
            else if(number<17){
                spacing = 42;
            }
            var allRange = spacing*(number-1);//因牌数增加，增加的宽度
            var firsrCardPosX = allRange/2;//第一张扑克位置
            return {
                x : firsrCardPosX-spacing*i,
                y : 80
                // ,
                // zorder : 10+i,
            };
        }else if(this.index == 1){
            //牌之间的间距
            var spacing = 0;
            if(number<5 && number>0){
            spacing = 55;
            }else if(number<10 && number > 4){
            spacing = 48;
            }
            else if(number<17){
            spacing = 42;
            }
            var allRange = spacing*(number-1);//因牌数增加，增加的宽度
            var firsrCardPosX = allRange/2;//第一张扑克位置
            return {
            x : firsrCardPosX-spacing*i-gameData.canvasWidth/2,
            y : 80
            // ,
            // zorder : 10+i,
            };
        }
        else if(this.index == 2){
            //牌之间的间距
            var spacing = 0;
            if(number<5 && number>0){
            spacing = 55;
            }else if(number<10 && number > 4){
            spacing = 48;
            }
            else if(number<17){
            spacing = 42;
            }
            var allRange = spacing*(number-1);//因牌数增加，增加的宽度
            var firsrCardPosX = allRange/2;//第一张扑克位置
            return {
            x : firsrCardPosX-spacing*i+gameData.canvasWidth/2,
            y : 80
            // ,
            // zorder : 10+i,
            };
        }
    },
    //其他人出牌位置
    getOtherOutCardPos(number,i){
        if(this.index == 0){
            //牌之间的间距
            var spacing = 0;
            if(number<5 && number>0){
                spacing = 55;
            }else if(number<10 && number > 4){
                spacing = 48;
            }
            else if(number<17){
                spacing = 42;
            }
            var allRange = spacing*(number-1);//因牌数增加，增加的宽度
            var firsrCardPosX = -allRange/2;//第一张扑克位置
            return {
                x : firsrCardPosX+spacing*i,
                y : 80
                // ,
                // zorder : 10+i,
            };
        }else if(this.index == 1){
            //牌之间的间距
            var spacing = 0;
            if(number<5 && number>0){
            spacing = 55;
            }else if(number<10 && number > 4){
            spacing = 48;
            }
            else if(number<17){
            spacing = 42;
            }
            var allRange = spacing*(number-1);//因牌数增加，增加的宽度
            var firsrCardPosX = -allRange/2;//第一张扑克位置
            return {
            x : firsrCardPosX+spacing*i-gameData.canvasWidth/2,
            y : 80
            // ,
            // zorder : 10+i,
            };
        }
        else if(this.index == 2){
            //牌之间的间距
            var spacing = 0;
            if(number<5 && number>0){
            spacing = 55;
            }else if(number<10 && number > 4){
            spacing = 48;
            }
            else if(number<17){
            spacing = 42;
            }
            var allRange = spacing*(number-1);//因牌数增加，增加的宽度
            var firsrCardPosX = -allRange/2;//第一张扑克位置
            return {
            x : firsrCardPosX+spacing*i+gameData.canvasWidth/2,
            y : 80
            // ,
            // zorder : 10+i,
            };
        }
    },
    setResultCardPos(number,i){
        var RowNum = GamePDKConfig.HAND_MAX/2;
        if(this.index == 1){
            if(number<RowNum+1){
                return {
                    x : -410 + i*30,
                    y : 80
                };
            }else{
                if(i<RowNum){
                    return {
                        x : -410 + i*30,
                        y : 100
                    };
                }else{
                    return {
                        x : -410 + (RowNum - (number-RowNum)) * 30 + (i - 8) * 30,
                        y : 40
                    };
                }
            }
        }else if(this.index == 2){
            if(number<RowNum+1){
                return {
                    x : 200 + i*30,
                    y : 80
                };
            }else{
                if(i<RowNum){
                    return {
                        x : 200 + i*30,
                        y : 100
                    };
                }else{
                    return {
                        x : 200 + (i - RowNum) * 30,
                        y : 40
                    };
                }
            }
        }
    },
    // 结算设置手牌  1502
    setResultCard (cardArray, cardNum) {
        util.log("玩家"+this.index+"结算设置手牌");
        if(this.index == 0){//自己的手牌不显示结算手牌
            return;
        }
        // 设置手牌隐藏
        this.setHandCard([], 0);
        // 手牌排序
        this.sortHandCard(cardArray, cardNum);

        let resultCard = this.cardNode.getChildByName("card_result");//小结算扑克节点
        // 删除以前的节点
        resultCard.removeAllChildren();
        for (let i = 0; i < cardNum; i++) {
            let card = this.createCard(this.index, 5, 0);
            this.setCardValue(card, cardArray[i]);
            // this.handStatus[i] = 0;
            var pos = this.setResultCardPos(cardNum,i);
            card.x = pos.x; 
            card.y = pos.y;
            // this.setHandPos(card, i);
            resultCard.addChild(card, GamePDKConfig.Result_ZORDER[this.index][i]);
        }
    },
    // 设置托管状态
    setAuto (flag) {
        this.auto = !!flag;
        if (this.auto) {
            // 托管，有已选中牌，设置手牌回到位置
            // if (this.selectIndex && this.selectIndex !== -1) {
            //     //托管时，将点击选中牌清空
            //     this.previousClickCard = null;
            //     this.handStatus[this.selectIndex] = 0;
            //     var card = cc.find("card_hand/card_" + this.selectIndex, this.cardNode);
            //     this.setHandPos(card, this.selectIndex);
            // }
            //所有手牌都回到位置                                                                                                              
            this.setAllHandCardDownPos();
            //不显示ops
            this.game.setOpsBtn(false,false);
        }
    },
    setZhaDanScore(score){
        util.log("炸弹现结 玩家"+this.index+" 分数"+score);
        let changeScore = score;
        if (gameData.kindId === config.KIND_MATE) {
            changeScore -= this.info.score;
            this.info.score = score;
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            changeScore -= this.info.score;
            this.info.score = score;
        }      
        if (changeScore === 0) {
            return;
        }
        let gangScore = cc.instantiate(this.node.getChildByName("gang_score"));
        this.node.addChild(gangScore);
        this.infoNode.getChildByName("gold_num").getComponent(cc.Label).string = util.showNum2(score);
        if (changeScore > 0) {
            cc.find("plus/number", gangScore).getComponent(cc.Label).string = ""+(changeScore);
            gangScore.getChildByName("plus").active = true;
            gangScore.getChildByName("reduce").active = false;
        }
        else {
            cc.find("reduce/number", gangScore).getComponent(cc.Label).string = ""+(-changeScore);
            gangScore.getChildByName("reduce").active = true;
            gangScore.getChildByName("plus").active = false;
        }  
        let dst = {x : this.outX, y : this.outY};
        if (this.index === 0) {
            var score = Math.abs(changeScore);
            util.log("11111111111111111111  ===  score = "+score);
            
            if(score>=10000){
                dst.x -= 90;
            }else if(score>=1000){
                dst.x -= 60;
            }else if(score>=100){
                dst.x -= 40;
            }else if(score>=0){
                dst.x -= 30;
            }
            
            dst.y -= 90;
        }
        else if (this.index === 1) {
            dst.x += (this.halfWidth - 400);
        }
        else if (this.index === 2) {
            dst.x -= (this.halfWidth - 327);
        }       
        gangScore.x = dst.x - this.halfWidth*2;
        gangScore.y = dst.y;
        gangScore.opacity = config.maxOpacity;
        gangScore.active = true;
        gangScore.stopAllActions();
        gangScore.runAction(
            cc.sequence(
                cc.moveTo(0.5, dst.x, dst.y).easing(cc.easeIn(2.0)),
                cc.delayTime(1),
                cc.fadeTo(0.5, 0),
                cc.removeSelf()
            )
        );       
    },
    //所有手牌回到坐下位置
    setAllHandCardDownPos(){
        var handCard = this.cardNode.getChildByName("card_hand");
        for (var i = 0; i < this.handNowNum; i++) {
            var card = handCard.getChildByName("card_" + i);
            card.active = true;
            card.status = SITDOWN;
            card.isUp = false;
            card.scale = 1;
            card.isChiose = false;
            this.setHandPos(card, i,this.handNowNum);
        }
        for(var i = 0; i < GamePDKConfig.HAND_MAX; i++){
            var card = handCard.getChildByName("card_" + i);
            card.status = SITDOWN;
        }
    },
    checkUpPai(){
        if(this.handUpCardNum>0){
            this.game.setOpsBtn(true,true);
        }
    },
    //让某些牌站起来
    setUpPaiByPaiArr(tishiPai_arr){
        var cardHand = this.cardNode.getChildByName("card_hand");
        for(var i = 0 ;i < tishiPai_arr.length; i++){
            // for(var j = cardHand.children.length-1;j>=0;j--){
            //     if(cardHand.children[j].cardNumValue == tishiPai_arr[i]){
            //         var handCard = cardHand.children[j];
            //     }
            // }
            for(var j = this.handNowNum-1;j>=0;j--){
                var card = cardHand.getChildByName("card_"+j);
                if(card.cardNumValue == tishiPai_arr[i]){
                    var handCard = card;
                }
            }
            if (handCard.status === SITDOWN) {
                handCard.status = STANDUP;
                handCard.y += 30;
                handCard.isUp = true;
                this.handUpCardNum++;
                if(this.handUpCardNum>0 && this.game.getIsShowOps()){//有站起来的牌并且ops正在显示
                    this.game.setOpsBtn(true,true);
                }
            }
        }
    },
    // 点击头像响应
    onHeadClick (event) {
        util.log("----点击玩家头像响应");
        audioUtils.playClickSoundEffect();
        var self = this;
        util.loadPrefab("userInfo",function(data){
            if(util.isNodeExist(self.game.node,"userInfo")){
                util.log("userInfo已存在");
                return;
            }
            var userInfoNode = cc.instantiate(data);
            util.getInfoStatus(self.info.uid, function (respJsonInfo) {
                if(util.isNodeExist(self.game.node,"userInfo")){
                    util.log("userInfo已存在");
                    return;
                }
                if(respJsonInfo.code == "0"){
                    var msg = JSON.parse(respJsonInfo.msg)
                    userInfoNode.getComponent("userInfoScene").setUserInfoData(msg);
                    userInfoNode.getComponent("userInfoScene").setBg(2);
                    self.game.node.addChild(userInfoNode);
                }
                else{
                    util.error("respJsonInfo  === " + respJsonInfo);
                }
            }, self.info.uid, null);
        });
    },
    // 创建牌节点，为了减少进入游戏界面创 建的节点数，改为代码创建
    // index玩家位置，type手牌牌组牌堆，side正反面 1是反面 2是正面
    // 牌垛0 手牌1 牌组2 出牌3 牌堆4 结算5
    createCard (index, type, side) {//1506  先拿过来，再改
        var cardRes = GamePDKConfig.CARD_RES[index][type][side];
        if (cardRes.res === 0) {
            return null;
        }

        var card = cc.instantiate(this.game["card_" + cardRes.res]);
        card.scaleX = cardRes.cardScale;
        card.scaleY = cardRes.cardScale;
        var resSize = GamePDKConfig.RES_SIZE[cardRes.res];
        card.getComponent("GamePDKCard").setCardData(cardRes, resSize);
        return card;
    },
    // 点击手牌响应1430  （不用了）
    onCardClick (event) {
        var index = event.target.selIndex;
        util.log("GamePDKPlayer onCardClick " + index);
        // if (this.auto) {
        //     // 托管状态不允许动牌
        //     return;
        // }
        if (this.handStatus[index] === 0) {
            // 有已选中牌
    
            // 选中牌
            {
                // this.handStatus[index] = 1;
                // var card = cc.find("card_hand/card_" + index, this.cardNode);//index手排顺序从右到左0-15
                // card.isChiose = true;
                // this.setHandPos(card, index,this.handNowNum);
                // this.handUpCardNum++;
                // if(this.handUpCardNum>0 && this.game.getIsShowOps()){//有站起来的牌并且ops正在显示
                //     this.game.setOpsBtn(true,true);
                // }
            }
        }else{
            //取消选中
            // this.handStatus[index] = 0;
            // var card = cc.find("card_hand/card_" + index, this.cardNode);
            // card.isChiose = false;
            // this.handUpCardNum--;
            // if(this.game.getIsShowOps()){
            //     if(this.handUpCardNum>0){
            //         this.game.setOpsBtn(true,true);
            //     }else{
            //         this.game.setOpsBtn(true,false);
            //     }
            // }
            // this.setHandPos(card, index,this.handNowNum);
        }
        // else {
        //     // 出牌
        // }
    },
    //得到站起来的牌的value数组和idx数组
    getUpPaiValueArr(){
        this.handUpValue = [];
        this.handUpCard = [];
        var handCard = this.cardNode.getChildByName("card_hand");
        for (var i = 0; i < this.handNowNum; i++) {
            var card = handCard.getChildByName("card_" + i);
            if(card.isUp){
                this.handUpCard.push(i);//站起来的手排id,从右到左
                this.handUpValue.push(this.handValue[i]);//站起来的手牌牌值
            }
        }
        
        return {
            value : this.handUpValue,
            idx : this.handUpCard
        };
    },
    
    // 获取牌的尺寸，面对牌的长宽高1522
    getCardSize (index, type, side) {
        // 获取对应牌的资源id
        var cardRes = GamePDKConfig.CARD_RES[index][type][side];
        if (cardRes.res === 0) {
            return {
                length  :   0,
                width   :   0,
                height  :   0,
                scale   :   0,
            };
        }

        // 获取对应资源的尺寸
        var resSize = GamePDKConfig.RES_SIZE[cardRes.res];
        return {
            length  :   resSize.length*cardRes.cardScale,
            width   :   resSize.width*cardRes.cardScale,
            height  :   resSize.height*cardRes.cardScale,
            scale   :   cardRes.cardScale,
        }
    },
    //得到手牌位置和自身旋转角度
    getCardPosAndAngle(cardNum){
        // var desc = [];
        var dest = [];
        var firstAngle = 0;
        if(cardNum == GamePDKConfig.HAND_MAX){
            firstAngle = 78;
        }else if(cardNum == GamePDKConfig.HAND_MAX-1){//15
            firstAngle = 79;
        }else if(cardNum == GamePDKConfig.HAND_MAX-2){//14
            firstAngle = 80;
        }else if( cardNum >= GamePDKConfig.HAND_MAX-8 && cardNum <= GamePDKConfig.HAND_MAX-3){//13-8
            firstAngle = 81;
        }else if(cardNum == GamePDKConfig.HAND_MAX-9){//7
            firstAngle = 82;
        }else if(cardNum == GamePDKConfig.HAND_MAX-10){//6
            firstAngle = 84;
        }else if( cardNum >= GamePDKConfig.HAND_MAX-13 && cardNum <= GamePDKConfig.HAND_MAX-11){//5-3
            firstAngle = 86;
        }else if(cardNum == GamePDKConfig.HAND_MAX-14){//2
            firstAngle = 88;
        }else if(cardNum == GamePDKConfig.HAND_MAX-15){//1
            firstAngle = 90;
        }
        var handAngle = (90-firstAngle)*2;//手牌圆心角
        if(cardNum>1){
            var intervalAngle = handAngle/(cardNum-1);//间隔角度
        }else{
            var intervalAngle = 0;
        }
        

        for(var i = 0;i<cardNum;i++){
            dest.push({x : 0,y : 0,r : 0});
        }
        for(var i = 0;i<cardNum;i++){
        // for(var i = cardNum-1 ; i >= 0 ; i--){
            dest[i].x = GamePDKConfig.HAND_RADIUS * Math.cos((firstAngle+i*intervalAngle)/180*Math.PI);
            dest[i].y = GamePDKConfig.HAND_Y+GamePDKConfig.HAND_RADIUS * Math.sin((firstAngle+i*intervalAngle)/180*Math.PI);
            dest[i].r = 90 - (firstAngle+i*intervalAngle);
        }
        // if(dest.length)
        dest.reverse();
        return dest;
    },
    // 出牌音效
    playOutEffect (type,value, sex) {
        let url = "";
        // var res = "pdkGame/puke/"+type+"_" + GamePDKRule.getCard(value).value;
        var cardValue = GamePDKRule.getCard(value).value
        if(type == 15){//单牌
            if (sex) {
                url = "resources/sound/PdkGame/woman/w_danpai_"+cardValue+".mp3";
            }
            else {
                url = "resources/sound/PdkGame/man/m_danpai_"+cardValue+".mp3";
            }
        }else if(type == 16){//对牌
            if (sex) {
                url = "resources/sound/PdkGame/woman/w_danpai_"+cardValue+".mp3";
            }
            else {
                url = "resources/sound/PdkGame/man/m_duipai_"+cardValue+".mp3";
            }
        }else if(type == 6 || type == 7){//飞机带翅膀
            if (sex) {
                url = "resources/sound/PdkGame/woman/w_feijichibang.mp3";
            }
            else {
                url = "resources/sound/PdkGame/man/m_feijichibang.mp3";
            }
        }else if(type == 1){//炸弹
            if (sex) {
                url = "resources/sound/PdkGame/woman/w_bomb.mp3";
            }
            else {
                url = "resources/sound/PdkGame/man/m_bomb.mp3";
            }
        }else if(type == 3 || type == 4){//连队
            if (sex) {
                url = "resources/sound/PdkGame/woman/w_liandui.mp3";
            }
            else {
                url = "resources/sound/PdkGame/man/m_liandui.mp3";
            }
        }else if(type == 10 || type == 12){//连队
            if (sex) {
                url = "resources/sound/PdkGame/woman/w_sidaier.mp3";
            }
            else {
                url = "resources/sound/PdkGame/man/m_sidaier.mp3";
            }
        }else if(type == 5){//三顺
            if (sex) {
                url = "resources/sound/PdkGame/woman/w_sanshun.mp3";
            }
            else {
                url = "resources/sound/PdkGame/man/m_sanshun.mp3";
            }
        }else if(type == 2){//顺子
            if (sex) {
                url = "resources/sound/PdkGame/woman/w_shunzi.mp3";
            }
            else {
                url = "resources/sound/PdkGame/man/m_shunzi.mp3";
            }
        }else if(type == 9){//三带二
            if (sex) {
                url = "resources/sound/PdkGame/woman/w_sandaier.mp3";
            }
            else {
                url = "resources/sound/PdkGame/man/m_sandaier.mp3";
            }
        }else if(type == 8){//三带1
            if (sex) {
                url = "resources/sound/PdkGame/woman/w_sandaiyi.mp3";
            }
            else {
                url = "resources/sound/PdkGame/man/m_sandaiyi.mp3";
            }
        }
        audioUtils.playSFX(url);

        // let value = (cardValue - 1)%9 + 1;      // 123456789
        // let type = Math.ceil(cardValue/9);      // 1万2条3筒4字
        // // util.log("" + cardValue + "=" + value + ["万", "条", "筒", "字"][type - 1]);
        // let url = "";
        // if (type === 4) {
        //     // 字牌
        //     url = "" + (30 + value);
        // }
        // else {
        //     url = "" + value + ["wan", "tiao", "tong"][type - 1];
        // }
        // if (sex) {
        //     url = "resources/sound/game/woman/w" + url + ".mp3";
        // }
        // else {
        //     url = "resources/sound/game/man/m" + url + ".mp3";
        // }
        // util.log("播放音效="+url);
        // audioUtils.playSFX(url);
    },
    //初始化动作  停止动作
    initAction () {
        {
            // actPlayerMove
            this.infoNode.stopAllActions();
        }
        {
            // actShowHandCard
            this.cardNode.getChildByName("card_left").stopAllActions();
            this.cardNode.getChildByName("card_hand").stopAllActions();
        }
        {
            // OutCard
            if (this.handInit) {
                for (let i = 0; i < GamePDKConfig.HAND_MAX; i++) {
                    cc.find("card_hand/card_" + i, this.cardNode).stopAllActions();
                }
            }
        }
        // {
        //     // setOpAnim
        //     let anim = this.opAnim.getChildByName("anim");
        //     anim.getComponent(cc.Animation).stop("anim");
        //     anim.active = false;

        //     let sp = this.opAnim.getChildByName("sp");
        //     sp.stopAllActions();
        //     sp.active = false;
        // }
        // {
        //     // todo 杠分现结
        // }
        // {
        //     // actXiaPaoResult
        //     let xiapao = this.infoNode.getChildByName("xiapao");
        //     xiapao.stopAllActions();
        //     xiapao.active = false;
        // }
    },
    // update (dt) {},
    // 获取指定长度的名字 1715
    getNameByLength (oriString, oriLength) {
        let index = 0;
        let dstString = "";
        let dstLength = dstString.length;
        while ( index < oriString.length && dstLength < oriLength) {
            dstString += oriString[index];
            dstLength += (oriString.charCodeAt(index) < 256) ? 1 : 2;
            index++;
       }
       return dstString;
    },
});
