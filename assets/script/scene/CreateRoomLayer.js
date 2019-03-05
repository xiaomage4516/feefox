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
        selTxt:cc.Label,
        //选择滑动框
        selFrame:cc.Node,
        centerNode:cc.Node,
        
        anim:cc.Animation,

        _isShowList:false,//滑动框
        _selContent:null,
        _selItemTemp:null,
        _showData:[],

        _scrollHeight:null,
        _viewHeight:null,
        _itemHeight:null,

        _nowSelGame:null,//mapid

        _desp:null,//玩法描述
        _jushu:null,//局数
        _zzjushu:null,//郑州局数
        _tdhjushu:null,//郑州局数
        //赖子
        _tdhlaizi:null,
        _laizi:null,
        //荒庄荒杠
        _HZHG:null,
        _zzHZHG:null,
        _tdhHZHG:null,
        //过手胡
        _guoshouhu:null,
        _tdhGuoshouhu:null,
        //七小对翻倍
        _qixiaodui:null,
        _tdhQixiaodui:null,
        //杠上开花
        _GSKS:null,
        _tdhGSKH:null,
        //杠跑
        _gangpao:null,
        _zzGangpao:null,
        //自摸胡点炮胡
        _zimo:null,
        _zzzimo:null,
        //庄家加底
        _zhuangjia:null,
        _zzZhuangjia:null,
        //漏胡
        _louhu:null,
        _zzlouhu:null,
 
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.centerNode.scale = 0.8;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.centerNode.scale = 0.85;
        } 
        //
        this.selFrame.active = false;

        this._selContent = cc.find("centerNode/center/kaifangNode/selNode/scrollView/view/content",this.node);
        this._selItemTemp = this._selContent.children[0];
        this._selContent.removeChild(this._selItemTemp);
        this._scrollHeight = this.selFrame.getContentSize().height;
        this._viewHeight = cc.find("view",this.selFrame).getContentSize().height;
        this._itemHeight = this._selItemTemp.getContentSize().height;
        
        util.log("111111111111 === "+gameData.rule["1001"][0][0].name);
        util.log("222222222222 === "+gameData.rule["1001"][0][0].ruleKey);
        util.log("333333333333 === "+gameData.all_rule[gameData.rule["1001"][0][0].ruleKey]);


        //设置默认显示开房的字和界面
        if(gameData.mapId){
            this._nowSelGame = gameData.mapId;
        }else{
            this._nowSelGame = config.hallDefaulrSelGameId;
        }
        this.setDefaultRule();

        util.log("_nowSelGame  ==  "+this._nowSelGame);

        //读表得到数据
        var self = this;
        var doGetGc = function(data) {
            for(var i = 0;i<data.length;i++){
                if(data[i]["wanfaopen"] == 1){
                    // util.log("qqqqqqqq == "+data[i]["ziwanfa"].length);
                    for(var j = 0;j<data[i]["ziwanfa"].length;j++){
                        if(data[i]["ziwanfa"][j]["isOpen"] == 1){
                            self._showData.push(data[i]["ziwanfa"][j]);
                        }
                    }
                }
            }

            self.initSelLayer(self._showData);
            self.initCreateLyer(self._showData);
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
        
        //读表--end
        this.playCreateRoomAnim();
    },
    playCreateRoomAnim:function(){
        this.anim.stop("createAnim");
        this.anim.play("createAnim");
    },
    start () {
        util.preloadGameScene(this.node);
    },
    //初始化 选择子玩法
    initSelLayer:function(data){
        var showNum = data.length;

        if(showNum <= 5){
            this.selFrame.setContentSize(this.selFrame.getContentSize().width,10+this._itemHeight*showNum);
            cc.find("view",this.selFrame).setContentSize(this.selFrame.getContentSize().width,this._itemHeight*showNum);
        }else{
            this.selFrame.setContentSize(this.selFrame.getContentSize().width,10+this._itemHeight*5);
            cc.find("view",this.selFrame).setContentSize(this.selFrame.getContentSize().width,this._itemHeight*5);
        }
        for(var i = 0; i < data.length; ++i ){
            var node = this.getSelItem(i);
            node.idx = i;
            node.setTag(data[i]["ziid"]);
            if(data[i]["ziid"]==this._nowSelGame){
                node.getChildByName("select").active = true;
                node.getChildByName("label").getComponent(cc.Label).string = data[i]["name"] + "(最近玩过)";
            }else{
                node.getChildByName("select").active = false;
                node.getChildByName("label").getComponent(cc.Label).string = data[i]["name"];
            }
            
            
        }
    },
     
    //new--1 局数回调(不考虑是否显示)
    onBtnJuShu(event,id){
        audioUtils.playClickSoundEffect();
        var wanfa = this._nowSelGame+"";
        gameData.rule_jushu = gameData.rule[wanfa][0][id-1].value;
        cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel1/toggle",this.node).getComponent(cc.Toggle).isChecked = id==1;
        cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel2/toggle",this.node).getComponent(cc.Toggle).isChecked = id==2;
        cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel3/toggle",this.node).getComponent(cc.Toggle).isChecked = id==3;
        util.log("onBtnJuShu  -- 局数按钮  " + gameData.rule_jushu);
    },
    // new--1 规则回调(不考虑是否显示,考虑规则之间的显示规则（如点击A规则，需要隐藏C规则，显示B规则）)
    onBtnRule(event,id){
        audioUtils.playClickSoundEffect();
        var wanfa = this._nowSelGame+"";
        var ruleKey = gameData.rule[wanfa][1][id-1].ruleKey;
        var huchi = gameData.rule[wanfa][1][id-1].huchi;
        var teyou = gameData.rule[wanfa][1][id-1].teyou;
        var yincang = gameData.rule[wanfa][1][id-1].yincang;
        var chongtu = gameData.rule[wanfa][1][id-1].chongtu;
        // if(id == 1){

        if(teyou.length > 0){
            for(var i = 0; i < teyou.length; i++){
                var num = teyou[i] + 1;
                cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+num,this.node).active = true;
            }
        }
        if(yincang.length > 0){
            for(var i = 0; i < yincang.length; i++){
                var num = yincang[i] + 1;
                cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+num,this.node).active = false;
            }
        }
        if(huchi.length > 0){//互斥k
            gameData.all_rule[ruleKey] = gameData.rule[wanfa][1][id-1].value;
            cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+id+"/toggle",this.node).getComponent(cc.Toggle).isChecked = true;
            for(var i = 0; i < huchi.length; i++){
                var num = huchi[i] + 1;
                util.log("切换互斥规则，取消选中的num  ==  "+num);
                cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+num+"/toggle",this.node).getComponent(cc.Toggle).isChecked = false;
            }
        }else if(chongtu.length > 0){
            if(cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+id+"/toggle",this.node).getComponent(cc.Toggle).isChecked){
                util.log("111111111");
                gameData.all_rule[ruleKey] = gameData.rule[wanfa][1][id-1].value;
                cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+id+"/toggle",this.node).getComponent(cc.Toggle).isChecked = true;
                for(var i = 0; i < chongtu.length; i++){
                    var num = chongtu[i] + 1;
                    var otherRule = gameData.rule[wanfa][1][num-1].ruleKey;
                    gameData.all_rule[otherRule] = false;
                    var node = cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+num+"/huise",this.node);
                    util.loadSprite("hall/createRoom/bg_h_"+gameData.rule[wanfa][1][num-1].type, node);
                    node.active = true;
                }
            }else{
                util.log("222222222");
                gameData.all_rule[ruleKey] = !gameData.rule[wanfa][1][id-1].value;
                cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+id+"/toggle",this.node).getComponent(cc.Toggle).isChecked = false;
                for(var i = 0; i < chongtu.length; i++){
                    var num = chongtu[i] + 1;
                    var otherRule = gameData.rule[wanfa][1][num-1].ruleKey;
                    gameData.all_rule[otherRule] = false;
                    var node = cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+num+"/huise",this.node);
                    node.active = false;
                }
            }


            // gameData.all_rule[ruleKey] = gameData.rule[wanfa][1][id-1].value;
            // cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+id+"/toggle",this.node).getComponent(cc.Toggle).isChecked = true;
            // for(var i = 0; i < chongtu.length; i++){
            //     var num = chongtu[i] + 1;
            //     util.log("修改冲突规则，取消选中的num  ==  "+num);
            //     var node = cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+num+"/toggle/Background",this.node)
            //     cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+num+"/toggle",this.node).getComponent(cc.Toggle).isChecked = false;
            //     // util.loadSprite("hall/createRoom/bg_3", node);
                
            // }
        }else{//正常点击
            if(cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+id+"/toggle",this.node).getComponent(cc.Toggle).isChecked){
                gameData.all_rule[ruleKey] = gameData.rule[wanfa][1][id-1].value;
                cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+id+"/toggle",this.node).getComponent(cc.Toggle).isChecked = true;
            }else{
                gameData.all_rule[ruleKey] = !gameData.rule[wanfa][1][id-1].value;
                cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+id+"/toggle",this.node).getComponent(cc.Toggle).isChecked = false;
            }
        }
            
    },
    //设置规则界面 哪个显示(只负责显示和位置，是否选中不在这里)
    setRuleLayer:function(){
        var wanfa = this._nowSelGame+"";
        //局数（不同玩法，显示不同）
        cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel1",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel2",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel3",this.node).active = false;
        for(var i = 1; i <= gameData.rule[wanfa][0].length;i++){
            if(gameData.rule[wanfa][0][i-1].isShow){
                cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel"+i,this.node).active = true;
            }else{
                cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel"+i,this.node).active = false;
            }
            cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel"+i,this.node).x = gameData.rule[wanfa][0][i-1].posX;
            cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel"+i,this.node).y = gameData.rule[wanfa][0][i-1].posY;
            cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel"+i+"/label",this.node).getComponent(cc.Label).string = gameData.rule[wanfa][0][i-1].name;
        }

        //规则
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel1/huise",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel2/huise",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel3/huise",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel4/huise",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel5/huise",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel6/huise",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel7/huise",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel8/huise",this.node).active = false;
        
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel1",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel2",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel3",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel4",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel5",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel6",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel7",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel8",this.node).active = false;

        for(var i = 1; i <= gameData.rule[wanfa][1].length;i++){
            cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+i,this.node).active = true;
            if(gameData.rule[wanfa][1][i-1].isShow){
                cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+i,this.node).active = true;
            }else{
                cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+i,this.node).active = false;
            }
            cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+i,this.node).x = gameData.rule[wanfa][1][i-1].posX;
            cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+i,this.node).y = gameData.rule[wanfa][1][i-1].posY;
            util.loadSprite("hall/createRoom/bg_"+gameData.rule[wanfa][1][i-1].type, cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+i+"/toggle/Background",this.node));
            util.loadSprite("hall/createRoom/btn_"+gameData.rule[wanfa][1][i-1].type, cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+i+"/toggle/checkmark",this.node));
            cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+i+"/label",this.node).getComponent(cc.Label).string = gameData.rule[wanfa][1][i-1].name;
        }

        //虚线
        cc.find("centerNode/center/ruleLayer/wanfaNode/xuxian1",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/xuxian2",this.node).active = false;
        cc.find("centerNode/center/ruleLayer/wanfaNode/xuxian3",this.node).active = false;

        for(var i = 1; i <= gameData.rule[wanfa][2].length;i++){
            cc.find("centerNode/center/ruleLayer/wanfaNode/xuxian"+i,this.node).active = true;
            cc.find("centerNode/center/ruleLayer/wanfaNode/xuxian"+i+"/wanfa",this.node).getComponent(cc.Label).string = gameData.rule[wanfa][2][i-1].name;
        }

    },
    //初始化创建房间界面
    initCreateLyer:function(data){
        //上面的字
        for(var i = 0;i<data.length;i++){
            if(data[i]["ziid"]==this._nowSelGame){
                this.selTxt.string = data[i]["name"] + "(最近玩过)";
                break;
            }
        }
        //下面的规则
        this.setRuleLayer();

    },
    //切换玩法之后，设置规则选择 new--3
    setRuleToggle(){//有记忆功能(待做。。。)
        var wanfa = this._nowSelGame+"";
        for(var i = 1; i <= gameData.rule[wanfa][0].length;i++){
            cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel"+i+"/toggle",this.node).getComponent(cc.Toggle).isChecked = gameData.rule[wanfa][0][i-1].isMoRen;
            if(gameData.rule[wanfa][0][i-1].isMoRen){//如果是默认，记录当前局数
                gameData.rule_jushu = gameData.rule[wanfa][0][i-1].value;
            }
            
        }
        util.log("setRuleToggle  --  切换之后局数  " + gameData.rule_jushu);

        for(var i = 1; i <= gameData.rule[wanfa][1].length;i++){
            cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+i+"/toggle",this.node).getComponent(cc.Toggle).isChecked = gameData.rule[wanfa][1][i-1].isMoRen;
            //判断是不是互斥
            var huchi = gameData.rule[wanfa][1][i-1].huchi;
            var ruleKey = gameData.rule[wanfa][1][i-1].ruleKey;
            if(huchi.length == 0){//不是互斥
                if(gameData.rule[wanfa][1][i-1].isMoRen){//
                    gameData.all_rule[ruleKey] = gameData.rule[wanfa][1][i-1].value;
                }else{
                    gameData.all_rule[ruleKey] = !gameData.rule[wanfa][1][i-1].value;
                }
            }else{
                if(gameData.rule[wanfa][1][i-1].isMoRen){//是互斥的肯定有一个是默认
                    gameData.all_rule[ruleKey] = gameData.rule[wanfa][1][i-1].value;
                }
                
            }
            
        }
    },
    //new--2
    setDefaultRule:function(){//初始默认
        //先这样写最后再整合
        //设置各玩法规则的默认状态
  

        var wanfa = this._nowSelGame+"";
        for(var i = 1; i <= gameData.rule[wanfa][0].length;i++){
            cc.find("centerNode/center/ruleLayer/jushuNode/jushuSel"+i+"/toggle",this.node).getComponent(cc.Toggle).isChecked = gameData.rule[wanfa][0][i-1].isMoRen;
            if(gameData.rule[wanfa][0][i-1].isMoRen){//如果是默认，记录当前局数
                gameData.rule_jushu = gameData.rule[wanfa][0][i-1].value;
            }
            
        }
        util.log("setDefaultRule  --  默认局数  " + gameData.rule_jushu);

        for(var i = 1; i <= gameData.rule[wanfa][1].length;i++){
            cc.find("centerNode/center/ruleLayer/wanfaNode/wanfaSel"+i+"/toggle",this.node).getComponent(cc.Toggle).isChecked = gameData.rule[wanfa][1][i-1].isMoRen;
            //判断是不是互斥
            var huchi = gameData.rule[wanfa][1][i-1].huchi;
            var ruleKey = gameData.rule[wanfa][1][i-1].ruleKey;
            if(huchi.length == 0){//不是互斥
                if(gameData.rule[wanfa][1][i-1].isMoRen){//
                    gameData.all_rule[ruleKey] = gameData.rule[wanfa][1][i-1].value;
                }else{
                    gameData.all_rule[ruleKey] = !gameData.rule[wanfa][1][i-1].value;
                }
            }else{
                if(gameData.rule[wanfa][1][i-1].isMoRen){//是互斥的肯定有一个是默认
                    gameData.all_rule[ruleKey] = gameData.rule[wanfa][1][i-1].value;
                }
                
            }
            
        }


    },
    
    getSelItem:function(index){
        var selContent = this._selContent;
        if(selContent.childrenCount > index){//已经添加过了
            return selContent.children[index];
        }
        
        var node = cc.instantiate(this._selItemTemp);
        selContent.addChild(node);
        return node;
    },
    // update (dt) {},  选择具体玩法按钮
    obBtnUpdateLayer:function(event){
        audioUtils.playClickSoundEffect();
        util.log("dianji ： " + this._showData.length);
        var idx = event.target.parent.idx;
        util.log("点击按钮的IDX  == " + idx);
        //更新当前选择的玩法
        this._nowSelGame = this._showData[idx]["ziid"];
        util.log("this._nowSelGame == " + this._nowSelGame);

        for(var j = 0; j < this._showData.length;++j){
            var node1 = this._selContent.getChildByTag(this._showData[j]["ziid"]);
            node1.getChildByName("select").active = false;
        };
        event.target.parent.getChildByName("select").active = true;
        //更新上面的字
        this.selTxt.string = this._showData[idx]["name"] + "(最近玩过)";
        //更新下面的界面
        this.setRuleLayer();//以前是不同layer，需要切换layer，现在改成一个layer，不需要切换，但是需要更换显示内容
        //除了更换显示内容，还要设置规则是否选中
        this.setRuleToggle();
        //选择界面消失
        this.selFrame.active = false;
        this._isShowList = false;
    },

    onBtnClose () {
        audioUtils.playCloseSoundEffect();
        // this.node.active = false;
        this.node.destroy();
    },
    //是否打开选择玩法List
    onBtnShowSel:function(){ 


        audioUtils.playClickSoundEffect();
        if(!this._isShowList){
            this.selFrame.active = true;
            this._isShowList = true;
        }else{
            this.selFrame.active = false;
            this._isShowList = false;
        }
    },
    //创建房间规则
    onBtnCreateRoom () {
        audioUtils.playClickSoundEffect();
        // util.log("jushu  ==  "+gameData.rule_jushu);//局数
        // util.log("_nowSelGame  ==  "+this._nowSelGame);//玩法
        // util.log("_laizi  ==  "+this._laizi);//玩法
        // util.log("_hzhg  ==  "+this._HZHG);//荒庄荒杠
        // util.log("_guoshouhu  ==  "+this._guoshouhu);//guoshouhu
        // util.log("_qixiaodui  ==  "+this._qixiaodui);//qixiaodui
        // util.log("_gangpao  ==  "+this._gangpao);//qixiaodui
        // util.log("_zimo  ==  "+this._zimo);//自摸
        // util.log("_zzjd  ==  "+this._zhuangjia);//庄家加底
        // util.log("_louhu  ==  "+this._louhu);//漏胡

        util.log("jushu  ==  "+gameData.rule_jushu);//局数
        util.log("_nowSelGame  ==  "+this._nowSelGame);//玩法
        util.log("_laizi  ==  "+gameData.all_rule["rule_laizi"]);//玩法
        util.log("_hzhg  ==  "+gameData.all_rule["rule_HZHG"]);//荒庄荒杠
        util.log("_guoshouhu  ==  "+gameData.all_rule["rule_guoshouhu"]);//guoshouhu
        util.log("_qixiaodui  ==  "+gameData.all_rule["rule_qixiaodui"]);//qixiaodui
        util.log("_gangpao  ==  "+gameData.all_rule["rule_gangpao"]);//qixiaodui
        util.log("_zimo  ==  "+gameData.all_rule["rule_zimo"]);//自摸
        util.log("_zzjd  ==  "+gameData.all_rule["rule_zhuangjia"]);//庄家加底
        util.log("_louhu  ==  "+gameData.all_rule["rule_louhu"]);//漏胡
        util.log("_gangshangkaihua  ==  "+gameData.all_rule["rule_GSKS"]);//漏胡
        util.log("rule_youdabichu  ==  "+gameData.all_rule["rule_youdabichu"]);//有大必出
        util.log("rule_shouchuxuanze  ==  "+gameData.all_rule["rule_shouchuxuanze"]);//首出选择
        util.log("rule_xiajuxianchu  ==  "+gameData.all_rule["rule_xiajuxianchu"]);//下家先出

        util.log("rule_zuitype  ==  "+gameData.all_rule["rule_zuitype"]);//嘴子类型
        util.log("rule_luan3feng  ==  "+gameData.all_rule["rule_luan3feng"]);//乱三风
        util.log("rule_dahu  ==  "+gameData.all_rule["rule_dahu"]);//大胡
        util.log("rule_dazui  ==  "+gameData.all_rule["rule_dazui"]);//大嘴
        {
            //郑州选择玩法
            var detailedWanFan_zz = "带字牌";
            if(gameData.all_rule["rule_zimo"]){
                detailedWanFan_zz += "、自摸";
            }else{
                detailedWanFan_zz += "、点炮";
            }
            if(gameData.all_rule["rule_zhuangjia"]){
                detailedWanFan_zz += "、庄家加底";
            }
            if(gameData.all_rule["rule_gangpao"]){
                detailedWanFan_zz += "、杠跑";
            }
            if(gameData.all_rule["rule_louhu"]){
                detailedWanFan_zz += "、漏胡";
            }
            if(gameData.all_rule["rule_HZHG"]){
                detailedWanFan_zz += "、荒庄荒杠";
            }
            
            var detailedFanXin_zz = "清一色、杠上开花、七小对翻倍";
        }
        {
            //南阳选择玩法
            var detailedWanFan_nanyang = "带字牌";
            if(gameData.all_rule["rule_zimo"]){
                detailedWanFan_nanyang += "、自摸";
            }else{
                detailedWanFan_nanyang += "、点炮";
            }
            if(gameData.all_rule["rule_zhuangjia"]){
                detailedWanFan_nanyang += "、庄家加底";
            }
            if(gameData.all_rule["rule_gangpao"]){
                detailedWanFan_nanyang += "、杠漂";
            }
            if(gameData.all_rule["rule_louhu"]){
                detailedWanFan_nanyang += "、漏胡";
            }
            if(gameData.all_rule["rule_HZHG"]){
                detailedWanFan_nanyang += "、荒庄荒杠";
            }
            
            var detailedFanXin_nanyang= "清一色、杠上开花、七小对翻倍";
        }
        
        {
            //周口选择玩法
            var detailedWanFan_zhoukou = "带字牌";
            if(gameData.all_rule["rule_zimo"]){
                detailedWanFan_zhoukou += "、自摸";
            }else{
                detailedWanFan_zhoukou += "、点炮";
            }
            if(gameData.all_rule["rule_gangdiliupai"]){
                detailedWanFan_zhoukou += "、杠底留牌";
            }
            if(gameData.all_rule["rule_gangpao"]){
                detailedWanFan_zhoukou += "、杠漂";
            }
            if(gameData.all_rule["rule_louhu"]){
                detailedWanFan_zhoukou += "、漏胡";
            }
            if(gameData.all_rule["rule_HZHG"]){
                detailedWanFan_zhoukou += "、荒庄荒杠";
            }
            
            var detailedFanXin_zhoukou= "清一色、杠上开花、七小对翻倍";
        }

        {
            //推倒胡选择玩法
            var detailedWanFan_tdh = "带字牌";
            if(gameData.all_rule["rule_laizi"]){
                detailedWanFan_tdh += "、赖子";
            }
            if(gameData.all_rule["rule_HZHG"]){
                detailedWanFan_tdh += "、荒庄荒杠";
            }
            if(gameData.all_rule["rule_guoshouhu"]){
                detailedWanFan_tdh += "、过手胡";
            }
            var detailedFanXin_tdh = "清一色";
            if(gameData.all_rule["rule_qixiaodui"]){
                detailedFanXin_tdh += "、七小对翻倍";
            }
            if(gameData.all_rule["rule_GSKS"]){
                detailedFanXin_tdh += "、杠上开花";
            }

        }

        {
            var detailedWanFan_pdk = "3人";
            if(gameData.all_rule["rule_youdabichu"]){
                detailedWanFan_pdk += "、有大必出";
            }
            if(gameData.all_rule["rule_shouchuxuanze"] == 1){
                detailedWanFan_pdk += "、黑桃三先出";
            }
            if(gameData.all_rule["rule_shouchuxuanze"] == 2){
                detailedWanFan_pdk += "、红桃三先出";
            }
            if(gameData.all_rule["rule_shouchuxuanze"] == 3){
                detailedWanFan_pdk += "、方块三先出";
            }
            if(gameData.all_rule["rule_xiajuxianchu"] == 1){
                detailedWanFan_pdk += "、下局3先出";
            }
            if(gameData.all_rule["rule_xiajuxianchu"] == 2){
                detailedWanFan_pdk += "、下局赢家先出";
            }
        }

        {
            //信阳选择玩法
            var detailedWanFan_xinyang = "带字牌";
            if(gameData.all_rule["rule_zuitype"] == 1){
                detailedWanFan_xinyang += "、七公嘴";
            }
            if(gameData.all_rule["rule_zuitype"] == 2){
                detailedWanFan_xinyang += "、十公嘴";
            }
            if(gameData.all_rule["rule_zuitype"] == 3){
                detailedWanFan_xinyang += "、满堂跑";
            }
            if(gameData.all_rule["rule_luan3feng"]){
                detailedWanFan_xinyang += "、乱三风";
            }
            if(gameData.all_rule["rule_dahu"]){
                detailedWanFan_xinyang += "、大胡";
            }
            
            



            var detailedFanXin_xinyang = "小嘴1分";
            if(gameData.all_rule["rule_dazui"] == 2){
                detailedFanXin_xinyang += "、大嘴2分";
            }
            if(gameData.all_rule["rule_dazui"] == 5){
                detailedFanXin_xinyang += "、大嘴5分";
            }
            if(gameData.all_rule["rule_zimo"]){
                detailedFanXin_xinyang += "、自摸翻倍";
            }else{
                detailedFanXin_xinyang += "、点炮胡";
            }
            

        }

        var self = this;
        util.getPlayTypeStatus({
            gameId : config.HENAN_TUIDAOHU,//这个gameId在这里没用
            gameType : config.KIND_FRIEND,
            gameLevel : 0,
            fieldId : 0,
            callBack : function(respJsonInfo){
                util.log("CreateRoom connect success");
                // 创建房间
                if(self._nowSelGame == config.HENAN_ZHENGZHOU){//郑州麻将
                    var map = {
                        dahu : 0,
                        detailedWanFa : encodeURIComponent(detailedWanFan_zz),
                        detailedFanXing : encodeURIComponent(detailedFanXin_zz),
                        jushu : gameData.rule_jushu,
                        mapid : self._nowSelGame,
                        // onlyzimo : self._zimo,
                        onlyzimo : gameData.all_rule["rule_zimo"],
                        // gangpao : self._gangpao,
                        gangpao : gameData.all_rule["rule_gangpao"],
                        // zhuangjiadi : self._zhuangjia,
                        zhuangjiadi : gameData.all_rule["rule_zhuangjia"],
                        // louhu : self._louhu,
                        louhu : gameData.all_rule["rule_louhu"],
                        // liujuHuanggang : self._HZHG,
                        liujuHuanggang : gameData.all_rule["rule_HZHG"],
                        jiapiao : true,
                        baoting : true,
                        daifengpai : true,
                    };
                    network.send(3001, {
                        room_id: 0,
                        app_id: 6,
                        options: map,
                    });
                }else if(self._nowSelGame == config.HENAN_TUIDAOHU){//推倒胡
                    var map = {
                        dahu : 0,
                        detailedWanFa : encodeURIComponent(detailedWanFan_tdh),
                        detailedFanXing : encodeURIComponent(detailedFanXin_tdh),
                        jushu : gameData.rule_jushu,
                        mapid : self._nowSelGame,
                        // laizi : self._laizi,
                        laizi : gameData.all_rule["rule_laizi"],
                        // liujuHuanggang : self._HZHG,
                        liujuHuanggang : gameData.all_rule["rule_HZHG"],
                        // louhu : self._guoshouhu,
                        louhu : gameData.all_rule["rule_guoshouhu"],
                        // qixiaodui : self._qixiaodui,
                        qixiaodui : gameData.all_rule["rule_qixiaodui"],
                        // gangshangkaihua2bei : self._GSKH,
                        gangshangkaihua2bei : gameData.all_rule["rule_GSKS"],
                        baoting : true,
                        daifengpai : true,
    
                    };
                    network.send(3001, {
                        room_id: 0,
                        app_id: config.MAJIANG_ID,
                        options: map,
                    });
                }else if(self._nowSelGame == config.HENAN_PAODEKUAI){
                    var map = {
                        detailedWanFa : encodeURIComponent(detailedWanFan_pdk),
                        mapid : self._nowSelGame,
                        jushu : gameData.rule_jushu,//局数先写死
                        renshu : 3,//人数先这样写，看策划
                        qiangzhi : gameData.all_rule["rule_youdabichu"],
                        firstchu : gameData.all_rule["rule_shouchuxuanze"],
                        nextfirstchu : gameData.all_rule["rule_xiajuxianchu"]
                    };
                    network.send(3001, {
                        room_id: 0,
                        app_id: config.PUKE_ID,
                        options: map,
                    });   
                }else if(self._nowSelGame == config.HENAN_XINYANG){
                    var map = {
                        // detailedWanFa : encodeURIComponent(detailedWanFan_pdk),
                        mapid : self._nowSelGame,
                        detailedWanFa : encodeURIComponent(detailedWanFan_xinyang),
                        detailedFanXing : encodeURIComponent(detailedFanXin_xinyang),
                        jushu : gameData.rule_jushu,//局数先写死
                        zuitype : gameData.all_rule["rule_zuitype"],//七公嘴和十公嘴和满堂跑
                        luan3feng : gameData.all_rule["rule_luan3feng"],
                        dahu : gameData.all_rule["rule_dahu"],
                        dazui : gameData.all_rule["rule_dazui"],
                        onlyzimo : gameData.all_rule["rule_zimo"]
                        // renshu : 3,//人数先这样写，看策划
                        // qiangzhi : gameData.all_rule["rule_youdabichu"],
                        // firstchu : gameData.all_rule["rule_shouchuxuanze"],
                        // nextfirstchu : gameData.all_rule["rule_xiajuxianchu"]
                    };
                    network.send(3001, {
                        room_id: 0,
                        app_id: config.MAJIANG_ID,
                        options: map,
                    }); 
                    util.log("信阳麻将 好友组局");
                }else if(self._nowSelGame == config.HENAN_NANYANG){
                    var map = {
                        dahu : 0,
                        detailedWanFa : encodeURIComponent(detailedWanFan_nanyang),
                        detailedFanXing : encodeURIComponent(detailedFanXin_nanyang),
                        jushu : gameData.rule_jushu,
                        mapid : self._nowSelGame,
                        onlyzimo : gameData.all_rule["rule_zimo"],
                        gangpao : gameData.all_rule["rule_gangpao"],
                        zhuangjiadi : gameData.all_rule["rule_zhuangjia"],
                        louhu : gameData.all_rule["rule_louhu"],
                        liujuHuanggang : gameData.all_rule["rule_HZHG"],
                        jiapiao : true,
                        baoting : true,
                        daifengpai : true,
                    };
                    network.send(3001, {
                        room_id: 0,
                        app_id: 6,
                        options: map,
                    });
                }else if(self._nowSelGame == config.HENAN_ZHOUKOU){
                    var map = {
                        dahu : 0,
                        detailedWanFa : encodeURIComponent(detailedWanFan_zhoukou),
                        detailedFanXing : encodeURIComponent(detailedFanXin_zhoukou),
                        jushu : gameData.rule_jushu,
                        mapid : self._nowSelGame,
                        onlyzimo : gameData.all_rule["rule_zimo"],
                        gangpao : gameData.all_rule["rule_gangpao"],
                        gangdiliupai : gameData.all_rule["rule_gangdiliupai"],
                        louhu : gameData.all_rule["rule_louhu"],
                        liujuHuanggang : gameData.all_rule["rule_HZHG"],
                        jiapiao : true,
                        baoting : true,
                        daifengpai : true,
                    };
                    network.send(3001, {
                        room_id: 0,
                        app_id: 6,
                        options: map,
                    });
                }else if(self._nowSelGame == config.HENAN_SHANGQIU){
                    var map = {
                        // dahu : 0,
                        // detailedWanFa : encodeURIComponent(detailedWanFan_nanyang),
                        // detailedFanXing : encodeURIComponent(detailedFanXin_nanyang),
                        // jushu : gameData.rule_jushu,
                        // mapid : self._nowSelGame,
                        // onlyzimo : gameData.all_rule["rule_zimo"],
                        // gangpao : gameData.all_rule["rule_gangpao"],
                        // zhuangjiadi : gameData.all_rule["rule_zhuangjia"],
                        // louhu : gameData.all_rule["rule_louhu"],
                        // liujuHuanggang : gameData.all_rule["rule_HZHG"],
                        // jiapiao : true,
                        // baoting : true,
                        // daifengpai : true,
                    };
                    network.send(3001, {
                        room_id: 0,
                        app_id: 6,
                        options: map,
                    });
                }
            },
            uid : null,
            unionid : null,
            quick : 0,
            tipCallBack : null,
            tipCallBack1 : null
        });
    },
});
