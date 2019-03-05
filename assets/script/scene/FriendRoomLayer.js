// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        // CreateRoomLayer : cc.Node,
        // CreateRoomPrefab: {
        //     default: null,
        //     type: cc.Prefab
        // },

        // JoinRoomLayer : cc.Node,
        // JoinRoomPrefab: {
        //     default: null,
        //     type: cc.Prefab
        // },
        anim:cc.Animation,

        gameBean:cc.Label,//游戏豆
        gameDiamond:cc.Label,//钻石

        jifen:cc.Label,//今日积分
        zanwuzhanji:cc.Node,
        phbList:cc.Node,

        rightNode:cc.Node,
        leftNode:cc.Node,
        leftPhbNode:cc.Node,
        bgAllNode:cc.Node,//背景节点，适配
        _rewardData:null,//战绩数据
        _playInfoData:null,//今日积分数据在这个里面

        //按钮  在1秒内只能点一次
        lastClickTime : 0,


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //
        

        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.leftNode.scale = 0.8;
            this.leftPhbNode.scale = 0.8;
            this.rightNode.scale = 0.8;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.leftNode.scale = 0.85;
            this.leftPhbNode.scale = 0.85;
            this.rightNode.scale = 0.85;
        }else if(gameData.canvasWidth/gameData.canvasHeight>2){
            this.bgAllNode.scaleX = 1.1;
        }
        //
        this.playFriendRoomAnim();

        this.leftNode.x  = -gameData.canvasWidth/2;
        this.leftPhbNode.x  = -gameData.canvasWidth/2;
        this.rightNode.x = gameData.canvasWidth/2;


        this.gameBean.string = util.showNum(gameData.gameBean);//
        this.gameDiamond.string = util.showNum(gameData.gameDiamond);

        this._rewardContent = cc.find("leftPhb/phb/scrollview/view/content",this.node);
        this._rewardItemTemp = this._rewardContent.children[0];
        this._rewardContent.removeChild(this._rewardItemTemp);

        if(this._rewardData && this._rewardData.length>0){
            this.zanwuzhanji.active = false;
            this.phbList.active = true;
            this.initRewardList(this._rewardData);
        }else if(this._rewardData && this._rewardData.length==0){
            this.zanwuzhanji.active = true;
            this.phbList.active = false;
        }
        if(this._playInfoData){
            this.jifen.string = this._playInfoData["todayTotleScore"];
        }else{
            this.jifen.string = "0";
        }
        
        // let door = cc.find("friend_door", this.node);
        // door.opacity = 0;
        // util.loadSprite("hall/friend_door", door, function (node) {
        //     door.runAction(
        //         cc.fadeTo(3, config.maxOpacity)
        //     );
        // });
    },
    playFriendRoomAnim:function(){
        this.anim.stop("friendRoomAnim");
        this.anim.play("friendRoomAnim");
     },
    start () {
        //适配刘海屏
        var isNotch = util.isNotchPhone(gameData.FrameWidth,gameData.FrameHeight);
        if(isNotch){
            var leftPhbNode = cc.find("leftPhb", this.node);
            var leftPhbNodeX = leftPhbNode.getPositionX();
            leftPhbNode.setPositionX(leftPhbNodeX + 120);
        }
    },
    setRecordData:function(data){
        if(data){
            this._rewardData = data["roomResult"];
            this._playInfoData = data["playerDynamicInfo"];
        }
        
    },

    //战绩列表--begin
    initRewardList:function(data){
        for(var i = 0; i < data.length; ++i ){
            var node = this.getRewardItem(i);
            node.idx = i;
            
            node.getChildByName("time_data").getComponent(cc.Label).string = data[i]["createTime"].substring(0,10);
            node.getChildByName("phb_name").getComponent(cc.Label).string = data[i]["playType"];
            for(var j = 1;j<5;j++){
                sdk.getPlayerHead(data[i]["playerImg"+j], node.getChildByName("head"+j), function (node) {
                    node.active = true;
                })
            }
            
            util.log("");
            var playId = gameData.uid;
            // var playId = 108853;
            var playNum = null;
            for(var j = 1; j < 5; j++){
               if(data[i]["playerId"+j] == playId){
                    playNum = j;
               }
            }
            util.log("自己的ID（座位） == "+playNum); 
            if(data[i]["totoleScore"+playNum]>=0){
                node.getChildByName("phb_number").color = new cc.Color(172, 0, 0, config.maxOpacity);
                node.getChildByName("phb_number").getComponent(cc.Label).string = "+"+data[i]["totoleScore"+playNum];
            }else{
                node.getChildByName("phb_number").color = new cc.Color(0, 125, 172, config.maxOpacity);
                node.getChildByName("phb_number").getComponent(cc.Label).string = data[i]["totoleScore"+playNum];
            }
           
            
            
        }
    },
    getRewardItem:function(index){
        var rewardContent = this._rewardContent;
        if(rewardContent.childrenCount > index){//已经添加过了
            return rewardContent.children[index];
        }
        
        var node = cc.instantiate(this._rewardItemTemp);
        rewardContent.addChild(node);
        return node;
    },
    //战绩列表--end
    onBtnBuyBean:function(){
        audioUtils.playClickSoundEffect();
        var self = this;
        util.loadPrefab("shopLayer",function(data){
            if(util.isNodeExist(self.node,"shopLayer")){
                return ;
            }
            var shopLayer = cc.instantiate(data);
            shopLayer.setName("shopLayer");
            shopLayer.getComponent("shopLayer").setfirstLayer("bean");
            // shopLayer.y = 10;
            self.node.addChild(shopLayer);
        });
    },
    onBtnBuyDiamond:function(){
        audioUtils.playClickSoundEffect();
        var self = this;
        util.loadPrefab("shopLayer",function(data){
            if(util.isNodeExist(self.node,"shopLayer")){
                return ;
            }
            var shopLayer = cc.instantiate(data);
            shopLayer.setName("shopLayer");
            shopLayer.getComponent("shopLayer").setfirstLayer("diamond");
            // shopLayer.y = 10;
            self.node.addChild(shopLayer);
        });
    },
    onBtnMail:function(){
        audioUtils.playClickSoundEffect();
        var self = this;
        util.loadPrefab("mailLayer",function(data){
            var mailLayer = cc.instantiate(data);
            util.getMailStatus(
                function(respJsonInfo){
                    if(respJsonInfo["code"] == "0"){
                        if(util.isNodeExist(self.node,"mailLayer")){
                            return ;
                        }
                        util.log("Mail成功 +=== "+ respJsonInfo['msg']);
                        var msg = JSON.parse(respJsonInfo['msg']);
                        util.log("mail  === "+ msg);
                        util.log("mailInfo  === "+ msg["mailInfos"]);

                        mailLayer.getComponent("mailLayer").setMailData(msg);
                        mailLayer.setName("mailLayer");
                        self.node.addChild(mailLayer);
                    }else if(respJsonInfo["code"] == "0"){
                        util.log("getMailStatus === 0 ");
                    }else{
                        util.log("getMailStatus === 2 ");
                    }
                },
            null,null);
        });
    },
    onBtnClose () {
        // this.node.active = false;
        // this.node.removeFromParent(false);
        audioUtils.playCloseSoundEffect();
        this.node.parent.emit('playHallAnim');
        this.node.destroy();
    },

    onBtnCreateRoom () {
        var nowTime = (new Date()).getTime();
        var timeInterval = (nowTime - this.lastClickTime)/1000;
        if (this.lastClickTime === 0 || timeInterval > 1) {  
            // this.CreateRoomLayer.active = true;
            // var CreateRoomNode = cc.instantiate(this.CreateRoomPrefab);
            // this.node.addChild(CreateRoomNode);
            audioUtils.playClickSoundEffect();
            var that = this;
            util.refreshAllRedStatus(function(){//刷新是否还在房间中
                if(gameData.playerIsInRoom){
                    // this.scheduleOnce(function() {
                        util.tip({
                            node : that.node,
                            type : 2,
                            string : gameData.playerIsInRoom["gameType"] == config.KIND_MATE ? "您在匹配场还有未完成的对局" : "您在好友场还有未完成的对局",
                            leftCallback : null,
                            centerCallback : null,
                            rightCallback : function(){
                                util.connectGameServer({
                                    serverUrl : gameData.playerIsInRoom["url"],
                                    openId : gameData.openid,
                                    actionId : 3,
        
                                    uid : gameData.uid,
                                    mateLevel : gameData.playerIsInRoom["gameLevel"],
                                    roomId : gameData.playerIsInRoom["roomId"],
                                });
                            },
                            isShowLeftBtn : true,
                            isShowCenterBtn : false,
                            isShowRightBtn : true
                        });
                    // }, 1.0);
                }else{
                    var self = that;
                    util.loadPrefab("createRoom",function(data){
                        if(util.isNodeExist(self.node,"CreateRoomNode")){
                            return ;
                        }
                        var CreateRoomNode = cc.instantiate(data);
                        CreateRoomNode.setName("CreateRoomNode");
                        self.node.addChild(CreateRoomNode);
                    });
                }
            });//
            this.lastClickTime = nowTime;
        }        
        
        
    },

    onBtnJoinRoom () {
        var nowTime = (new Date()).getTime();
        var timeInterval = (nowTime - this.lastClickTime)/1000;
        if (this.lastClickTime === 0 || timeInterval > 1) {       
            audioUtils.playClickSoundEffect();
            // this.JoinRoomLayer.active = true;
            // var JoinRoomNode = cc.instantiate(this.JoinRoomPrefab);
            // this.node.addChild(JoinRoomNode);
            var that = this;
            util.refreshAllRedStatus(function(){//刷新是否还在房间中
                if(gameData.playerIsInRoom){//有返回房间的提示
                    // this.scheduleOnce(function() {
                        util.tip({
                            node : that.node,
                            type : 2,
                            string : gameData.playerIsInRoom["gameType"] == config.KIND_MATE ? "您在匹配场还有未完成的对局" : "您在好友场还有未完成的对局",
                            leftCallback : null,
                            centerCallback : null,
                            rightCallback : function(){
                                util.connectGameServer({
                                    serverUrl : gameData.playerIsInRoom["url"],
                                    openId : gameData.openid,
                                    actionId : 3,
        
                                    uid : gameData.uid,
                                    mateLevel : gameData.playerIsInRoom["gameLevel"],
                                    roomId : gameData.playerIsInRoom["roomId"],
                                });
                            },
                            isShowLeftBtn : true,
                            isShowCenterBtn : false,
                            isShowRightBtn : true
                        });
                    // }, 1.0);
                }else{
                    var self = that;
                    util.loadPrefab("joinRoom",function(data){
                        if(util.isNodeExist(self.node,"joinRoom")){
                            return ;
                        }
                        var joinRoom = cc.instantiate(data);
                        joinRoom.setName("joinRoom");
                        self.node.addChild(joinRoom);
                    });
                }
            });
            this.lastClickTime = nowTime;
        }
    },

    onBtnRecordItem:function(event){
        audioUtils.playClickSoundEffect();
        var idx = event.target.idx;
        util.log("点击按钮的IDX  == " + idx);
        var self = this;
        util.loadPrefab("recordLayer",function(data){
            if(util.isNodeExist(self.node,"recordLayer")){
                return ;
            }
            var recordLayer = cc.instantiate(data);
            recordLayer.setName("recordLayer");
            recordLayer.getComponent("recordLayer").setRecordData(self._rewardData[idx]);
            self.node.addChild(recordLayer);
        });
    },

    // update (dt) {},
});
