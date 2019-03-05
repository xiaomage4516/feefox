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
        // leftPrefab: {
        //     default: null,
        //     type: cc.Prefab
        // },
        leftScrollView: {
            default: null,
            type: cc.ScrollView
        },
        // rightPrefab: {
        //     default: null,
        //     type: cc.Prefab
        // },
        rightScrollView: {
            default: null,
            type: cc.ScrollView
        },
        // leftBtnPic: {
        //     default: [],
        //     type: cc.SpriteFrame
        // },//亮状态
        //左边列表
        _leftBtnData:null,
        _leftContent:null,
        _leftItemTemp:null,
        _nowSelLeftBtn:null,//设置左边按钮显示那个按钮高亮的时候用了一下

        _nowClickBtnId:null,//当前点击左边按钮的ID
        _nowClickGameId:null,//当前点击右边按钮的玩法ID 

        //右边列表
        _rightBtnData:null,
        _rightContent:null,
        _rightItemTemp:null,
        _nowSelrightBtn:null,

        //子界面
        _detailedRuleNode:null,
        btnLeft:cc.Node,
        btnRight:cc.Node,
        btnLeft_1:cc.Node,
        btnRight_1:cc.Node,
        basicRuleNode:cc.Node,
        pettyRuleNode:cc.Node,
        btn_change:cc.Node,
        image_jqqd:cc.Node,
        basicRuleTxt:cc.Label,
        pettyRuleTxt:cc.Label,


        gameBean:cc.Label,//游戏豆
        gameDiamond:cc.Label,//钻石

        centerNode:cc.Node,//适配节点
        leftUpNode:cc.Node,
        bgAllNode:cc.Node,//背景节点，适配
        shipeiNode:cc.Node,//子界面适配节点
        anim:cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function () {
        //
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.centerNode.scale = 0.74;
            this.shipeiNode.scale = 0.78;
            this.leftUpNode.scale = 0.80;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.centerNode.scale = 0.85;
            this.shipeiNode.scale = 0.85;
            this.leftUpNode.scale = 0.85;
        }else if(gameData.canvasWidth/gameData.canvasHeight>2){
            this.bgAllNode.scaleX = 1.1;
        }
        this.leftUpNode.x  = -gameData.canvasWidth/2;//适配
        this.leftUpNode.y  = gameData.canvasHeight/2;//适配
        //
        var self = this;

        //默认子界面不显示
        this._detailedRuleNode = cc.find("detailedRule",this.node);
        this._detailedRuleNode.active = false;

        this.gameBean.string = util.showNum(gameData.gameBean);//
        this.gameDiamond.string = util.showNum(gameData.gameDiamond);

        // this._leftContent = cc.find("Canvas/moreAreas/leftList/view/content");
        //左边
        this._leftContent = cc.find("centerNode/center/leftList/view/content",this.node);
        this._leftItemTemp = this._leftContent.children[0];
        this._leftContent.removeChild(this._leftItemTemp);

        //右边
        this._rightContent = cc.find("centerNode/center/rightList/view/content",this.node);
        this._rightItemTemp = this._rightContent.children[0];
        this._rightContent.removeChild(this._rightItemTemp);

        var doGetGc = function(data) {
            //左边数据
            util.log( data );
            util.log("左边按钮数量 ： " + data.length);
            self._leftBtnData = data;
            util.log("左边按钮数量1 ： " + self._leftBtnData.length);
            //名字显示格式不对，可以在这里转格式；

            if(self._leftBtnData.length === 0){
                self._leftContent.setVisible(false);
            }
            self.initLeftBtnList(self._leftBtnData);

            //右边数据
            //默认右边显示第一个玩法的数据
            util.log("右边按钮数量 ： " + data[0]["ziwanfa"].length);
            util.log( data[0]["ziwanfa"] );
            self._rightBtnData = data[0]["ziwanfa"];
            util.log("右边按钮数量1 ： " + self._rightBtnData.length);

            if(self._rightBtnData.length == 0){
                self._rightContent.setVisible(false);
            }
            self._nowClickBtnId = 0;//默认点击的左边按钮ID为0
            self.initRightList(self._rightBtnData);
        };
        if (config.gamechoiceData) {
            doGetGc(config.gamechoiceData);
        }else{
            //进入界面初始化设置左边按钮数据 ， 和右边按钮数据（默认第一个玩法的），点击按钮后更新右边数据
            util.loadJsonFile("json/Gamechoice_Common", function (data) {
                config.gamechoiceData = data;
                if (config.gamechoiceData) {
                    doGetGc(config.gamechoiceData);
                    //
                }
            });
        }
        
        util.log("左边按钮ID == "+ this._nowClickBtnId);
        // this.initButtonHandler(this.node.getChildByName("btn_close"));
        this.playMoreAreasAnim();
    },
    playMoreAreasAnim:function(){
        this.anim.stop("moreAreasAnim");
        this.anim.play("moreAreasAnim");
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
            shopLayer.setPosition(cc.p(shopLayer.getPosition().x,shopLayer.getPosition().y));
            shopLayer.setName("shopLayer");
            self.node.addChild(shopLayer);
        });
    },
    // 初始化左边列表
    initLeftBtnList:function(data){
        this._nowSelLeftBtn = 0;
        for(var i = 0; i < data.length; ++i ){
            var node = this.getLeftItem(i);
            node.idx = i;
            node.setTag(data[i]["id"]);

            util.loadSprite("hall/moreAreas/an/"+parseInt(i+1), cc.find("btn_left_1/txt_image",node));
            util.loadSprite("hall/moreAreas/liang/"+parseInt(i+1), cc.find("btn_left_0/txt_image",node));
            //默认进来选中第一个
            if(i == this._nowSelLeftBtn){
                node.getChildByName("btn_left_0").active = true;
                node.getChildByName("btn_left_1").active = false;
            }else{
                node.getChildByName("btn_left_0").active = false;
                node.getChildByName("btn_left_1").active = true;
            }
            // node.getChildByName("txt_image").getComponent(cc.Sprite).spriteFrame = this.leftBtnPic[i];
            // util.loadSprite("hall/shop/bean/"+data[i]["icon"], cc.find("icon",node));
        }
    },
    // 初始化右边列表
    initRightList:function(data){
        for(var i = 0; i < data.length; ++i ){
            var node = this.getRightItem(i);
            node.idx = i;
            node.setTag(data[i]["ziid"]);
            
            node.getChildByName("btn_right_0").getChildByName("nameTxt").getComponent(cc.Label).string = data[i]["name"];
            node.getChildByName("btn_right_2").getChildByName("nameTxt").getComponent(cc.Label).string = data[i]["name"];
            node.getChildByName("btn_right_0").getChildByName("rule1").getComponent(cc.Label).string = data[i]["des1"];
            node.getChildByName("btn_right_2").getChildByName("rule1").getComponent(cc.Label).string = data[i]["des1"];
            if(data[i]["extra"] == 0){
                cc.find("btn_right_2/extra",node).active = false;
                cc.find("btn_right_0/extra",node).active = false;
            }else{
                cc.find("btn_right_2/extra",node).active = true;
                cc.find("btn_right_0/extra",node).active = true;
                util.loadSprite("hall/moreAreas/"+data[i]["extra"], cc.find("btn_right_2/extra",node));
                util.loadSprite("hall/moreAreas/"+data[i]["extra"], cc.find("btn_right_0/extra",node));
            }
            
            //但是有一个   是否是开放状态
            if(data[i]["isOpen"] == 1){//可以玩
                node.getChildByName("btn_right_0").active = true;
                node.getChildByName("btn_right_2").active = false;
            }else{//暂未开放
                node.getChildByName("btn_right_2").active = true;
                node.getChildByName("btn_right_0").active = false;
            }   

            // node.getChildByName("rule1").getComponent(cc.Label).string = data[i]["des1"];
            
        }
    },
    //添加左边按钮
    getLeftItem:function(index){
        var leftContent = this._leftContent;
        // util.log("左index1234 == " + index);
        // util.log("leftContent.childrenCount == " + leftContent.childrenCount);
        if(leftContent.childrenCount > index){//已经添加过了
            return leftContent.children[index];
        }
        
        var node = cc.instantiate(this._leftItemTemp);
        leftContent.addChild(node);
        return node;
    },
    //添加右边边按钮
    getRightItem:function(index){
        var rightContent = this._rightContent;
        // util.log("右index1234 == " + index);
        // util.log("rightContent.childrenCount == " + rightContent.childrenCount);
        if(rightContent.childrenCount > index){//已经添加过了
            return rightContent.children[index];
        }
        //没有就用prefabs添加 (没有用prefabs添加)
        var node = cc.instantiate(this._rightItemTemp);
        rightContent.addChild(node);
        return node;
    },
    //左边按钮点击回调，设置点击按钮高亮
    onLeftItemClicked:function(event){
        audioUtils.playClickSoundEffect();
        util.log("dianji ： " + this._leftBtnData.length);
        var idx = event.target.idx;
        util.log("点击按钮的IDX  == " + idx);
        this._nowClickBtnId = idx;
        //设置所有按钮为正常状态
        for(var j = 0; j < this._leftBtnData.length;++j){
            var node1 = this._leftContent.getChildByTag(this._leftBtnData[j]["id"]);
            node1.getChildByName("btn_left_1").active = true;
            node1.getChildByName("btn_left_0").active = false;
        };
        //设置点击的按钮为高亮状态
        event.target.getChildByName("btn_left_0").active = true;
        event.target.getChildByName("btn_left_1").active = false;

        //更换右边界面

        for(var j = 0; j < this._rightBtnData.length;++j){
            var node1 = this._rightContent.removeChildByTag(this._rightBtnData[j]["ziid"]);
        };

        this._rightBtnData = this._leftBtnData[idx]["ziwanfa"];//更新右边数据
        this.initRightList(this._leftBtnData[idx]["ziwanfa"]);
    },
    //右边按钮点击回调
    onRightItemClicked:function(event){
        audioUtils.playClickSoundEffect();
        util.log("dianji ： " + this._rightBtnData.length);
        var idx = event.target.idx;
        util.log("点击右边按钮的IDX  == " + idx);
        //显示子界面
        this._nowClickGameId = this._rightBtnData[idx]["ziid"];
        // 默认显示左边
        this.isClickLeft(true);
        
        //设置文字内容
        this.basicRuleTxt.string = this._rightBtnData[idx]["des2"];
        this.pettyRuleTxt.string = this._rightBtnData[idx]["des3"];
        //设置文字是否显示
        if(this._rightBtnData[idx]["isOpen"] == 1){
            this.btn_change.active = true;
            this.image_jqqd.active = false;
        }else{
            this.btn_change.active = false;
            this.image_jqqd.active = true;
        }
        this._detailedRuleNode.active = true;
    },
    onBtnChangeGame:function(){
        audioUtils.playClickSoundEffect();
        util.log("btn_change == "+gameData.selectMapId);
        gameData.selectMapId = this._nowClickGameId;
        this.node.parent.emit('setHallBtnImg');
        this.node.destroy();
    },
    onBtnLeft:function(){
        audioUtils.playClickSoundEffect();
        this.isClickLeft(true);  
    },
    onBtnRight:function(){
        audioUtils.playClickSoundEffect();
        this.isClickLeft(false); 
    },
    isClickLeft:function(isLeft){
        this.btnLeft.active = isLeft;
        this.btnRight.active = !isLeft;
        this.btnLeft_1.active = !isLeft;
        this.btnRight_1.active = isLeft;
        this.basicRuleNode.active = isLeft;
        this.pettyRuleNode.active = !isLeft;
    },
    //关闭子界面
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        this._detailedRuleNode.active = false;
    },
    initButtonHandler:function(btn){
        util.addClickEvent(btn,this.node,"moreAreasScene","onBtnClicked");    
    },
    onBtnClicked:function(event){
        audioUtils.playCloseSoundEffect();
        // if(event.target.name === "btn_close"){
            // this.node.active = false;
            // this.node.removeFromParent(false);
            this.node.destroy();
        // }
    },
    start () {

    },

    // update (dt) {},
});
