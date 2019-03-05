// 游戏玩家类，挂载在每个玩家节点上，创建所有牌

var GameConfig = require("GameConfig");

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

        // 牌组
        // 牌组数量
        opNumber : null,

        // 出牌
        // 出牌位置
        outX : null,
        outY : null,

        // 牌堆
        // 牌堆起始位置
        tableX : null,
        tableY : null,
        // 牌堆数量
        tableNumber : null,


        // 当前选中的牌
        selectIndex : null,
        // 是否轮到当前玩家出牌
        current : null,
        // 托管状态
        auto : null,

        // 癞子
        godValue : null,

        // 半个屏幕宽
        halfWidth : null,

    	// UI
    	// 玩家信息容器
    	infoNode : null,
        // 玩家牌容器
        cardNode : null,
        // 操作动画
        opAnim : null,
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
        //触摸时的touchId (用以解决多点触摸问题)
        touchID : null,
    },

    // 初始化，设置位置，只执行一次
    initPlayer (index, game) {
        // 位置
        this.index = index;
        this.game = game;
        this.infoNode = cc.find("player_info_bg", this.node);
        this.cardNode = cc.find("player_card_bg", this.node);
        this.opAnim = cc.find("op_anim", this.node);

        // 显示
        // 手牌只需要初始化一次
        this.handInit = false;
        this.halfWidth = this.game.node.width/2;

        // 计算牌的位置
        this.initCardPos();
        // 设置操作动画节点位置
        if (this.index === 0) {
            this.opAnim.x = this.outX;
            this.opAnim.y = this.outY - 50
        }
        else if (this.index === 1) {
            this.opAnim.x = this.outX + 200;
            this.opAnim.y = this.outY;
        }
        else if (this.index === 2) {
            this.opAnim.x = this.outX;
            this.opAnim.y = this.outY + 100;
        }
        else if (this.index === 3) {
            this.opAnim.x = this.outX - 200;
            this.opAnim.y = this.outY;
        }

        this.initEvent();
    },
    // 初始化计算麻将位置
    initCardPos () {
        // 轮盘尺寸
        var turn = cc.find("table/center/turn_bg", this.game.node);
        var turnX = turn.x;
        var turnY = turn.y;
        var turnHeight = turn.height*turn.scaleY;
        var turnWidth = turn.width*turn.scaleX;

        // 牌垛0 手牌1 牌组2 出牌3 牌堆4 结算5
        if (this.index === 0) {
            // 牌垛位置，从右向左
            {
                var leftSize = this.getCardSize(this.index, 0, 0);
                var leftShift = GameConfig.LEFT_SHIFT[this.index];
                this.leftX = turnX + leftShift.x + leftSize.width/2*(GameConfig.LEFT_MAX - 1);
                this.leftY = turnY + leftShift.y;
            }

            // 手牌
            {
                var handSize = this.getCardSize(this.index, 1, 0);
                var handShift = GameConfig.HAND_SHIFT[this.index];
                var beginX = turnX + handShift.x - handSize.width/2*GameConfig.HAND_MAX - GameConfig.HAND_SPACE[this.index]/2;
                var beginY = turnY + handShift.y;
                for (var i = 0; i < GameConfig.HAND_MAX; i++) {
                    this.handPos[GameConfig.HAND_MAX - 1 - i] = {
                        x : beginX + i*handSize.width,
                        y : beginY,
                    };
                }
                {
                    this.handPos[GameConfig.HAND_MAX] = {
                        x : 2*(turnX + handShift.x) - beginX,
                        y : beginY,
                    };
                }
            }

            // 出牌
            {
                var outShift = GameConfig.OUT_SHIFT[this.index];
                this.outX = turnX + outShift.x;
                this.outY = turnY + outShift.y;
            }

            // 牌堆，从左向右
            {
                var tableSize = this.getCardSize(this.index, 4, 0);
                this.tableX = turnX - tableSize.width/2*(GameConfig.TABLE_NUMBER[this.index] - 1);
                this.tableY = turnY - turnHeight/2 - tableSize.height/2 - GameConfig.TABLE_SPACE[this.index];
            }
        }
        else if (this.index === 1) {
            // 牌垛位置，从右向左
            {
                var leftSize = this.getCardSize(this.index, 0, 0);
                var leftShift = GameConfig.LEFT_SHIFT[this.index];
                this.leftX = turnX + leftShift.x;
                this.leftY = turnY + leftShift.y + leftSize.width/2*(GameConfig.LEFT_MAX - 1);
            }

            // 手牌
            {
                var handSize = this.getCardSize(this.index, 1, 0);
                var handShift = GameConfig.HAND_SHIFT[this.index];
                var beginX = turnX + handShift.x;
                var beginY = turnY + handShift.y - handSize.width/2*GameConfig.HAND_MAX - GameConfig.HAND_SPACE[this.index]/2;
                for (var i = 0; i < GameConfig.HAND_MAX; i++) {
                    this.handPos[GameConfig.HAND_MAX - 1 - i] = {
                        x : beginX,
                        y : beginY + i*handSize.width,
                    };
                }
                {
                    this.handPos[GameConfig.HAND_MAX] = {
                        x : beginX,
                        y : 2*(turnY + handShift.y) - beginY,
                    };
                }
            }

            // 出牌
            {
                var outShift = GameConfig.OUT_SHIFT[this.index];
                this.outX = turnX + outShift.x - this.halfWidth;
                this.outY = turnY + outShift.y;
            }

            // 牌堆，从左向右
            {
                var tableSize = this.getCardSize(this.index, 4, 0);
                this.tableX = turnX + turnWidth/2 + tableSize.height/2 + GameConfig.TABLE_SPACE[this.index] - this.halfWidth;
                this.tableY = turnY - tableSize.width/2*(GameConfig.TABLE_NUMBER[this.index] - 1);
            }
        }
        else if (this.index === 2) {
            // 牌垛位置，从右向左
            {
                var leftSize = this.getCardSize(this.index, 0, 0);
                var leftShift = GameConfig.LEFT_SHIFT[this.index];
                this.leftX = turnX + leftShift.x - leftSize.width/2*(GameConfig.LEFT_MAX - 1);
                this.leftY = turnY + leftShift.y;
            }

            // 手牌
            {
                var handSize = this.getCardSize(this.index, 1, 0);
                var handShift = GameConfig.HAND_SHIFT[this.index];
                var beginX = turnX + handShift.x + handSize.width/2*GameConfig.HAND_MAX + GameConfig.HAND_SPACE[this.index]/2;
                var beginY = turnY + handShift.y;
                for (var i = 0; i < GameConfig.HAND_MAX; i++) {
                    this.handPos[GameConfig.HAND_MAX - 1 - i] = {
                        x : beginX - i*handSize.width,
                        y : beginY,
                    };
                }
                {
                    this.handPos[GameConfig.HAND_MAX] = {
                        x : 2*(turnX + handShift.x) - beginX,
                        y : beginY,
                    };
                }
            }

            // 出牌
            {
                var outShift = GameConfig.OUT_SHIFT[this.index];
                this.outX = turnX + outShift.x;
                this.outY = turnY + outShift.y;
            }

            // 牌堆，从左向右
            {
                var tableSize = this.getCardSize(this.index, 4, 0);
                this.tableX = turnX + tableSize.width/2*(GameConfig.TABLE_NUMBER[this.index] - 1);
                this.tableY = turnY + turnHeight/2 + tableSize.height/2 + GameConfig.TABLE_SPACE[this.index];
            }
        }
        else if (this.index === 3) {
            // 牌垛位置，从右向左
            {
                var leftSize = this.getCardSize(this.index, 0, 0);
                var leftShift = GameConfig.LEFT_SHIFT[this.index];
                this.leftX = turnX + leftShift.x;
                this.leftY = turnY + leftShift.y - leftSize.width/2*(GameConfig.LEFT_MAX - 1);
            }

            // 手牌
            {
                var handSize = this.getCardSize(this.index, 1, 0);
                var handShift = GameConfig.HAND_SHIFT[this.index];
                var beginX = turnX + handShift.x;
                var beginY = turnY + handShift.y + handSize.width/2*GameConfig.HAND_MAX + GameConfig.HAND_SPACE[this.index]/2;
                for (var i = 0; i < GameConfig.HAND_MAX; i++) {
                    this.handPos[GameConfig.HAND_MAX - 1 - i] = {
                        x : beginX,
                        y : beginY - i*handSize.width,
                    };
                }
                {
                    this.handPos[GameConfig.HAND_MAX] = {
                        x : beginX,
                        y : 2*(turnY + handShift.y) - beginY,
                    };
                }
            }

            // 出牌
            {
                var outShift = GameConfig.OUT_SHIFT[this.index];
                this.outX = turnX + outShift.x + this.halfWidth;
                this.outY = turnY + outShift.y;
            }

            // 牌堆，从左向右
            {
                var tableSize = this.getCardSize(this.index, 4, 0);
                this.tableX = turnX - turnWidth/2 - tableSize.height/2 - GameConfig.TABLE_SPACE[this.index] + this.halfWidth;
                this.tableY = turnY + tableSize.width/2*(GameConfig.TABLE_NUMBER[this.index] - 1);
            }
        }
    },
    // 添加监听事件
    initEvent () {
        // 玩家快捷语聊天
        this.game.event.on("chat_quick_"+this.index, this.showChatQuick, this);
    },
    // 移除监听事件
    removeEvent () {
        if (!this.game) {
            return;
        }
        // 玩家快捷语聊天
        this.game.event.off("chat_quick_"+this.index, this.showChatQuick, this);
    },
    // 每局开始刷新状态
    initGame () {
        util.log("玩家"+this.index+"每局初始化");
        // 牌
        // 牌垛
        this.cardNode.getChildByName("card_left").removeAllChildren();
        // 手牌
        this.setHandCard([], 0);
        // 摸牌
        this.setExtraCard(false);
        // 结算
        this.setResultCard([], 0);
        // 托管
        this.setAuto();
        // 牌组
        for (let i = 0; i < 4; i++) {
            cc.find("card_op/op_" + i, this.cardNode).removeAllChildren();
        }
        this.opNumber = 0;
        // 牌堆
        this.cardNode.getChildByName("card_table").removeAllChildren();
        this.tableNumber = 0;
        // 下跑
        this.infoNode.getChildByName("xiapao").active = false;

        // 信息
        // 玩家信息数据
        // this.setPlayerData();
        // 玩家信息UI
        this.refreshInfoUI();
        // 节点初始位置
        this.setInfoStartPos();
        // 设置听牌箭头
        this.setTingArrow();
    },
    // 设置玩家数据
    setPlayerData (data) {
        if (data) {
            this.info = data;
        }
        else {
            this.info = null;
        }
    },
    // 刷新界面
    refreshInfoUI () {
        // 不显示玩家不刷新
        if (!this.node.active) {
            return;
        }
        if (this.info) {
            if (this.index !== 0) {
                cc.find("head/frame", this.infoNode).active = false;
            }
            util.loadSprite("hall/bag/prop/"+this.info.headFrame, cc.find("head/frame", this.infoNode), function (node) {
                node.active = true;
            });
            if (this.index !== 0) {
                cc.find("head/sp", this.infoNode).active = false;
            }
            sdk.getPlayerHead(this.info.headImage, cc.find("head/sp", this.infoNode), function (node) {
                node.active = true;
            });
            this.infoNode.getChildByName("nickname").getComponent(cc.Label).string = this.getNameByLength(decodeURIComponent(this.info.nickname), 8);
            this.refreshMoney();

            // 初始化手牌，进入游戏场景，玩家第一次进桌时创建
            if (!this.handInit) {
                this.handInit = true;
                var handCard = this.cardNode.getChildByName("card_hand");
                for (var i = 0; i <= GameConfig.HAND_MAX; i++) {
                    var card = this.createCard(this.index, 1, 0);
                    card.name = "card_" + i;
                    card.active = false;
                    handCard.addChild(card, GameConfig.HAND_ZORDER[this.index][i]);
                }
                this.addCardListener();
            }
            this.infoNode.active = true;
        }
        else {
            // 设置玩家不显示
            cc.find("head/frame", this.infoNode).active = false;
            cc.find("head/sp", this.infoNode).active = false;
            this.infoNode.getChildByName("nickname").getComponent(cc.Label).string = "";
            this.infoNode.getChildByName("gold_num").getComponent(cc.Label).string = "";
            this.infoNode.active = false;
        }
        // 设置庄家显示
        this.setZhuang(false);
        // 准备，单独设置，根据消息显示
        this.setReady(false);
        // 设置房主显示
        this.setOwner(false);
    },
    // 刷新财富
    refreshMoney () {
        if (gameData.kindId === config.KIND_MATE) {
            // 豆
            this.infoNode.getChildByName("gold_num").getComponent(cc.Label).string = util.showNum3(this.info.score);
            util.loadSprite("game/player_gold_icon", this.infoNode.getChildByName("gold_icon"));
        }
        else if (gameData.kindId === config.KIND_FRIEND) {
            // 分
            // this.infoNode.getChildByName("gold_num").getComponent(cc.Label).string = util.showNum3(this.info.score);
            this.infoNode.getChildByName("gold_num").getComponent(cc.Label).string = this.info.score;           
            util.loadSprite("game/player_score_icon", this.infoNode.getChildByName("gold_icon"));
        }
    },
    // 绑定牌的按钮响应
    addCardListener () {
        if (this.index === 0) {
            // 只需要绑定玩家自己的牌
            var handCard = this.cardNode.getChildByName("card_hand");
            // handCard.setLocalZOrder(100);
            // this.game.node.on("touchstart", this.touchStart_1, this);
            // this.game.node.on("touchmove", this.touchMove_1, this);
            // this.game.node.on("touchend", this.touchEnd_1, this);
            // this.game.node.on("touchcancel", this.touchCancel_1, this);
            for (var i = 0; i <= GameConfig.HAND_MAX; i++) {
                var card = handCard.getChildByName("card_" + i);
                // util.addClickEvent(card, this.node, "GamePlayer", "onCardClick", i);
                card.on("touchstart", this.touchStart, this);
                card.on("touchmove", this.touchMove, this);
                card.on("touchend", this.touchEnd, this);
                card.on("touchcancel", this.touchCancel, this);
            }
        }
    },
    touchStart_1 (event) {
        if (this.auto || this.game.isDisconnect) {
            return;
        }
        var handCard = this.cardNode.getChildByName("card_hand");
        for (var i = 0; i <= GameConfig.HAND_MAX; i++) {
            var card = handCard.getChildByName("card_" + i);
            var touchPoint = card.convertTouchToNodeSpace(event.touch);
            var cardSize = card.getContentSize();
            var cardRect = cc.rect(0, 0, cardSize.width, cardSize.height);
            if (cc.rectContainsPoint(cardRect, touchPoint)) {
                //将选中牌的Z值设为手牌中最大
                // card.setLocalZOrder(15);
                // card.setSiblingIndex(1);
                //记录手牌索引
                this.selectIndex = i;
                //记录初始点击的位置
                this.touchStartPoint = handCard.convertTouchToNodeSpace(event.touch);
                //记录麻将牌初始位置
                this.previousCardPos = cc.p( card.getPosition() );
                this.isTouchMove = false;
            }
        }
        util.log("hunter---touchStart");
    },
    touchMove_1 (event) {
        if (!this.current || this.game.isDisconnect) {
            return;
        }
        var handCard = this.cardNode.getChildByName("card_hand");
        var card = handCard.getChildByName("card_" + this.selectIndex);
        var touchPoint = handCard.convertTouchToNodeSpace(event.touch);
        var distance = cc.pDistanceSQ(this.touchStartPoint, handCard.convertTouchToNodeSpace(event.touch))
        if (distance > 400) {
            card.setPosition(touchPoint);
            card.setLocalZOrder(100);
            this.isTouchMove = true; 
        }
        util.log("hunter---touchMove");
    },
    touchEnd_1 (event) {
        if (this.auto || this.game.isDisconnect) {
            return;
        }
        var isShowCard = false;
        var handCard = this.cardNode.getChildByName("card_hand");
        var card = handCard.getChildByName("card_" + this.selectIndex);
        var distance = Math.sqrt(cc.pDistanceSQ(this.touchStartPoint, handCard.convertTouchToNodeSpace(event.touch))) ;
        var deltaY = handCard.convertTouchToNodeSpace(event.touch).y - this.touchStartPoint.y;
        util.log("hunter---移动距离：" + distance + "  Y轴偏移量：" + deltaY);
        util.log("hunter---是否触发移动：" + this.isTouchMove);
        //在Y轴方向移动距离大于100，出牌
        if (cc.pDistanceSQ(this.touchStartPoint, handCard.convertTouchToNodeSpace(event.touch)) > 400) {
            if (deltaY > 90) {
                isShowCard = true;
            } else {
                //松手之后，放回原位
                card.setPosition(this.previousCardPos);
                card.setLocalZOrder(GameConfig.HAND_ZORDER[this.index][this.selectIndex]);
            } 
        } else {
            //牌没有移动，但构成了click点击操作
            if (card !== this.previousClickCard) {
                //新点击一张牌，将点击的牌上移
                var currentCardPos = cc.p(card.getPosition());
                var moveAction = cc.moveTo(0, cc.p(currentCardPos.x, currentCardPos.y + GameConfig.HAND_SELECT));
                card.runAction(moveAction);
                //如果之前点击过另外一张牌，将其下移复位
                if( this.previousClickCard) {
                    var previousClickCardPos = cc.p(this.previousClickCard.getPosition());
                    var moveAction = cc.moveTo(0, cc.p(previousClickCardPos.x, previousClickCardPos.y - GameConfig.HAND_SELECT));
                    this.previousClickCard.runAction(moveAction);
                }
                this.previousClickCard = card;
                //显示听牌提示
                this.game.setTingPop(this.handValue[this.selectIndex], false);
            } else if (card === this.previousClickCard) {
                //本次点击的牌是之前点击过的牌  判断双击
                if (this.current) {
                    //轮到玩家出牌
                    isShowCard = true;
                } else {
                    //不轮到玩家出牌，再次点击，将牌复位
                    var previousClickCardPos = cc.p(this.previousClickCard.getPosition());
                    var moveAction = cc.moveTo(0, cc.p(previousClickCardPos.x, previousClickCardPos.y - GameConfig.HAND_SELECT));
                    this.previousClickCard.runAction(moveAction);  
                }
                this.previousClickCard = null; 
            } 
        }
        //isShowCard为true,出牌
        if (isShowCard) {
            this.game.sendGameOutCard(this.selectIndex, this.handValue[this.selectIndex]);
            // this.previousClickCard = null;
            // 隐藏听牌提示
            this.game.setTingPop();
            // 刷新听牌箭头
            this.setTingArrow(this.game.tingData);
        }
        util.log("hunter---touchEnd");

    },  
    touchCancel_1 (event) {

    },

    touchStart (event) {
        if (this.auto || this.game.isDisconnect) {
            return;
        }
        //屏蔽多点触控的判断
        if (this.touchID && (event.getID() !== this.touchID - 1)) {
            return;
        }
        var handCard = this.cardNode.getChildByName("card_hand");
        for (var i = 0; i <= GameConfig.HAND_MAX; i++) {
            var card = handCard.getChildByName("card_" + i);
            var touchPoint = card.convertTouchToNodeSpace(event.touch);
            var cardSize = card.getContentSize();
            var cardRect = cc.rect(0, 0, cardSize.width, cardSize.height);
            if (cc.rectContainsPoint(cardRect, touchPoint)) {
                //将选中牌的Z值设为手牌中最大
                // card.setLocalZOrder(15);
                // card.setSiblingIndex(1);
                //记录手牌索引
                this.selectIndex = i;
                //记录初始点击的位置
                this.touchStartPoint = handCard.convertTouchToNodeSpace(event.touch);
                //记录麻将牌初始位置
                this.previousCardPos = cc.p( card.getPosition() );
                this.isTouchMove = false;
                this.touchID = event.getID()+1;
            }
        }
        util.log("hunter---touchStart---touchID: " + event.getID());
        util.log
    },
    touchMove (event) {
        if (!this.current || this.game.isDisconnect) {
            return;
        }
        //屏蔽多点触控的判断
        if (this.touchID && (event.getID() !== this.touchID - 1)) {
            return;
        }

        var handCard = this.cardNode.getChildByName("card_hand");
        var card = handCard.getChildByName("card_" + this.selectIndex);
        var touchPoint = handCard.convertTouchToNodeSpace(event.touch);
        var distance = cc.pDistanceSQ(this.touchStartPoint, handCard.convertTouchToNodeSpace(event.touch))
        if (distance > 400) {
            card.setPosition(touchPoint);
            card.setLocalZOrder(100);
            this.isTouchMove = true; 
        }
        util.log("hunter---touchMovetouchID: " + event.getID());
    },
    touchEnd (event) {
        if (this.auto || this.game.isDisconnect) {
            return;
        }
        //屏蔽多点触控的判断
        if (this.touchID && (event.getID() !== this.touchID - 1)) {
            return;
        }
        var isShowCard = false;
        var handCard = this.cardNode.getChildByName("card_hand");
        var card = handCard.getChildByName("card_" + this.selectIndex);
        var distance = Math.sqrt(cc.pDistanceSQ(this.touchStartPoint, handCard.convertTouchToNodeSpace(event.touch))) ;
        var deltaY = handCard.convertTouchToNodeSpace(event.touch).y - this.touchStartPoint.y;
        util.log("hunter---移动距离：" + distance + "  Y轴偏移量：" + deltaY);
        util.log("hunter---是否触发移动：" + this.isTouchMove);
        //在Y轴方向移动距离大于100，出牌
        if (cc.pDistanceSQ(this.touchStartPoint, handCard.convertTouchToNodeSpace(event.touch)) > 400) {
            if (deltaY > 90) {
                isShowCard = true;
            } else {
                //松手之后，放回原位
                card.setPosition(this.previousCardPos);
                card.setLocalZOrder(GameConfig.HAND_ZORDER[this.index][this.selectIndex]);
            } 
        } else {
            //牌没有移动，但构成了click点击操作
            if (card !== this.previousClickCard) {
                //新点击一张牌，将点击的牌上移
                var currentCardPos = cc.p(card.getPosition());
                var moveAction = cc.moveTo(0, cc.p(currentCardPos.x, currentCardPos.y + GameConfig.HAND_SELECT));
                card.runAction(moveAction);
                //如果之前点击过另外一张牌，将其下移复位
                if( this.previousClickCard) {
                    var previousClickCardPos = cc.p(this.previousClickCard.getPosition());
                    var moveAction = cc.moveTo(0, cc.p(previousClickCardPos.x, previousClickCardPos.y - GameConfig.HAND_SELECT));
                    this.previousClickCard.runAction(moveAction);
                }
                this.previousClickCard = card;
                //显示听牌提示
                this.game.setTingPop(this.handValue[this.selectIndex], false);
            } else if (card === this.previousClickCard) {
                //本次点击的牌是之前点击过的牌  判断双击
                if (this.current) {
                    //轮到玩家出牌
                    isShowCard = true;
                } else {
                    //不轮到玩家出牌，再次点击，将牌复位
                    var previousClickCardPos = cc.p(this.previousClickCard.getPosition());
                    var moveAction = cc.moveTo(0, cc.p(previousClickCardPos.x, previousClickCardPos.y - GameConfig.HAND_SELECT));
                    this.previousClickCard.runAction(moveAction);  
                }
                this.previousClickCard = null; 
            } 
        }
        //isShowCard为true,出牌
        if (isShowCard) {
            this.game.sendGameOutCard(this.selectIndex, this.handValue[this.selectIndex]);
            // this.previousClickCard = null;
            // 隐藏听牌提示
            this.game.setTingPop();
            // 刷新听牌箭头
            this.setTingArrow(this.game.tingData);
        }
        this.touchID = null;
        util.log("hunter---touchEndtouchID: " + event.getID());

    }, 
    touchCancel (event) {

    },
    // 设置庄家显示
    setZhuang (flag) {
        this.infoNode.getChildByName("zhuang").active = !!flag;
    },
    // 设置房主显示
    setOwner (flag) {
        cc.find("head/owner", this.infoNode).active = !!flag;
    },
    // 设置准备
    setReady (flag) {
        this.infoNode.getChildByName("ready").active = !!flag;
    },
    // 设置初始位置
    setInfoStartPos () {
        if (this.index === 0) {
            this.infoNode.x = 0;
            this.infoNode.y = -150;
        }
        else if (this.index === 1) {
            this.infoNode.x = 207 - this.halfWidth;
            this.infoNode.y = 28;
        }
        else if (this.index === 2) {
            this.infoNode.x = 0;
            this.infoNode.y = 225;
        }
        else if (this.index === 3) {
            this.infoNode.x = this.halfWidth - 207;
            this.infoNode.y = 28;
        }
    },
    // 设置听牌箭头
    setTingArrow (data) {
        if (!this.handInit) {
            // 初始化时，没有创建手牌对象
            util.error("没有创建手牌");
            return;
        }
        if (this.index === 0) {
            // 只有玩家自己显示听牌箭头
            let handCard = this.cardNode.getChildByName("card_hand");
            if (!data) {
                for (let i = 0; i <= GameConfig.HAND_MAX; i++) {
                    handCard.getChildByName("card_" + i).getChildByName("ting_arrow").active = false;
                }
            }
            else {
                for (let i = 0; i < this.handValue.length; i++) {
                    if (data[this.handValue[i]]) {
                        handCard.getChildByName("card_" + i).getChildByName("ting_arrow").active = true;
                    }
                    else {
                        handCard.getChildByName("card_" + i).getChildByName("ting_arrow").active = false;
                    }
                }
            }
        }
    },
    // 设置玩家掉线
    setOffline (flag) {
        cc.find("head/offline", this.infoNode).active = !!flag;
    },



    // 动作
    // 开场玩家头像
    actPlayerMove (callback) {
        // 信息
        this.infoNode.stopAllActions();
        //适配刘海屏
        var isNotch = util.isNotchPhone(gameData.FrameWidth,gameData.FrameHeight);
        if (isNotch) {
            var dest = [
                {x : 80 - this.halfWidth + 75, y : -180},
                {x : -53, y : -25},
                {x : 355, y : 295},
                {x : 53 + 60, y : 72}
            ][this.index];
        } else {
            var dest = [
                {x : 80 - this.halfWidth, y : -180},
                {x : -53, y : -25},
                {x : 355, y : 295},
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
    // 牌垛
    actShowLeftCard (callback) {
        // 牌垛从右向左
        var leftCard = this.cardNode.getChildByName("card_left");
        var leftSize = this.getCardSize(this.index, 0, 1);

        if (this.index === 0) {
            leftCard.scaleY = 1;
            leftCard.y = this.leftY;
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < GameConfig.LEFT_MAX; j++) {
                    var name = "" + (i*GameConfig.LEFT_MAX + j);
                    var card_old = leftCard.getChildByName(name);
                    if (card_old) {
                        card_old.removeFromParent();
                    }
                    var card_new = this.createCard(this.index, 0, 1);
                    card_new.x = this.leftX - leftSize.width*j;// - i*5;
                    card_new.y = i*leftSize.height;//i*15;
                    card_new.name = name;
                    leftCard.addChild(card_new, i*GameConfig.LEFT_MAX + j + GameConfig.LEFT_MAX);
                }
            }
        }
        else if (this.index === 1) {
            leftCard.scaleX = 1;
            leftCard.x = this.leftX;
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < GameConfig.LEFT_MAX; j++) {
                    var name = "" + (i*GameConfig.LEFT_MAX + j);
                    var card = leftCard.getChildByName(name);
                    if (card) {
                        card.removeFromParent();
                    }
                    card = this.createCard(this.index, 0, 1);
                    // card.x = i*3;
                    card.y = this.leftY - leftSize.width*j + i*leftSize.height;// + i*15;
                    card.name = name;
                    leftCard.addChild(card, i*GameConfig.LEFT_MAX + j + GameConfig.LEFT_MAX);
                }
            }
        }
        else if (this.index === 2) {
            leftCard.scaleY = 1;
            leftCard.y = this.leftY;
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < GameConfig.LEFT_MAX; j++) {
                    var name = "" + (i*GameConfig.LEFT_MAX + j);
                    var card = leftCard.getChildByName(name);
                    if (card) {
                        card.removeFromParent();
                    }
                    card = this.createCard(this.index, 0, 1);
                    card.x = this.leftX + leftSize.width*j;// + i*5;
                    card.y = i*leftSize.height;//i*15;
                    card.name = name;
                    leftCard.addChild(card, i*GameConfig.LEFT_MAX + j + GameConfig.LEFT_MAX);
                }
            }
        }
        else if (this.index === 3) {
            leftCard.scaleX = 1;
            leftCard.x = this.leftX;
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < GameConfig.LEFT_MAX; j++) {
                    var name = "" + (i*GameConfig.LEFT_MAX + j);
                    var card = leftCard.getChildByName(name);
                    if (card) {
                        card.removeFromParent();
                    }
                    card = this.createCard(this.index, 0, 1);
                    // card.x = - i*3;
                    card.y = this.leftY + leftSize.width*j + i*leftSize.height;// + i*15;
                    card.name = name;
                    leftCard.addChild(card, i*GameConfig.LEFT_MAX - j + GameConfig.LEFT_MAX);
                }
            }
        }
        leftCard.opacity = config.maxOpacity;

        if (callback) {
            callback(this);
        }
    },
    // 牌垛消失，手牌出现
    actShowHandCard (callback) {
        var leftCard = this.cardNode.getChildByName("card_left");
        leftCard.stopAllActions();
        var scaleX = [1, 0, 1, 0][this.index];
        var scaleY = [0, 1, 0, 1][this.index];
        if (this.index === 0) {
            leftCard.runAction(
                cc.spawn(
                    cc.scaleTo(0.15, scaleX, scaleY),
                    cc.fadeTo(0.15, 0),
                    cc.sequence(
                        cc.moveBy(0.05, 0, -30),
                        cc.moveBy(0.05, 0, 50)
                    ),
                    cc.sequence(
                        cc.delayTime(0.08),
                        cc.callFunc(function () {
                            if (this.index === 0) {
                                var handCard = this.cardNode.getChildByName("card_hand");
                                handCard.y = -150;
                                handCard.stopAllActions();
                                handCard.runAction(
                                    cc.moveTo(0.2, 0, 0)
                                );
                            }
                            if (callback) {
                                callback(this);
                            }
                        }, this)
                    )
                )
            );
        }
        else {
            leftCard.runAction(
                cc.spawn(
                    cc.scaleTo(0.15, scaleX, scaleY),
                    cc.fadeTo(0.15, 0),
                    cc.sequence(
                        cc.delayTime(0.08),
                        cc.callFunc(function () {
                            if (this.index === 0) {
                                var handCard = this.cardNode.getChildByName("card_hand");
                            }
                            if (callback) {
                                callback(this);
                            }
                        }, this)
                    )
                )
            );
        }
    },



    // 设置手牌，cardArray手牌值数组，cardNum手牌数量
    setHandCard (cardArray, cardNum, extraValue) {
        if (!this.handInit) {
            // 初始化时，没有创建手牌对象
            util.error("没有创建手牌");
            return;
        }
        if (this.index === 0) {
            // 手牌排序
            this.sortHandCard(cardArray, cardNum);
            //重新排列手牌时，将点击选中的牌清空
            this.previousClickCard = null;
        }
        // 计算牌组和手牌的数量，每个牌组算三张，总数量为十四时，需要占用摸牌位置
        var totalNumber = this.opNumber*3 + cardNum;
        var value = null;
        if (totalNumber === 14) {
            value = -1;
            // 需要拿出一张，放在摸牌位置
            if (this.index === 0) {
                // 是否删除了指定牌
                let flag = false;
                if (extraValue && extraValue !== 0) {
                    // 指定了摸牌值
                    value = extraValue;
                    // 从手牌中删除摸牌值
                    for (let i = 0; i < cardNum; i++) {
                        if (cardArray[i] === extraValue) {
                            cardArray.splice(i, 1);
                            flag = true;
                            break;
                        }
                    }
                }
                if (!flag) {
                    value = cardArray.shift();
                }
            }
            cardNum--;
        }
        if (this.index === 0) {
            // 玩家自己
            // 设置选中牌
            this.selectIndex = -1;
            // 设置手牌值
            this.handValue = [];
            // 设置手牌显示
            var handCard = this.cardNode.getChildByName("card_hand");
            for (var i = 0; i < cardNum; i++) {
                var card = handCard.getChildByName("card_" + i);
                this.handStatus[i] = 0;
                this.handValue[i] = cardArray[i];
                this.setCardValue(card, cardArray[i]);
                this.setHandPos(card, i);
                card.active = true;
            }
            for (var i = cardNum; i < GameConfig.HAND_MAX; i++) {
                var card = handCard.getChildByName("card_" + i);
                card.active = false;
            }
        }
        else {
            // 其他玩家
            var handCard = this.cardNode.getChildByName("card_hand");
            for (var i = 0; i < cardNum; i++) {
                var card = handCard.getChildByName("card_" + i);
                this.setHandPos(card, i);
                card.active = true;
            }
            for (var i = cardNum; i < GameConfig.HAND_MAX; i++) {
                var card = handCard.getChildByName("card_" + i);
                card.active = false;
            }
        }
        if (value) {
            this.setExtraCard(true, value);
        }
    },
    // 手牌排序
    sortHandCard (cardArray, cardNum) {
        if (this.godValue) {
            // 有癞子，癞子在后面
            var that = this;
            cardArray.sort(function (a, b) {
                // 癞子放最后
                if (a === that.godValue) {
                    return 1;
                }
                else if (b === that.godValue) {
                    return -1;
                }
                else {
                    return b - a;
                }
            });
        }
        else {
            // 没有癞子，正常排序
            cardArray.sort(function (a, b) {
                return b - a;
            });
        }
    },
    // 设置单张牌，card牌对象
    setCardValue (card, value) {
        // 数据组件
        var gameCard = card.getComponent("GameCard");
        // 渲染组件
        var cardValue = card.getChildByName("value");
        if (cardValue) {
            var res = "game/card/" + 3 + "_" + value;
            util.loadSprite(res, cardValue, function () {
                cardValue.rotation = gameCard.valueRotation;
                cardValue.scaleX = gameCard.valueScaleX;
                cardValue.scaleY = gameCard.valueScaleY;
            });
        }

        var god = card.getChildByName("god");
        if (god) {
            if (this.godValue && this.godValue === value && god) {
                // 临时
                if (gameData.mapId === config.HENAN_TUIDAOHU) {
                    god.getChildByName("god_text_1001").active = true;
                    god.getChildByName("god_text_1101").active = false;
                }
                else {
                    god.getChildByName("god_text_1001").active = false;
                    god.getChildByName("god_text_1101").active = true;
                }
                god.active = true;
            }
            else {
                god.active = false;   
            }
        }
    },
    // 设置牌的位置，card牌对象，index牌下标
    setHandPos (card, index) {
        var pos = this.handPos[index];
        card.x = pos.x;
        if (this.index === 0 && this.handStatus[index] === 1) {
            card.y = pos.y + GameConfig.HAND_SELECT;
        }
        else {
            card.y = pos.y;
        }
    },

    // 设置摸牌，show是否显示摸牌，value摸牌值
    setExtraCard (show, value) {
        util.log("------------玩家"+this.index+"设置摸牌 show="+show+" value="+value);
        if (!this.handInit) {
            // 初始化时，没有创建手牌对象
            util.error("没有创建手牌");
            return;
        }
        var card = cc.find("card_hand/card_" + GameConfig.HAND_MAX, this.cardNode);
        if (show) {
            // 显示摸牌
            if (this.index === 0) {
                // 玩家自己
                util.log("------------玩家自己摸牌");
                this.handStatus[GameConfig.HAND_MAX] = 0;
                this.handValue[GameConfig.HAND_MAX] = value;
                this.setCardValue(card, value);
                this.setHandPos(card, GameConfig.HAND_MAX);
                card.active = true;
                util.log("------------玩家摸牌位置 x="+card.x+" y="+card.y);
            }
            else {
                // 其他玩家
                this.setHandPos(card, GameConfig.HAND_MAX);
                card.active = true;
            }
        }
        else {
            // 隐藏摸牌
            card.active = false;
        }
    },
    
    // 设置癞子
    setGodValue (value) {
        this.godValue = value;
    },

    // 设置玩家显示，三人游戏，不显示第四个玩家
    setPlayerShow (flag) {
        this.node.active = !!flag;
    },

    // 出牌，value出牌牌值，index出牌下标，callback出完牌回调
    OutCard (value, index, callback) {
        // 回调使用，保存当前值
        var curNumber = this.tableNumber;
        this.tableNumber++;
        if (this.index === 0) {
            if (this.handValue[index] === value) {
                // 出牌效果
                util.log("GamePlayer OutCard 出牌 index="+index+" value="+value);

                // 音效
                this.playOutEffect(value, this.info.sex);

                // 手牌
                var handCard = cc.find("card_hand/card_" + index, this.cardNode);
                var handCardScale = handCard.getComponent("GameCard").cardScale;
                // 牌堆
                var dest = this.getTableCardPos(curNumber);
                var tableCard = this.createCard(0, 4, 0);
                tableCard.x = dest.x;
                tableCard.y = dest.y;
                this.setCardValue(tableCard, value);
                tableCard.name = "" + curNumber;
                tableCard.active = false;
                let cardTable = this.cardNode.getChildByName("card_table");
                cardTable.addChild(tableCard, dest.zorder);

                // 显示之前的所有手牌
                for (let i = 0; i < curNumber; i++) {
                    let card = cardTable.getChildByName("" + i);
                    if (card) {
                        card.active = true;
                    }
                }

                let outCardScale = this.getCardSize(this.index, 3, 0).scale;
                handCard.stopAllActions();
                handCard.setLocalZOrder(GameConfig.HAND_MAX + 1);
                handCard.runAction(
                    cc.sequence(
                        cc.spawn(
                            cc.moveTo(0.2, this.outX, this.outY),
                            cc.scaleTo(0.2, outCardScale, outCardScale)
                        ),
                        cc.delayTime(0.4),
                        cc.callFunc(function() {
                            audioUtils.playSFX("resources/sound/game/effect/out_card.mp3");
                            tableCard.active = true;
                            handCard.active = false;
                            handCard.setLocalZOrder(GameConfig.HAND_ZORDER[this.index][index]);
                            handCard.scaleX = handCardScale;
                            handCard.scaleY = handCardScale;
                            // 指示
                            this.setOutTip(tableCard);

                            if (callback) {
                                callback();
                            }
                        }, this)
                    )
                );
            }
            else {
                // 错了
                util.error("GamePlayer OutCard 出错牌了 index="+index+" value="+value+" origin="+this.handValue[index]);
            }
        }
        else {
            // 音效
            this.playOutEffect(value, this.info.sex);
            // 其他玩家从摸牌位置出牌
            var handCard = cc.find("card_hand/card_" + GameConfig.HAND_MAX, this.cardNode);
            // 创建出牌
            var outCard = this.createCard(this.index, 3, 0);
            var outCardScale = outCard.getComponent("GameCard").cardScale;
            this.setCardValue(outCard, value);
            outCard.x = handCard.x;
            outCard.y = handCard.y;
            outCard.scaleX = 0;
            outCard.scaleY = 0;
            this.cardNode.addChild(outCard);
            // 创建牌堆
            var tableCard = this.createCard(this.index, 4, 0);
            var dest = this.getTableCardPos(curNumber);
            tableCard.x = dest.x;
            tableCard.y = dest.y;
            this.setCardValue(tableCard, value);
            tableCard.name = "" + curNumber;
            tableCard.active = false;
            let cardTable = this.cardNode.getChildByName("card_table");
            cardTable.addChild(tableCard, dest.zorder);

            // 显示之前的所有手牌
            for (let i = 0; i < curNumber; i++) {
                let card = cardTable.getChildByName("" + i);
                if (card) {
                    card.active = true;
                }
            }

            handCard.active = false;
            outCard.stopAllActions();
            outCard.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.scaleTo(0.4, outCardScale, outCardScale),
                        cc.moveTo(0.4, this.outX, this.outY)
                    ),
                    cc.delayTime(0.4),
                    cc.callFunc(function () {
                        audioUtils.playSFX("resources/sound/game/effect/out_card.mp3");
                        tableCard.active = true;
                        this.setOutTip(tableCard);
                        if (callback) {
                            callback();
                        }
                    }, this),
                    cc.removeSelf()
                )
            );
        }
    },
    // 计算牌堆中牌的位置，number牌堆中牌的数量
    getTableCardPos (number) {
        var tableNumber = GameConfig.TABLE_NUMBER[this.index];
        var tableLine = GameConfig.TABLE_LINE[this.index]
        // 第几行[0
        var i = Math.floor(number/tableNumber);
        // 第几列[0
        var j = number%tableNumber;
        // 第几层[0
        var k = Math.floor(i/tableLine);
        i = i%tableLine;

        // 计算第number张牌的位置
        var tableSize = this.getCardSize(this.index, 4, 0);

        if (this.index === 0) {
            return {
                x : this.tableX + j*tableSize.width,
                y : this.tableY - i*tableSize.length + k*tableSize.height,
                zorder : i*tableNumber + j +  k*tableNumber*tableLine + GameConfig.TABLE_MAX,
            };
        }
        else if (this.index === 1) {
            return {
                x : this.tableX + i*tableSize.length,
                y : this.tableY + j*tableSize.width + k*tableSize.height,
                zorder : i*tableNumber - j +  k*tableNumber*tableLine + GameConfig.TABLE_MAX,
            };
        }
        else if (this.index === 2) {
            return {
                x : this.tableX - j*tableSize.width,
                y : this.tableY + i*tableSize.length + k*tableSize.height,
                zorder : - i*tableNumber + j +  k*tableNumber*tableLine + GameConfig.TABLE_MAX,
            };
        }
        else if (this.index === 3) {
            return {
                x : this.tableX - i*tableSize.length,
                y : this.tableY - j*tableSize.width + k*tableSize.height,
                zorder : i*tableNumber + j +  k*tableNumber*tableLine + GameConfig.TABLE_MAX,
            };
        }
    },

    // 显示吃牌
    setChiCard (action) {
        // 动画音效
        if (action) {
            this.playOpEffect("chi", this.info.sex);
        }
    },
    // 显示碰牌
    setPengCard (action, value) {
        // 动画音效
        if (action) {
            this.setOpAnim(1);
            this.playOpEffect("peng", this.info.sex);
        }
        // 牌
        var opContainer = cc.find("card_op/op_" + this.opNumber, this.cardNode);
        for (var i = 0; i < 3; i++) {
            var opCard = this.createCard(this.index, 2, 0);
            var dest = this.getOpCardPos(this.opNumber, i);
            opCard.x = dest.x;
            opCard.y = dest.y;
            this.setCardValue(opCard, value);
            opContainer.addChild(opCard, GameConfig.PENG_ZORDER[this.index][this.opNumber][i]);
        }
        this.opNumber++;
    },
    // 显示杠牌，value杠牌牌值，type杠牌类型，1暗杠2明杠3补杠，data补杠需要的以前玩家的牌组数据
    setGangCard (action, value, type, data) {
        // 动画音效
        if (action) {
            this.setOpAnim(2);
            if (type === 1) {
                // 暗杠
                this.playOpEffect("angang", this.info.sex);
            }
            else if (type === 2) {
                // 明杠
                this.playOpEffect("gang", this.info.sex);
            }
            else if (type === 3) {
                // 补杠
                this.playOpEffect("gang", this.info.sex);
            }
        }
        // 牌
        if (type === 1) {
            // 暗杠，翻过来
            var opContainer = cc.find("card_op/op_" + this.opNumber, this.cardNode);
            for (var i = 0; i < 4; i++) {
                var opCard = this.createCard(this.index, 2, 1);
                var dest = this.getOpCardPos(this.opNumber, i);
                opCard.x = dest.x;
                opCard.y = dest.y;
                this.setCardValue(opCard, value);
                opContainer.addChild(opCard, GameConfig.GANG_ZORDER[this.index][this.opNumber][i]);
            }
            this.opNumber++;
        }
        else if (type === 2) {
            // 明杠
            var opContainer = cc.find("card_op/op_" + this.opNumber, this.cardNode);
            for (var i = 0; i < 4; i++) {
                var opCard = this.createCard(this.index, 2, 0);
                var dest = this.getOpCardPos(this.opNumber, i);
                opCard.x = dest.x;
                opCard.y = dest.y;
                this.setCardValue(opCard, value);
                opContainer.addChild(opCard, GameConfig.GANG_ZORDER[this.index][this.opNumber][i]);
            }
            this.opNumber++;
        }
        else if (type === 3) {
            // 补杠，删除以前的碰
            if (data) {
                var oriIndex = 0;
                for (let i = 0; i < data.length; i++) {
                    if (data[i]["pai_arr"][0] === value) {
                        oriIndex = i;
                        break;
                    }
                }
                var opContainer = cc.find("card_op/op_" + oriIndex, this.cardNode);
                opContainer.removeAllChildren();
                for (var i = 0; i < 4; i++) {
                    var opCard = this.createCard(this.index, 2, 0);
                    var dest = this.getOpCardPos(oriIndex, i);
                    opCard.x = dest.x;
                    opCard.y = dest.y;
                    this.setCardValue(opCard, value);
                    opContainer.addChild(opCard, GameConfig.GANG_ZORDER[this.index][oriIndex][i]);
                }
            }
        }
    },
    // 显示胡牌
    setHuCard (action) {
        // 动画音效
        if (action) {
            this.setOpAnim(3);
            this.playOpEffect("hu", this.info.sex);
        }
    },
    // 显示听牌
    setTingCard (action) {

    },
    // 显示过
    setPass (action) {

    },
    // 播放动画
    setOpAnim (op) {
        let anim = this.opAnim.getChildByName("anim");
        anim.active = true;
        anim.getComponent(cc.Animation).play("anim");

        let sp = this.opAnim.getChildByName("sp");
        util.loadSprite("game/op/"+op, sp);
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
                }, this)
            )
        );

        this.opAnim.active = true;
    },
    // 添加牌堆的牌
    setTableCard (list) {
        if (!list) {
            return;
        }
        for (let i = 0; i < list.length; i++) {
            var tableCard = this.createCard(this.index, 4, 0);
            var dest = this.getTableCardPos(this.tableNumber);
            tableCard.x = dest.x;
            tableCard.y = dest.y;
            this.setCardValue(tableCard, list[i]);
            tableCard.name = "" + this.tableNumber;
            this.cardNode.getChildByName("card_table").addChild(tableCard, dest.zorder);
            this.tableNumber++;
        }
        // todo，断线重连需要显示
    },
    // 计算操作牌的位置，number牌组的数量，index牌组中的下标
    getOpCardPos (number, index) {
        var opSize = this.getCardSize(this.index, 2, 0);
        let center = this.handPos[GameConfig.HAND_MAX - number*3 - 2];
        let centerX = center.x;
        let centerY = center.y;
        var posX = 0;
        var posY = 0;
        if (this.index === 0) {
            centerX -= (4 - number)*(-15);
            centerX -= 50;
            centerY -= 10;
            if (index === 0) {
                // 左
                posX = centerX - opSize.width;
                posY = centerY;
            }
            else if (index === 1) {
                // 中
                posX = centerX;
                posY = centerY;
            }
            else if (index === 2) {
                // 右
                posX = centerX + opSize.width;
                posY = centerY;
            }
            else if (index === 3) {
                // 上
                posX = centerX;
                posY = centerY + opSize.height;
            }
        }
        else if (this.index === 1) {
            centerY -= (4 - number)*8;
            if (index === 0) {
                // 左
                posX = centerX;
                posY = centerY - opSize.width;
            }
            else if (index === 1) {
                // 中
                posX = centerX;
                posY = centerY;
            }
            else if (index === 2) {
                // 右
                posX = centerX;
                posY = centerY + opSize.width;
            }
            else if (index === 3) {
                // 上
                posX = centerX;
                posY = centerY + opSize.height;
            }
        }
        else if (this.index === 2) {
            centerX += (4 - number)*(-5);
            centerX += 30;
            centerY -= 6;
            if (index === 0) {
                // 左
                posX = centerX + opSize.width;
                posY = centerY;
            }
            else if (index === 1) {
                // 中
                posX = centerX;
                posY = centerY;
            }
            else if (index === 2) {
                // 右
                posX = centerX - opSize.width;
                posY = centerY;
            }
            else if (index === 3) {
                // 上
                posX = centerX;
                posY = centerY + opSize.height;
            }
        }
        else if (this.index === 3) {
            centerY += (4 - number)*8;
            centerY += 20;
            if (index === 0) {
                // 左
                posX = centerX;
                posY = centerY + opSize.width;
            }
            else if (index === 1) {
                // 中
                posX = centerX;
                posY = centerY;
            }
            else if (index === 2) {
                // 右
                posX = centerX;
                posY = centerY - opSize.width;
            }
            else if (index === 3) {
                // 上
                posX = centerX;
                posY = centerY + opSize.height;
            }
        }
        return {
            x : posX,
            y : posY,
        };
    },
    // 结算设置手牌
    setResultCard (cardArray, cardNum) {
        util.log("玩家"+this.index+"结算设置手牌");
        // 设置手牌隐藏
        this.setHandCard([], 0);
        // 摸牌
        this.setExtraCard(false);
        // 手牌排序
        this.sortHandCard(cardArray, cardNum);
        // 计算牌组和手牌的数量，每个牌组算三张，总数量为十四时，需要占用摸牌位置
        let totalNumber = this.opNumber*3 + cardNum;
        let value = null;
        if (totalNumber === 14) {
            // 需要拿出一张，放在摸牌位置
            value = cardArray.shift();
            cardNum--;
        }

        let resultCard = this.cardNode.getChildByName("card_result");
        // 删除以前的节点
        resultCard.removeAllChildren();
        // 设置手牌显示
        // 设置手牌状态
        for (let i = 0; i < cardNum; i++) {
            let card = this.createCard(this.index, 5, 0);
            this.setCardValue(card, cardArray[i]);
            this.handStatus[i] = 0;
            this.setHandPos(card, i);
            resultCard.addChild(card, GameConfig.HAND_ZORDER[this.index][i]);
        }
        // 摸牌位置
        if (value) {
            let card = this.createCard(this.index, 5, 0);
            this.setCardValue(card, value);
            this.handStatus[i] = 0;
            this.setHandPos(card, GameConfig.HAND_MAX);
            resultCard.addChild(card, GameConfig.HAND_ZORDER[this.index][GameConfig.HAND_MAX]);
        }
    },
    // 设置托管状态
    setAuto (flag) {
        this.auto = !!flag;
        if (this.auto) {
            // 托管，有已选中牌，设置手牌回到位置
            if (this.selectIndex && this.selectIndex !== -1) {
                //托管时，将点击选中牌清空
                this.previousClickCard = null;
                this.handStatus[this.selectIndex] = 0;
                var card = cc.find("card_hand/card_" + this.selectIndex, this.cardNode);
                this.setHandPos(card, this.selectIndex);
            }
        }
    },
    // 显示杠分现结
    setGangScore (score) {
        util.log("杠分现结 玩家"+this.index+" 分数"+score);
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
            dst.x -= 30;
            dst.y -= 160;
        }
        else if (this.index === 1) {
            dst.x += (this.halfWidth - 400);
        }
        else if (this.index === 2) {
            dst.x -= 30;
            dst.y += 160;
        }
        else if (this.index === 3) {
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
    // 显示出牌提示
    setOutTip (card) {
        // 指示
        let tip = cc.find("action/center/out_tip", this.game.node);
        if (card) {
            let pos = card.convertToWorldSpaceAR(cc.p(0, 0));
            pos = tip.parent.convertToNodeSpaceAR(pos);
            if (this.index === 0) {
                tip.x = pos.x;
                tip.y = pos.y + 50;
            }
            else if (this.index === 1) {
                tip.x = pos.x;
                tip.y = pos.y + 40;
            }
            else if (this.index === 2) {
                tip.x = pos.x;
                tip.y = pos.y + 50;
            }
            else if (this.index === 3) {
                tip.x = pos.x;
                tip.y = pos.y + 40;
            }
            tip.active = true;
            tip.stopAllActions();
            tip.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.moveBy(0.25, 0, -5),
                        cc.moveBy(0.25, 0, -3),
                        cc.moveBy(0.25, 0, 3),
                        cc.moveBy(0.25, 0, 5),
                    )
                )
            );
            tip.getComponent(cc.Animation).play();
        }
        else {
            tip.active = false;
        }
    },

    // 删除一张牌堆
    deleteTableCard () {
        // 删除一张
        var card = this.cardNode.getChildByName("card_table").getChildByName("" + (this.tableNumber-1));
        if (card) {
            card.removeFromParent();
            this.tableNumber--;
            this.setOutTip()
        }
    },
    // 点击手牌响应
    onCardClick (event, index) {
        util.log("GamePlayer onCardClick " + index);
        if (this.auto) {
            // 托管状态不允许动牌
            return;
        }
        if (this.handStatus[index] === 0) {
            // 有已选中牌
            if (this.selectIndex !== -1) {
                this.handStatus[this.selectIndex] = 0;
                var card = cc.find("card_hand/card_" + this.selectIndex, this.cardNode);
                this.setHandPos(card, this.selectIndex);
            }
            // 选中牌
            {
                this.selectIndex = index;
                this.handStatus[this.selectIndex] = 1;
                var card = cc.find("card_hand/card_" + this.selectIndex, this.cardNode);
                this.setHandPos(card, this.selectIndex);

                // 显示听牌提示
                if (this.current) {
                    this.game.setTingPop(this.handValue[index], false);
                }
            }
        }
        else {
            // 出牌
            if (this.current) {
                this.game.sendGameOutCard(index, this.handValue[index]);
                // 隐藏听牌提示
                this.game.setTingPop();
                // 刷新听牌箭头
                this.setTingArrow(this.game.tingData);
            }
            else {
                // 不该出牌，回到原位置
                this.handStatus[index] = 0;
                this.selectIndex = -1;
                var card = cc.find("card_hand/card_" + index, this.cardNode);
                this.setHandPos(card, index);
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
    // 创建牌节点，为了减少进入游戏界面创建的节点数，改为代码创建
    // index玩家位置，type手牌牌组牌堆，side正反面
    // 牌垛0 手牌1 牌组2 出牌3 牌堆4 结算5
    createCard (index, type, side) {
        var cardRes = GameConfig.CARD_RES[index][type][side];
        if (cardRes.res === 0) {
            return null;
        }

        var card = cc.instantiate(this.game["card_" + cardRes.res]);
        card.scaleX = cardRes.cardScale;
        card.scaleY = cardRes.cardScale;

        var resSize = GameConfig.RES_SIZE[cardRes.res];

        card.getComponent("GameCard").setCardData(cardRes, resSize);

        return card;
    },
    // 获取牌的尺寸，面对牌的长宽高
    getCardSize (index, type, side) {
        // 获取对应牌的资源id
        var cardRes = GameConfig.CARD_RES[index][type][side];
        if (cardRes.res === 0) {
            return {
                length  :   0,
                width   :   0,
                height  :   0,
                scale   :   0,
            };
        }

        // 获取对应资源的尺寸
        var resSize = GameConfig.RES_SIZE[cardRes.res];
        return {
            length  :   resSize.length*cardRes.cardScale,
            width   :   resSize.width*cardRes.cardScale,
            height  :   resSize.height*cardRes.cardScale,
            scale   :   cardRes.cardScale,
        }
    },

    // 出牌音效
    playOutEffect (cardValue, sex) {
        let value = (cardValue - 1)%9 + 1;      // 123456789
        let type = Math.ceil(cardValue/9);      // 1万2条3筒4字
        // util.log("" + cardValue + "=" + value + ["万", "条", "筒", "字"][type - 1]);
        let url = "";
        if (type === 4) {
            // 字牌
            url = "" + (30 + value);
        }
        else {
            url = "" + value + ["wan", "tiao", "tong"][type - 1];
        }
        if (sex) {
            url = "resources/sound/game/woman/w" + url + ".mp3";
        }
        else {
            url = "resources/sound/game/man/m" + url + ".mp3";
        }
        util.log("播放音效="+url);
        audioUtils.playSFX(url);
    },
    // 操作音效
    playOpEffect (op, sex) {
        let url = "";
        // util.log("" + op);
        if (sex) {
            url = "resources/sound/game/woman/w" + op + ".mp3";
        }
        else {
            url = "resources/sound/game/man/m" + op + ".mp3";
        }
        util.log("播放音效="+url);
        audioUtils.playSFX(url);
    },

    // 显示聊天信息
    showChatQuick (event) {
        let string = event.detail.content;
        if (!string) {
            return;
        }

        let chat = cc.find("chat", this.node);
        let label = cc.find("chat/chat/label", this.node).getComponent(cc.Label);
        let bg = cc.find("chat/chat", this.node);
        label.string = string;
        if (gameData.os === "web") {
            bg.width = string.length*37 + 15;
        }
        else if (gameData.os === "android") {
            bg.width = string.length*42 + 15;
        }
        else if (gameData.os === "ios") {
            bg.width = string.length*37 + 17;
        }
        chat.active = true;
        chat.stopAllActions();
        chat.runAction(
            cc.sequence(
                cc.delayTime(5),
                cc.callFunc(function () {
                    chat.active = false;
                }, this)
            )
        );
    },


    // 显示下跑分数
    actXiaPaoResult (score, callback) {
        if (!score) {
            return;
        }
        let that = this;
        let turn = cc.find("table/center/turn_bg", this.game.node);
        let oriPos = turn.convertToWorldSpaceAR(cc.p(0, 0));
        oriPos = this.infoNode.convertToNodeSpaceAR(oriPos);

        let stpPos = [
            {x : 0, y : -250},
            {x : 300, y : 0},
            {x : 0, y : 250},
            {x : -300, y : 0},
        ][this.index];
        let dstPos = [
            {x : 109, y : -23},
            {x : -13, y : 80},
            {x : -13, y : -82},
            {x : -13, y : 80},
        ][this.index];

        let xiapao = this.infoNode.getChildByName("xiapao");
        let sp = xiapao.getChildByName("sp");
        let bg = xiapao.getChildByName("bg");
        util.loadSprite("game/henantuidaohu/xiapao_score_"+score, sp, function() {
            sp.scaleX = 0.5;
            sp.scaleY = 0.5;
            sp.active = true;

            bg.active = false;

            xiapao.opacity = 100;
            xiapao.scaleX = 4;
            xiapao.scaleY = 4;
            xiapao.x = oriPos.x;
            xiapao.y = oriPos.y;
            xiapao.active = true;
            xiapao.stopAllActions();
            xiapao.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.moveBy(0.5, stpPos.x, stpPos.y),
                        cc.fadeTo(0.5, config.maxOpacity)
                    ),
                    cc.delayTime(1),
                    cc.spawn(
                        cc.moveTo(0.5, dstPos.x, dstPos.y),
                        cc.scaleTo(0.5, 1)
                    ),
                    cc.callFunc(function () {
                        bg.active = true;
                        if (callback) {
                            callback();
                        }
                    })
                )
            );
        });
    },

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
                for (let i = 0; i <= GameConfig.HAND_MAX; i++) {
                    cc.find("card_hand/card_" + i, this.cardNode).stopAllActions();
                }
            }
        }
        {
            // setOpAnim
            let anim = this.opAnim.getChildByName("anim");
            anim.getComponent(cc.Animation).stop("anim");
            anim.active = false;

            let sp = this.opAnim.getChildByName("sp");
            sp.stopAllActions();
            sp.active = false;
        }
        {
            // todo 杠分现结
        }
        {
            // actXiaPaoResult
            let xiapao = this.infoNode.getChildByName("xiapao");
            xiapao.stopAllActions();
            xiapao.active = false;
        }
    },

    // 获取指定长度的名字
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

    // 直接设置下跑分数，不播动作
    setXiaPaoScore (score) {
        if (!score) {
            return;
        }
        let xiapao = this.infoNode.getChildByName("xiapao");
        let sp = xiapao.getChildByName("sp");
        util.loadSprite("game/henantuidaohu/xiapao_score_"+score, sp);
        sp.scaleX = 0.5;
        sp.scaleY = 0.5;
        sp.active = true;
        let bg = xiapao.getChildByName("bg");
        bg.active = true;
        xiapao.active = true;
    },
});