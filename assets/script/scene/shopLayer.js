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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        btnBean:cc.Node,
        btnDiamond:cc.Node,
        btnBean_1:cc.Node,
        btnDiamond_1:cc.Node,
        btnProp:cc.Node,
        btnProp_1:cc.Node,
        beanNode:cc.Node,
        diamondNode:cc.Node,
        propNode:cc.Node,
        gameBean:cc.Label,//游戏豆
        gameDiamond:cc.Label,//钻石
        buyNode:{
            default:null,
            type: cc.Node
        },
        buyPropNode:{
            default:null,
            type: cc.Node
        },


        _shopData:null,
        _buyBeanNum:0,
        _buyDiamondNum:0,
        _buyPropNum:0,

        _propContent:null,
        _propItemTemp:null,
        _beanContent:null,
        _beanItemTemp:null,
        _diamondContent:null,
        _diamondItemTemp:null,


        _nowClickShopId:null,
        _nowPropId:null,
        _nowTabType:null,

        leftNode:cc.Node,
        centerNode:cc.Node,
        bgAllNode:cc.Node,//背景节点，适配
        // leftPicNode:cc.Node,
        // leftDown:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        var self = this;
        //
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.centerNode.scale = 0.80;
            this.leftNode.scale = 0.80;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.centerNode.scale = 0.85;
            this.leftNode.scale = 0.85;
        }else if(gameData.canvasWidth/gameData.canvasHeight>2){
            this.bgAllNode.scaleX = 1.1;
        }
        //
        this.leftNode.x  = -gameData.canvasWidth/2;//适配
        this.leftNode.y  = gameData.canvasHeight/2;//适配
        // this.leftDown.x  = gameData.canvasWidth/2;//适配
        // this.leftDown.y  = -gameData.canvasHeight/2;//适配
        // this.leftPicNode.x  = -gameData.canvasWidth/2;//适配

        this.gameBean.string = util.showNum(gameData.gameBean);//
        this.gameDiamond.string = util.showNum(gameData.gameDiamond);

        //右边三个列表  有时间可以改成一个  
        this._propContent = cc.find("centerNode/propNode/scrollView/view/content",this.node);
        this._propItemTemp = this._propContent.children[0];
        this._propContent.removeChild(this._propItemTemp); 

        this._beanContent = cc.find("centerNode/beanNode/scrollView/view/content",this.node);
        this._beanItemTemp = this._beanContent.children[0];
        this._beanContent.removeChild(this._beanItemTemp); 

        this._diamondContent = cc.find("centerNode/diamondNode/scrollView/view/content",this.node);
        this._diamondItemTemp = this._diamondContent.children[0];
        this._diamondContent.removeChild(this._diamondItemTemp); 
        //根据表动态加载图片资源
        var doGetSh = function(data) {
            //先求出每个页签中商品的数量
            util.log( data );
            self._shopData = data;
            util.log("总购买项数量 ： " + self._shopData.length);
            for(var i = 0;i<self._shopData.length;++i){
                if(self._shopData[i]["tabType"] == 1 ){
                    self._buyBeanNum++;
                }else if(self._shopData[i]["tabType"] == 2 ){
                    self._buyDiamondNum++;
                }else if(self._shopData[i]["tabType"] == 3 ){
                    self._buyPropNum++;
                }
            }


            if(self._buyBeanNum=== 0){
                self._beanContent.setVisible(false);
            }
            if(self._buyDiamondNum=== 0){
                self._diamondContent.setVisible(false);
            }
            if(self._buyPropNum === 0){
                self._propContent.setVisible(false);
            }
            self.initShopList(self._shopData);
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
        this.buyNode.active = false;
        this.buyPropNode.active = false;
    },
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        this.node.destroy();
    },
    setfirstLayer:function(str){
        if(str == "bean"){
            this.isClick("bean");
        }else if(str == "diamond"){
            this.isClick("diamond");
        }
    },
    initShopList:function(data){
        util.log("金币标签页购买项数量 ： "+this._buyBeanNum);
        util.log("钻石标签页购买项数量 ： "+this._buyDiamondNum);
        util.log("道具标签页购买项数量 ： "+this._buyPropNum);

        for(var i = 0; i < this._buyBeanNum; ++i ){
            var node = this.getBeanItem(i);
            node.idx = i;
            node.setTag(data[i]["id"]);
            util.log("getBeanItemNode --- tag == " + data[i]["id"]);
            //额外的图标（热卖 新品 等）
            if(data[i]["extIcon"] == 0){
                cc.find("extIcon",node).active = false;
            }else{
                cc.find("extIcon",node).active = true;
                cc.find("extIcon/label",node).getComponent(cc.Label).string = data[i]["extText"];
            }
            //名字
            cc.find("name",node).getComponent(cc.Label).string = data[i]["name"];
            //备注（赠送多少豆）
            if(data[i]["mark"] == ""){
                cc.find("zeng_bg",node).active = false;
                cc.find("zeng_txt",node).active = false;
            }else{
                cc.find("zeng_bg",node).active = true;
                cc.find("zeng_txt",node).active = true;
                cc.find("zeng_txt",node).getComponent(cc.Label).string = data[i]["mark"];
            }
            //描述
            if(data[i]["des"] == ""){
                cc.find("des_txt",node).active = false;
                // cc.find("des_bg",node).active = false;
            }else{
                // cc.find("des_bg",node).active = false;
                cc.find("des_txt",node).active = false;
                // cc.find("des_txt",node).getComponent(cc.Label).string = data[i]["des"];
            }
            //图标
            util.loadSprite("hall/shop/bean/"+data[i]["icon"], cc.find("icon",node));
            //需要消耗多少钻石
            cc.find("price",node).getComponent(cc.Label).string = data[i]["costDiamond"];

        }
        var beanAndDiamondNum = this._buyBeanNum + this._buyDiamondNum;
        for(var j = this._buyBeanNum; j < beanAndDiamondNum; ++j ){
            var node = this.getDiamondItem(j);
            node.idx = j;
            node.setTag(data[j]["id"]);
            util.log("getDiamondItemNode --- tag == " + data[j]["id"]);
            //额外的图标（热卖 新品 等）
            if(data[j]["extIcon"] == 0){
                cc.find("extIcon",node).active = false;
            }else{
                cc.find("extIcon",node).active = true;
                cc.find("extIcon/label",node).getComponent(cc.Label).string = data[j]["extText"];
            }
            //名字
            cc.find("name",node).getComponent(cc.Label).string = data[j]["name"];
            //备注（赠送多少豆）
            if(data[j]["mark"] == ""){
                cc.find("zeng_bg",node).active = false;
                cc.find("zeng_txt",node).active = false;
            }else{
                cc.find("zeng_bg",node).active = true;
                cc.find("zeng_txt",node).active = true;
                cc.find("zeng_txt",node).getComponent(cc.Label).string = data[j]["mark"];
            }
            //描述
            if(data[j]["des"] == ""){
                cc.find("des_txt",node).active = false;
                // cc.find("des_bg",node).active = false;
            }else{
                // cc.find("des_bg",node).active = false;
                cc.find("des_txt",node).active = false;
                // cc.find("des_txt",node).getComponent(cc.Label).string = data[j]["des"];
            }
            //图标
            util.loadSprite("hall/shop/zuan/"+data[j]["icon"], cc.find("icon",node));
            // //需要消耗多少钻石
            cc.find("price",node).getComponent(cc.Label).string = data[j]["price"]+"点券";
        }
        var allNum = beanAndDiamondNum + this._buyPropNum;
        for(var k = beanAndDiamondNum; k < allNum; ++k ){
            var node = this.getPropItem(k);
            node.idx = k;
            node.setTag(data[k]["id"]);
            util.log("getPropItemNode --- tag == " + data[k]["id"]);

            //额外的图标（热卖 新品 等）
            if(data[k]["extIcon"] == 0){
                cc.find("extIcon",node).active = false;
            }else{
                cc.find("extIcon",node).active = true;
                cc.find("extIcon/label",node).getComponent(cc.Label).string = data[k]["extText"];
            }
            //名字
            cc.find("name",node).getComponent(cc.Label).string = data[k]["name"];
            //备注（赠送多少豆）
            if(data[k]["mark"] == ""){
                cc.find("zeng_bg",node).active = false;
                cc.find("zeng_txt",node).active = false;
            }else{
                cc.find("zeng_bg",node).active = true;
                cc.find("zeng_txt",node).active = true;
                cc.find("zeng_txt",node).getComponent(cc.Label).string = data[k]["mark"];
            }
            //描述
            if(data[k]["des"] == ""){
                cc.find("des_txt",node).active = false;
                // cc.find("des_bg",node).active = false;
            }else{
                // cc.find("des_bg",node).active = true;
                cc.find("des_txt",node).active = false;
                // cc.find("des_txt",node).getComponent(cc.Label).string = data[k]["des"];
            }
            //图标
            util.loadSprite("hall/shop/prop/"+data[k]["icon"], cc.find("icon",node));
            //需要消耗多少钻石
            cc.find("price",node).getComponent(cc.Label).string = data[k]["costDiamond"];
        }
    },
    getBeanItem:function(index){
        var beanContent = this._beanContent;
        if(beanContent.childrenCount > index){//已经添加过了
            return beanContent.children[index];
        }
        
        var node = cc.instantiate(this._beanItemTemp);
        beanContent.addChild(node);
        return node;
    },
    getDiamondItem:function(index){
        var diamondContent = this._diamondContent;
        if(diamondContent.childrenCount > index){//已经添加过了
            return diamondContent.children[index];
        }
        
        var node = cc.instantiate(this._diamondItemTemp);
        diamondContent.addChild(node);
        return node;
    },
    getPropItem:function(index){
        var propContent = this._propContent;
        if(propContent.childrenCount > index){//已经添加过了
            return propContent.children[index];
        }
        
        var node = cc.instantiate(this._propItemTemp);
        propContent.addChild(node);
        return node;
    },
    //购买按钮点击回调，金豆和道具都是这个
    onBeanClicked:function(event){
        audioUtils.playClickSoundEffect();
        util.log("dianjiBean ： " + this._buyBeanNum);
        var idx = event.target.parent.idx;
        util.log("点击按钮的IDX  == " + idx);
        var clickShopId = idx + 1;
        var propId = this._shopData[idx].propId;
        var self = this;
        

        this._nowClickShopId = clickShopId;
        this._nowPropId = propId;
        this._nowTabType = this._shopData[idx].tabType;
        if(this._nowTabType == 1){
            cc.find("name",this.buyNode).getComponent(cc.Label).string = this._shopData[idx].name;
            util.loadSprite("hall/shop/bean/"+this._shopData[idx]["icon"], cc.find("icon",this.buyNode));
            //需要消耗多少钻石
            cc.find("price",this.buyNode).getComponent(cc.Label).string = this._shopData[idx].costDiamond;
            this.buyNode.active = true;
            
        }else if(this._nowTabType == 3){//买道具
            cc.find("name",this.buyPropNode).getComponent(cc.Label).string = this._shopData[idx].name;
            cc.find("des",this.buyPropNode).getComponent(cc.Label).string = this._shopData[idx].des;

            //图标
            util.loadSprite("hall/shop/prop/"+this._shopData[idx]["icon"], cc.find("icon",this.buyPropNode));
            //需要消耗多少钻石
            cc.find("price",this.buyPropNode).getComponent(cc.Label).string = this._shopData[idx].costDiamond;
            this.buyPropNode.active = true;
        }
    },
    onbtnBean:function(){
        audioUtils.playClickSoundEffect();
        this.isClick("bean");
    },
    onbtnDiamond:function(){
        audioUtils.playClickSoundEffect();
        this.isClick("diamond"); 
    },
    onbtnProp:function(){
        audioUtils.playClickSoundEffect();
        this.isClick("prop"); 
    },
    isClick:function(str){
        this.btnBean.active = str == "bean"?true:false;
        this.btnBean_1.active = str == "bean"?false:true;
        this.beanNode.active = str == "bean"?true:false;

        this.btnDiamond.active = str == "diamond"?true:false;
        this.btnDiamond_1.active = str == "diamond"?false:true;
        this.diamondNode.active = str == "diamond"?true:false;

        this.btnProp.active = str == "prop"?true:false;
        this.btnProp_1.active = str == "prop"?false:true;
        this.propNode.active = str == "prop"?true:false;
    },
    onBtnQuxiao: function () {
        audioUtils.playClickSoundEffect();
        this.buyNode.active = false;
    },
    onBtnPropQuxiao: function () {
        audioUtils.playClickSoundEffect();
        this.buyPropNode.active = false;
    },
    onBtnQueDing: function () {
        audioUtils.playClickSoundEffect();
        var self = this;
        /**
         * 钻石买金豆
         * 钻石买道具
         * 都是走这个接口
         * */
        var tabType = self._nowTabType;
        util.getBuyBeanStatus({
            shopId : self._nowClickShopId,
            propId : self._nowPropId,
            callBack : function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){
                    util.log("BuyBean成功 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);

                    var oldBeans = gameData.gameBean;
                    gameData.gameBean = msg["playerMoney"]["happyBeans"];
                    gameData.gameDiamond = msg["playerMoney"]["diamond"];
                    self.gameBean.string = util.showNum(gameData.gameBean);//
                    self.gameDiamond.string = util.showNum(gameData.gameDiamond);
                    self.node.parent.emit('setPlayerInfo');
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
                    if (tabType == 1 || tabType == 3) {//
                        /**
                         * 消耗了钻石
                         * emit是发射给直接on监听这个event的node
                         * dispatchEvent为向上级node回溯
                         * */
                        self.node.parent.emit('taskProgressDataUpdate');//
                    }
                    var arr_reward = null;
                    var isToMail =  null;
                    if (tabType == 1) {
                        //增加了金豆
                        arr_reward = "1000_1001_"+(gameData.gameBean-oldBeans);
                        //刷新排行榜//add by majiangfan
                        self.node.parent.emit('updatePHB');

                    } else if (tabType == 3) {
                        //增加了1个道具
                        arr_reward = "2000_"+self._nowPropId+"_1";
                        isToMail = msg["newMail"];
                        if (isToMail) {
                          
                            util.tip3(self.node,"背包已满，道具已发送至邮件")

                        }
                    }
                    if (arr_reward && !isToMail) {
                        util.loadPrefab("gongxihuode",function(data){

                            var gongxihuode_node = cc.instantiate(data);
                            self.node.addChild(gongxihuode_node);

                            gongxihuode_node.getComponent("gongxihuode").setRewardData(arr_reward);

                        });
                    }
                    //请求刷新红点
                    util.refreshAllRedStatus();
                    //
                } else if (respJsonInfo["code"] == "-15") {//钻石不够
                    // util.tip(self.node,2,"您的钻石不足，是否跳转到充值界面？",null,null,function(){
                    //     self.isClick("diamond");
                    // },true,false,true);
                    util.tip({
                        node : self.node,
                        type : 2,
                        string : "您的钻石不足，是否跳转到充值界面？",
                        leftCallback : null,
                        centerCallback : null,
                        rightCallback : function(){
                            self.isClick("diamond");
                        },
                        isShowLeftBtn : true,
                        isShowCenterBtn : false,
                        isShowRightBtn : true
                    });
                } else {
                    util.log("getBuyBeanStatus ===  "+respJsonInfo["code"]);
                }


            }
        });

        if (tabType == 1) {
            this.buyNode.active = false;
        } else if (tabType == 3) {
            this.buyPropNode.active = false;
        }
        


    },

    start () {

    },

    // 购买钻石，调用支付
    onBtnPurchase (event) {
        audioUtils.playClickSoundEffect();
        util.log("dianjiBean ： " + this._buyBeanNum);
        var idx = event.target.parent.idx;
        util.log("点击按钮的IDX  == " + idx);
        var clickShopId = idx + 1;
        var propId = this._shopData[idx].propId;
        var qqId = this._shopData[idx].qqid*1;
        var self = this;
        sdk.payPurchase(qqId, 1, function (openId, openKey) {
            util.getBuyBeanStatus({
                shopId : clickShopId,
                propId : propId,
                openId : openId,
                openKey : openKey,
                callBack : function(respJsonInfo){
                    if(respJsonInfo["code"] == "0"){
                        util.log("BuyBean成功 +=== "+ respJsonInfo['msg']);
                        var msg = JSON.parse(respJsonInfo['msg']);

                        var oldDiamond = gameData.gameDiamond;
                        gameData.gameBean = msg["playerMoney"]["happyBeans"];
                        gameData.gameDiamond = msg["playerMoney"]["diamond"];
                        self.gameBean.string = util.showNum(gameData.gameBean);//
                        self.gameDiamond.string = util.showNum(gameData.gameDiamond);
                        self.node.parent.emit('setPlayerInfo');
                        if(gameData.hallNode){
                            gameData.hallNode.emit('setPlayerInfo');
                        }

                        /**
                         * emit是发射给直接on监听这个event的node
                         * dispatchEvent为向上级node回溯
                         * */
                        //self.node.parent.emit('taskProgressDataUpdate');

                        var arr_reward = null;
                        arr_reward = "1000_1002_"+(gameData.gameDiamond-oldDiamond);
                        //增加了钻石
                        if (arr_reward) {
                            util.loadPrefab("gongxihuode",function(data){

                                var gongxihuode_node = cc.instantiate(data);
                                self.node.addChild(gongxihuode_node);

                                gongxihuode_node.getComponent("gongxihuode").setRewardData(arr_reward);

                            });
                        }

                    } else {
                        util.log("getBuyBeanStatus ===  "+respJsonInfo["code"]);
                    }
                }
            });
        });
        //sdk.payPurchase();
    },

    // update (dt) {},
});
