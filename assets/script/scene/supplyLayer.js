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
        fangqiBtn:cc.Node,
        lingquBtn:cc.Node,
        chongzhiBtn:cc.Node,
        supplyNode:cc.Node,
        payNode:cc.Node,
        _shopData:null,
        _payLevel:null,
        _parentNode:null,
        _lingquNum:null,

        _leftCallback:null,
        _centerCallback:null,
        _rightCallback:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
    },
    setTip:function(node,type,str,level,num,leftCallback,centerCallback,rightCallback){
        this._payLevel = level;
        this._parentNode = node;
        this._lingquNum = num;
        if(type == 1){//救济金
            cc.find("label",this.node).getComponent(cc.Label).string = str;
            this.supplyNode.active = true;
            this.payNode.active = false;
            cc.find("num",this.node).getComponent(cc.Label).string = "X"+num;
            
            if(centerCallback){//领取回调
                this._centerCallback = centerCallback;
            }
            
        }else if(type == 2){//充值
            var self = this; 
            var doGetSh = function(data) {
                self.supplyNode.active = false;
                self.payNode.active = true;
                var str1 = "您的金豆不够留在本场次玩耍了，去购买"+data[level-1]["name"]+"继续玩耍吧";
                cc.find("label",self.node).getComponent(cc.Label).string = str1;
                cc.find("num",self.node).getComponent(cc.Label).string = "X"+data[level-1]["getHappyBeans"];
                cc.find("pay/btn_right/label",self.node).getComponent(cc.Label).string = data[level-1]["costDiamond"]+"充值";
                //先求出每个页签中商品的数量
                util.log( data );
                self._shopData = data;
                
            };
            if (config.gameShopData) {
                doGetSh(config.gameShopData);
            }else{
                util.loadJsonFile("json/GeneralShop_Common", function (data) {
                    config.gameShopData = data;
                    if (config.gameShopData) {
                        doGetSh(config.gameShopData);
                        //
                    }
                });
            }

            if(leftCallback){//取消按钮回调
                this._leftCallback = leftCallback;
            } 
            if(rightCallback){//充值按钮回调
                this._rightCallback = rightCallback;
            }
            
        }
    },
    onBtnFangqi:function(){
        audioUtils.playClickSoundEffect();
        if(this._leftCallback){
            this._leftCallback();
        }
        this.node.destroy();
    },
    onBtnLingqu:function(){
        audioUtils.playClickSoundEffect();
        // if(this._centerCallback){
        //     this._centerCallback();
        // }

        var self = this;
        util.getsupplyState(//领取救济金 
            function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){
                    
                    var msg = JSON.parse(respJsonInfo['msg']);
                    gameData.gameBean = msg["playerMoney"]["happyBeans"];
                    util.loadPrefab("gongxihuode",function(data){
                        var gongxihuode_node = cc.instantiate(data);
                        self.node.parent.addChild(gongxihuode_node);
                        var reward_info = "1000_1001_"+self._lingquNum;
                        
                        gongxihuode_node.getComponent("gongxihuode").setRewardData(reward_info);
                        if(gameData.morefieldNode){
                            gameData.morefieldNode.emit('setPlayerInfo');
                        }
                        if(gameData.hallNode){
                            gameData.hallNode.emit('setPlayerInfo');
                        }
                        self.node.destroy();
                    });
                }else if(respJsonInfo["code"] == "-32"){
                    util.log("不满足领取救济金条件");
                }else if(respJsonInfo["code"] == "-30"){
                    util.log("救济金配置文件加载失败");
                }else {
                    util.log("领取救济金失败 ===  "+respJsonInfo["code"]);
                }
            }
        );        
        
                    
    },
    onBtnChongzhi:function(){
        var self = this;
        var _nowClickShopId = self._payLevel;
        var _nowPropId = self._shopData[self._payLevel-1].propId;
        var _propId = this._shopData[_nowClickShopId+5].propId;
        var _qqId = this._shopData[_nowClickShopId+5].qqid*1;
        util.getBuyBeanStatus({//买豆
            shopId : _nowClickShopId,
            propId : _nowPropId,
            callBack : function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){
                    util.log("BuyBean成功 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);

                    var oldBeans = gameData.gameBean;
                    gameData.gameBean = msg["playerMoney"]["happyBeans"];
                    gameData.gameDiamond = msg["playerMoney"]["diamond"];
                    
                    if(gameData.morefieldNode){
                        gameData.morefieldNode.emit('setPlayerInfo');
                    }
                    if(gameData.hallNode){
                        gameData.hallNode.emit('setPlayerInfo');
                    }
                    if (cc.director.getScene()) {
                        let scene = cc.director.getScene();
                        if (scene.name === "game") {
                            scene.getChildByName("Canvas").getComponent("GameScene").event.emit("refreshPlayerMoney", {data : {}});
                        }else if(scene.name === "game_pdk"){
                            scene.getChildByName("Canvas").getComponent("GamePDKScene").event.emit("refreshPlayerMoney", {data : {}});
                        }
                    }
                    //
                   
                    // that.node.parent.emit('taskProgressDataUpdate');//
                   
                    var arr_reward = null;
                    var isToMail =  null;
                    
                    //增加了金豆
                    arr_reward = "1000_1001_"+(gameData.gameBean-oldBeans);
                    //刷新排行榜//add by majiangfan
                    if(gameData.hallNode){
                        gameData.hallNode.emit('updatePHB');
                    }
                    if (arr_reward && !isToMail) {
                        util.loadPrefab("gongxihuode",function(data){
                            var gongxihuode_node = cc.instantiate(data);
                            // if(gameData.morefieldNode){
                            //     gameData.morefieldNode.addChild(gongxihuode_node);//在游戏外添加到场次选择节点上，在游戏内看情况（self.Node（就是提示充值界面）被销毁了）
                            // }
                            self.node.parent.addChild(gongxihuode_node);
                            gongxihuode_node.getComponent("gongxihuode").setRewardData(arr_reward);
                            self.node.destroy();
                        });
                    }
                    //请求刷新红点
                    util.refreshAllRedStatus();
                    //
                } else if (respJsonInfo["code"] == "-15") {//钻石不够，不能买豆，去充值买钻
                   

                    // 钻石不够直接掉充值，充值成功之后， 直接换成对应数量的豆子
                    sdk.payPurchase(_qqId, 1, function (openId, openKey) {
                        util.getBuyBeanStatus({
                            shopId : _nowClickShopId+6,
                            propId : _propId,
                            openId : openId,
                            openKey : openKey,
                            callBack : function(respJsonInfo){
                                if(respJsonInfo["code"] == "0"){//买钻成功
                                    util.log("BuyBean成功 +=== "+ respJsonInfo['msg']);
                                    var msg = JSON.parse(respJsonInfo['msg']);
            
                                    var oldDiamond = gameData.gameDiamond;
                                    var str = "之前豆="+gameData.gameBean+"    之前钻="+gameData.gameDiamond+"  豆="+msg["playerMoney"]["happyBeans"]+"    钻="+msg["playerMoney"]["diamond"];
                                    gameData.gameBean = msg["playerMoney"]["happyBeans"];
                                    gameData.gameDiamond = msg["playerMoney"]["diamond"];
                                    
                                    
                                    if(gameData.morefieldNode){
                                        gameData.morefieldNode.emit('setPlayerInfo');
                                    }
                                    if(gameData.hallNode){
                                        gameData.hallNode.emit('setPlayerInfo');
                                    }
            
                                   
                                    //获得钻石后不提示恭喜获得钻石，直接换成豆子，提示获得了多少豆子
                                    var arr_reward = null;
                                    arr_reward = "1000_1002_"+(gameData.gameDiamond-oldDiamond);
                                    
                                    if(gameData.gameDiamond > oldDiamond){//钻石成功到账
                                        var str1 = "_nowClickShopId == "+_nowClickShopId+"_nowPropId == "+_nowPropId;
                                        
                                        util.getBuyBeanStatus({//买相应档位的金豆///买钻成功 要去买豆
                                            shopId : _nowClickShopId,
                                            propId : _nowPropId,
                                            callBack : function(respJsonInfo){
                                                if(respJsonInfo["code"] == "0"){//买豆成功
                                                    util.log("BuyBean成功 +=== "+ respJsonInfo['msg']);
                                                    var msg = JSON.parse(respJsonInfo['msg']);
                                
                                                    var oldBeans = gameData.gameBean;
                                                    gameData.gameBean = msg["playerMoney"]["happyBeans"];
                                                    gameData.gameDiamond = msg["playerMoney"]["diamond"];
                                                    
                                                    if(gameData.morefieldNode){
                                                        gameData.morefieldNode.emit('setPlayerInfo');
                                                    }
                                                    if(gameData.hallNode){
                                                        gameData.hallNode.emit('setPlayerInfo');
                                                    }
                                                    if (cc.director.getScene()) {
                                                        let scene = cc.director.getScene();
                                                        if (scene.name === "game") {
                                                            scene.getChildByName("Canvas").getComponent("GameScene").event.emit("refreshPlayerMoney", {data : {}});
                                                        }else if(scene.name === "game_pdk"){
                                                            scene.getChildByName("Canvas").getComponent("GamePDKScene").event.emit("refreshPlayerMoney", {data : {}});
                                                        }
                                                    }
                                                    //
                                                   
                                                    // that.node.parent.emit('taskProgressDataUpdate');//
                                                   
                                                    var arr_reward = null;
                                                    var isToMail =  null;
                                                    
                                                    //增加了金豆
                                                    arr_reward = "1000_1001_"+(gameData.gameBean-oldBeans);
                                                    //刷新排行榜//add by majiangfan
                                                    if(gameData.hallNode){
                                                        gameData.hallNode.emit('updatePHB');
                                                    }
                                                    // self.node.parent.emit('updatePHB');
                                                    if (arr_reward && !isToMail) {
                                                        util.loadPrefab("gongxihuode",function(data){
                                                            var gongxihuode_node = cc.instantiate(data);
                                                            // if(gameData.morefieldNode){
                                                            //     gameData.morefieldNode.addChild(gongxihuode_node);//在游戏外添加到场次选择节点上，在游戏内看情况（self.Node（就是提示充值界面）被销毁了）
                                                            // }
                                                            self.node.parent.addChild(gongxihuode_node);//游戏内小结算界面也要弹出 恭喜获得
                                                            gongxihuode_node.getComponent("gongxihuode").setRewardData(arr_reward);
                                                            self.node.destroy();
                                                        });
                                                    }
                                                    //请求刷新红点
                                                    util.refreshAllRedStatus();
                                                    //
                                                    //
                                                    //成功之后直接进入游戏
                                                        //进入游戏的参数。。。。
                                                    //
                                                } else if (respJsonInfo["code"] == "-15") {//钻石不够
                                                    //钻石成功到账之后肯定会够
                                                } else {
                                                    util.log("getBuyBeanStatus ===  "+respJsonInfo["code"]);
                                                }
                                            }
                                        });
                                    }else{
                                        
                                    }
            
                                } else {
                                    util.log("getBuyBeanStatus ===  "+respJsonInfo["code"]);
                                }
                            }
                        });
                    });

                } else {
                    util.log("getBuyBeanStatus ===  "+respJsonInfo["code"]);
                }
            }
        });
        audioUtils.playClickSoundEffect();
        if(this._rightCallback){
            this._rightCallback();
        }
        // self.node.destroy();
        // this.node.destroy();
    },
    // update (dt) {},
});
