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
       
        _nowSelLevel:1,
        anim:cc.Animation,
        fangjian:{
            default :[],
            type:cc.Node
        },
        gameBean:cc.Label,//游戏豆
        gameDiamond:cc.Label,//钻石

        _fieldId:[],

        gameType : config.hallDefaulrSelGameId,
        leftNode:cc.Node,
        centerNode:cc.Node,
        bgAllNode:cc.Node,//背景节点，适配

        //按钮  在1秒内只能点一次
        lastClickTime : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function() {
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.leftNode.scale = 0.8;
            this.centerNode.scale = 0.8;
            this.leftNode.y  = gameData.canvasHeight/2+4;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.leftNode.scale = 0.85;
            this.centerNode.scale = 0.85;
        }else if(gameData.canvasWidth/gameData.canvasHeight>2){
            this.bgAllNode.scaleX = 1.1;
        } 
        this.leftNode.x  = -gameData.canvasWidth/2;
        gameData.morefieldNode = this.node;
    },
    initScene : function (type) {
        // 动作
        this.playMoreFieldAnim();
        // 刷新货币显示
        this.setPlayerInfo();

        this.gameType = type;
        gameData.appId = config.MAJIANG_ID;

        // 设置类型显示
        util.loadSprite("hall/more_field/type/"+type, cc.find("center/mj_name_node/mj_name", this.node));
        

        var that = this;
        if(gameData.matchLevelData_houduan){//后端返回的表数据，  底分由后端控制

            let list_h = [];
            for(let i = 0 ; i < gameData.matchLevelData_houduan.length; i++){
                if (gameData.matchLevelData_houduan[i].type === ""+that.gameType) {
                    list_h.push(gameData.matchLevelData_houduan[i]);
                }
            }

            // todo排序
            for(let i = 0 ; i < list_h.length; i++){ 
                let bg = that.fangjian[i];
                let data = list_h[i];
                that._fieldId[i] = data.id;//add  by majiangfan 
                if (bg) {
                    // util.loadSprite("hall/more_field/bg/"+data.tab_id, bg.getChildByName("bg"));
                    // util.loadSprite("hall/more_field/title/"+data.tab_id, bg.getChildByName("title"));
                    bg.getChildByName("difen").getComponent(cc.Label).string =  data.serveprice;
                    // bg.getChildByName("room_people_num").getComponent(cc.Label).string = people[i];
                    // bg.getChildByName("coin_num").getComponent(cc.Label).string =  util.showNumber(data.limmitdown)+"—"+ util.showNumber(data.limmitup);
                }
            }
        }

        var callback = function (jsonData) {
            util.log("LoadingScene loadJsonFile:"+ jsonData);
            // 先取界面需要显示的数据
            let list = [];
            for(let i = 0 ; i < jsonData.length; i++){
                if (jsonData[i].type === ""+that.gameType) {
                    list.push(jsonData[i]);
                }
            }
        
            let people = [];
            
            if (that.gameType+"" === "1001") {
                people.push(gameData.tuidaohuLevel1Num);
                people.push(gameData.tuidaohuLevel2Num);
                people.push(gameData.tuidaohuLevel3Num);
                
            }else if(that.gameType+"" === "1101"){
                people.push(gameData.zhengzhouLevel1Num);
                people.push(gameData.zhengzhouLevel2Num);
                people.push(gameData.zhengzhouLevel3Num);
                
            }else if(that.gameType+"" === "1201"){
                people.push(gameData.xinyangLevel1Num);
                people.push(gameData.xinyangLevel2Num);
                people.push(gameData.xinyangLevel3Num);
                
            }else if(that.gameType+"" === "1301"){
                people.push(gameData.nanyangLevel1Num);
                people.push(gameData.nanyangLevel2Num);
                people.push(gameData.nanyangLevel3Num);
                
            }else if(that.gameType+"" === "1401"){
                people.push(gameData.zhoukouLevel1Num);
                people.push(gameData.zhoukouLevel2Num);
                people.push(gameData.zhoukouLevel3Num);
                
            }
            

            // todo排序
            for(let i = 0 ; i < list.length; i++){ 
                let bg = that.fangjian[i];
                let data = list[i];
                that._fieldId[i] = data.id;//add  by majiangfan 
                if (bg) {
                    util.loadSprite("hall/more_field/bg/"+data.tab_id, bg.getChildByName("bg"));
                    // util.loadSprite("hall/more_field/title/"+data.tab_id, bg.getChildByName("title"));
                    // bg.getChildByName("difen").getComponent(cc.Label).string =  data.serveprice;
                    bg.getChildByName("room_people_num").getComponent(cc.Label).string = people[i];
                    bg.getChildByName("coin_num").getComponent(cc.Label).string =  util.showNumber(data.limmitdown)+"—"+ util.showNumber(data.limmitup);
                }
            }
        };
        if (config.Matchlevel_Common) {
            callback(config.Matchlevel_Common);
        }
        else {
            util.loadJsonFile("json/Matchlevel_Common", function (jsonData) {
                config.Matchlevel_Common = jsonData;
                callback(config.Matchlevel_Common);
            });
        }
    },
    setPlayerInfo:function(){
        this.gameBean.string = util.showNum(gameData.gameBean);//
        this.gameDiamond.string = util.showNum(gameData.gameDiamond);
    },
    playMoreFieldAnim:function(){
        this.anim.stop("moreFieldAnim");
        this.anim.play("moreFieldAnim");
    },
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        cc.find("center/btn_texiao", this.node).getComponent(cc.Animation).stop("kuaisu_1");
        cc.find("center/btn_texiao2", this.node).getComponent(cc.Animation).stop("kuaisu_2");
        // this.node.removeFromParent(false);
        this.node.parent.emit('playHallAnim');
        this.node.destroy();
    },
    onBtnGame:function(event, custom){
        var nowTime = (new Date()).getTime();
        var timeInterval = (nowTime - this.lastClickTime)/1000;
        if (this.lastClickTime === 0 || timeInterval > 1) {
            audioUtils.playClickSoundEffect();
            // if(gameData.playerIsInRoom){//有返回房间的提示
            //     // this.scheduleOnce(function() {
            //         util.tip({
            //             node : this.node,
            //             type : 2,
            //             string : gameData.playerIsInRoom["gameType"] == config.KIND_MATE ? "您在匹配场还有未完成的对局" : "您在好友场还有未完成的对局",
            //             leftCallback : null,
            //             centerCallback : null,
            //             rightCallback : function(){
            //                 util.connectGameServer({
            //                     serverUrl : gameData.playerIsInRoom["url"],
            //                     openId : gameData.openid,
            //                     actionId : 3,

            //                     uid : gameData.uid,
            //                     mateLevel : gameData.playerIsInRoom["gameLevel"],
            //                     roomId : gameData.playerIsInRoom["roomId"],
            //                 });
            //             },
            //             isShowLeftBtn : true,
            //             isShowCenterBtn : false,
            //             isShowRightBtn : true
            //         });
            //     // }, 1.0);
            // }else{
            this._nowSelLevel = custom*1;
            util.log("primary");

            util.log("hunter---点击的时间间隔：" + (nowTime - this.lastClickTime));
            this.onBtnSelGameLevel();
            this.lastClickTime = nowTime;
        }
        // }
    },
    onBtnSelGameLevel:function(){
        var self = this;
        util.log("id =====  "+this._fieldId[this._nowSelLevel-1]);

        util.getPlayTypeStatus({
            gameId : this.gameType,
            gameType : config.KIND_MATE,
            gameLevel : this._nowSelLevel,
            fieldId : this._fieldId[this._nowSelLevel-1],
            callBack : function(data){
                gameData.mateLevel = self._nowSelLevel;
                // 加入匹配场
                var info = {
                    playerId: gameData.uid,
                    mapId: self.gameType,//玩法ID 现在只做了两个，暂时写死
                    piLevel: self._nowSelLevel,
                    gameKind : config.KIND_MATE,
                    app_id : gameData.appId,
                    restart : false,
                    roomId : 0
                };
                network.send(2201, info);
            },
            uid : null,
            unionid : null,
            quick : 0,
            tipCallBack : function(){
                // util.tip({
                //     node : self.node,
                //     type : 2,
                //     string : "您的金豆数量不符合该场次要求，是否跳转到购买金豆界面？",
                //     leftCallback : null,
                //     centerCallback : null,
                //     rightCallback : function(){
                //         util.loadPrefab("shopLayer",function(data){
                //             var shopLayer = cc.instantiate(data);
                //             shopLayer.getComponent("shopLayer").setfirstLayer("bean");
                //             shopLayer.setPosition(cc.p(shopLayer.getPosition().x,shopLayer.getPosition().y + 11));
                //             self.node.addChild(shopLayer);
                //          });
                //     },
                //     isShowLeftBtn : true,
                //     isShowCenterBtn : false,
                //     isShowRightBtn : true
                // });
                //充值提示
                util.tip4({
                    node : self.node,
                    type : 2,
                    string : "",
                    level : self._nowSelLevel,
                    num : 0,
                    leftCallback : null,
                    centerCallback : null,
                    rightCallback : null,
                });
            },
            tipCallBack1 : function(){
                util.tip({
                    node : self.node,
                    type : 2,
                    string : "您的金豆数量远超出该场次水平，是否前往符合您水平的场次？",
                    leftCallback : null,
                    centerCallback : null,
                    rightCallback : function(){
                        self.onBtnQuickStart();
                    },
                    isShowLeftBtn : true,
                    isShowCenterBtn : false,
                    isShowRightBtn : true
                });
            },
            supplyCallBack : function(data){
                var des = "您的金豆不足！系统赠送您"+data["almsModel"]["award"]+"豆,今天第"+parseInt(data.size+1)+"次领取，一共可领取"+data["almsModel"]["count"]+"次。";
                //领取救济金提示
                util.tip4({
                    node : self.node,
                    type : 1,
                    string : des,
                    level : self._nowSelLevel,
                    num : data["almsModel"]["award"],
                    leftCallback : null,
                    centerCallback : null,
                    rightCallback : null,
                });
            }
        });
    },
    onBtnKuaiSu:function(){
        audioUtils.playClickSoundEffect();
        cc.find("center/btn_texiao2", this.node).active = true;

        cc.find("center/btn_texiao", this.node).getComponent(cc.Animation).stop("kuaisu_1");
        cc.find("center/btn_texiao2", this.node).getComponent(cc.Animation).stop("kuaisu_2");
        cc.find("center/btn_texiao2", this.node).getComponent(cc.Animation).play("kuaisu_2");
        // if(gameData.playerIsInRoom){//有返回房间的提示
        //     // this.scheduleOnce(function() {
        //         util.tip({
        //             node : this.node,
        //             type : 2,
        //             string : gameData.playerIsInRoom["gameType"] == config.KIND_MATE ? "您在匹配场还有未完成的对局" : "您在好友场还有未完成的对局",
        //             leftCallback : null,
        //             centerCallback : null,
        //             rightCallback : function(){
        //                 util.connectGameServer({
        //                     serverUrl : gameData.playerIsInRoom["url"],
        //                     openId : gameData.openid,
        //                     actionId : 3,

        //                     uid : gameData.uid,
        //                     mateLevel : gameData.playerIsInRoom["gameLevel"],
        //                     roomId : gameData.playerIsInRoom["roomId"],
        //                 });
        //             },
        //             isShowLeftBtn : true,
        //             isShowCenterBtn : false,
        //             isShowRightBtn : true
        //         });
        //     // }, 1.0);
        // }else{
            this.onBtnQuickStart();
        // }
    },
    onBtnQuickStart:function(){
        


        util.log("primary");
        var self = this;

        util.getPlayTypeStatus({
            gameId : this.gameType,
            gameType : config.KIND_MATE,
            gameLevel : 0,
            fieldId : 1,
            callBack : function(data){
                gameData.mateLevel = data.quickGameLevel || 1;
                // 加入匹配场
                var info = {
                    playerId: gameData.uid,
                    mapId: self.gameType,//玩法ID 现在只做了两个，暂时写死
                    piLevel: gameData.mateLevel,
                    gameKind : config.KIND_MATE,
                    app_id : gameData.appId,
                    restart : false,
                    roomId : 0
                };
                network.send(2201, info);
            },
            uid : null,
            unionid : null,
            quick : 1,
            tipCallBack : function(){
                // util.tip({
                //     node : self.node,
                //     type : 2,
                //     string : "您的金豆数量不符合该场次要求，是否跳转到购买金豆界面？",
                //     leftCallback : null,
                //     centerCallback : null,
                //     rightCallback : function(){
                //         util.loadPrefab("shopLayer",function(data){
                //             var shopLayer = cc.instantiate(data);
                //             shopLayer.getComponent("shopLayer").setfirstLayer("bean");
                //             shopLayer.setPosition(cc.p(shopLayer.getPosition().x,shopLayer.getPosition().y + 11));
                //             self.node.addChild(shopLayer);
                //          });
                //     },
                //     isShowLeftBtn : true,
                //     isShowCenterBtn : false,
                //     isShowRightBtn : true
                // });
                //充值提示
                util.tip4({
                    node : self.node,
                    type : 2,
                    string : "",
                    level : 1,
                    num : 0,
                    leftCallback : null,
                    centerCallback : null,
                    rightCallback : null,
                });
            },
            tipCallBack1 : function(){
            
                util.tip({
                    node : self.node,
                    type : 2,
                    string : "您的金豆数量远超出该场次水平，是否前往符合您水平的场次？",
                    leftCallback : null,
                    centerCallback : null,
                    rightCallback : function(){
                        self.onBtnQuickStart();
                    },
                    isShowLeftBtn : true,
                    isShowCenterBtn : false,
                    isShowRightBtn : true
                });
            },
            supplyCallBack : function(data){
                var des = "您的金豆不足！系统赠送您"+data["almsModel"]["award"]+"豆,今天第"+parseInt(data.size+1)+"次领取，一共可领取"+data["almsModel"]["count"]+"次。";
                //领取救济金提示
                util.tip4({
                    node : self.node,
                    type : 1,
                    string : des,
                    level : 1,
                    num : data["almsModel"]["award"],
                    leftCallback : null,
                    centerCallback : null,
                    rightCallback : null,
                });
            }
        });
    },
    
    onBtnMail: function () {
        audioUtils.playClickSoundEffect();
        var self = this;
        util.loadPrefab("mailLayer",function(data){
            var mailLayer = cc.instantiate(data);
            util.getMailStatus(
                function(respJsonInfo){
                    if(respJsonInfo["code"] == "0"){
                        if(util.isNodeExist(self.node,"mailLayer")){
                            return;
                        }
                        var msg = JSON.parse(respJsonInfo['msg']);
                        mailLayer.getComponent("mailLayer").setMailData(msg);
                        mailLayer.setName("mailLayer");
                        self.node.addChild(mailLayer);
                    }else{
                        util.log("getMailStatus === 2 ");
                    }
                },
                null,null);
        });
    },
    onBtnZuanShi: function () {
        audioUtils.playClickSoundEffect();
        this.showShopLayer("diamond");
    },
    onBtnDouZi: function () {
        audioUtils.playClickSoundEffect();
        this.showShopLayer("bean");
    },
    showShopLayer:function(prop_name){
        var self = this;
        util.loadPrefab("shopLayer",function(data){
            if(util.isNodeExist(self.node,"shopLayer")){
                return;
            }
            var shopLayer = cc.instantiate(data);
            shopLayer.getComponent("shopLayer").setfirstLayer(prop_name);
            shopLayer.setPosition(cc.p(shopLayer.getPosition().x,shopLayer.getPosition().y + 11));
            shopLayer.setName("shopLayer");
            self.node.addChild(shopLayer);
        });
    },
    start:function () {
        this.node.on('setPlayerInfo', function (event) {
            this.setPlayerInfo();
        }, this);//金豆 钻石 监听 （可以扩展）
        util.preloadGameScene(this.node);

        // 按钮特效
        cc.find("center/btn_texiao", this.node).getComponent(cc.Animation).stop("kuaisu_1");
        cc.find("center/btn_texiao", this.node).getComponent(cc.Animation).play("kuaisu_1");
        cc.find("center/btn_texiao2", this.node).active = false;
    },

    // update (dt) {},
});
