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
        userName:cc.Label,
        userDuanWei:cc.Label,
        userSum:cc.Label,
        userWinRate:cc.Label,
        userWinRecord:cc.Label,
        userRecentGame:cc.Label,
        userRecentDaHu:cc.Label,
        userHead:cc.Sprite,
        userLevel:cc.Label,
        _userData:null,
        userSexMan:cc.Node,
        userSexWoman:cc.Node,
        duanwei_label:cc.Label,
        duanweiPic:cc.Node,

        headImgFrame: {
            default: null,
            type: cc.Sprite
        },
        anim:cc.Animation,
        
        _clickType:null,

        _maxCardNum:null,
        _cardItemTemp:null,
        _cardContent:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function () {
        var self = this;
        util.log("Info成功2 +=== "+ self._userData);
        util.log("Info成功3 +=== "+ self._userData["playerInfo"]);
        self.userName.string = self._userData["playerInfo"]['name'];
        // self.userDuanWei.string = "最强王者";
        self.userSum.string = "总对局数: " + self._userData["playerDynamicInfo"]['fightCount'];            
        self.userWinRecord.string = "最高连胜: " + self._userData["playerDynamicInfo"]['winningStreak'];
        self.userRecentGame.string = "最近常玩: " + self._userData["playerDynamicInfo"]['recentlyPlays'];
        if(self._userData["playerDynamicInfo"]['maxScoreType'] == ""){
            self.userRecentDaHu.string = "最近大胡: " + "无";
        }else{
            self.userRecentDaHu.string = "最近大胡: " + self._userData["playerDynamicInfo"]['maxScoreType'];
        }
        
        self.userWinRate.string = "胜率: " + self.getWinRate(self._userData["playerDynamicInfo"]['winCount'],self._userData["playerDynamicInfo"]['fightCount']) +"%";
        self.userLevel.string = self._userData["playerDynamicInfo"]['level'] + "级";
        // self.duanwei_label.string = "s锐1星 0分";
        if(self._userData["playerInfo"]["sex"] * 1 == 1){//1是男   2是女  0是默认
            this.userSexMan.active = true;
            this.userSexWoman.active = false;
        }else if(self._userData["playerInfo"]["sex"] * 1 == 2){
            this.userSexMan.active = false;
            this.userSexWoman.active = true;
        }else if(self._userData["playerInfo"]["sex"] * 1 == 0){//
            this.userSexMan.active = true;
            this.userSexWoman.active = false;
        }

        this.initButtonHandler(this.node.getChildByName("centerNode").getChildByName("btn_close"));
        // util.log("经验等级   === "+ )
        var self = this;
        util.getLevelNum(self._userData["playerDynamicInfo"]['level'],function(exp){
            self.updateEXPProgress(self._userData["playerDynamicInfo"]['experience'],exp);
        });
        util.updataGrade(self._userData["playerDynamicInfo"]['rankXp'],function(data,duan,xing,name){//根据当前总经验获取一些段位界面需要的数据
            self.duanwei_label.string = name+xing+"星";
            util.loadSprite("hall/grade/jiangbei"+duan, self.duanweiPic);
        });
        this._maxCardNum = 14;
        this._cardContent = cc.find("centerNode/majiang",this.node);
        this._cardItemTemp = cc.find("centerNode/majiang/card1",this.node);
        this._cardContent.removeChild(this._cardItemTemp);

        sdk.getPlayerHead(self._userData["playerInfo"]['headImageUrl'], this.userHead.node);
        if(this._userData["playerDynamicInfo"]["paiDetail"]){
            this.showMaxMaJiang(this._userData);
        }
        if (self._userData["playerDynamicInfo"]['headFrame']) {
            util.loadSprite("hall/bag/prop/"+parseInt(self._userData["playerDynamicInfo"]['headFrame']), this.headImgFrame.node);
            //更新大厅的头像框
            if(this._clickType == 1 && gameData.hallNode && self._userData["playerInfo"].playerId == gameData.uid){
                gameData.playHeadFrame = self._userData["playerDynamicInfo"]['headFrame'];
                gameData.hallNode.getComponent("HallScene").setHeadFrame("hall/bag/prop/"+gameData.playHeadFrame);
            }
            
        }
        this.playUserInfoAnim();
    },
    playUserInfoAnim:function(){
        this.anim.stop("userInfoAnim");
        this.anim.play("userInfoAnim");
    },
    setUserInfoData:function(data){
        this._userData = data;
    },
    getWinRate:function(winCount,allCount){
        if(allCount == 0){
            return 0;
        }
        var rate = Math.floor(winCount/allCount*10000)/100.0;
        return rate;
    },
    showMaxMaJiang:function(data){
        var firstCardX = this._cardItemTemp.x;
        var firstCardY = this._cardItemTemp.y;
        var cardSize = 43;
        util.log("firstCardX  ==  "+firstCardX);
        util.log("firstCardY  ==  "+firstCardY);
        var paiDetailLength = data["playerDynamicInfo"]["paiDetail"].length;
        util.log("pai ====     "+data["playerDynamicInfo"]["paiDetail"].length);
       
        //     var handCard = data["playerDynamicInfo"]["paiDetail"][0].split(', ');
        //     util.log("handCard ====  "+handCard);
        // }else{//有碰杠
            // var test = [];
            // var test1 = [4,7,6];
            // var test2 = [8,5,9];
            // test = test.concat(test1);
            // test = test.concat(test2);
            // util.log("test ====  "+test);

        var spaceNum = 0;//间隔数
        var space = 20;
        var pengCard = [];
        var gangCard = [];
        var pengNum = 0;
        var gangNum = 0;
        for(var j = 0;j<paiDetailLength-1;j++){
            util.log("每一组牌 == "+data["playerDynamicInfo"]["paiDetail"][j]);
            if(data["playerDynamicInfo"]["paiDetail"][j].split(', ').length == 3){
                pengCard = pengCard.concat(data["playerDynamicInfo"]["paiDetail"][j].split(', '));
            }
            if(data["playerDynamicInfo"]["paiDetail"][j].split(', ').length == 4){//有一个杠，最大牌数要加1
                gangCard = gangCard.concat(data["playerDynamicInfo"]["paiDetail"][j].split(', '));
                this._maxCardNum++;
            }
        }
        var handCard = data["playerDynamicInfo"]["paiDetail"][paiDetailLength-1].split(', ');//最后一个是手牌
        util.log("pengCard ====  "+pengCard);
        util.log("gangCard ====  "+gangCard);
        util.log("handCard ====  "+handCard);
        pengNum = pengCard.length/3;
        gangNum = gangCard.length/4;
        util.log("碰数量  == "+pengCard.length/3);
        util.log("杠数量  == "+gangCard.length/4);
        
        for(var i = 0;i<gangCard.length;i++){
            var cardNode = this.getCardItem(i);
            cardNode.idx = i;
            cc.find("laiziNode",cardNode).active = false;
            // util.loadSprite("game/card/3_"+gangCard[i], cc.find("card",cardNode));
            
            // util.log("test1111  / ===  "+Math.floor(i/4));
            // util.log("test22222   ===  "+(i+1)%4);
            if((i+1)%4 == 1){
                cardNode.x = firstCardX+(cardSize+cardSize+cardSize+space)*(Math.floor(i/4));
                cardNode.y = firstCardY;
            }else if((i+1)%4 == 2){
                cardNode.x = firstCardX+cardSize+(cardSize+cardSize+cardSize+space)*(Math.floor(i/4));
                cardNode.y = firstCardY;
            }else if((i+1)%4 == 3){
                cardNode.x = firstCardX+cardSize+cardSize+(cardSize+cardSize+cardSize+space)*(Math.floor(i/4));
                cardNode.y = firstCardY;
            }else if((i+1)%4 == 0){
                cardNode.x = firstCardX+cardSize+(cardSize+cardSize+cardSize+space)*(Math.floor(i/4));
                cardNode.y = firstCardY+13;
            }
            
            cardNode.x = cardNode.x-gangNum*10-pengNum*10;
            util.log("牌值 ==  "+gangCard[i]);
            util.log("牌值i ==  "+i);
            util.log("第"+i+"个"+"坐标 x  ： "+cardNode.x);
            util.log("第"+i+"个"+"坐标 y  ： "+cardNode.y);
            util.loadSprite("game/card/3_"+gangCard[i], cc.find("card",cardNode));
            cardNode.active = true;
        }
        for(var i = gangCard.length;i<(gangCard.length+pengCard.length);i++){
            var cardNode = this.getCardItem(i);
            cardNode.idx = i;
            cc.find("laiziNode",cardNode).active = false;
            // util.loadSprite("game/card/3_"+gangCard[i], cc.find("card",cardNode));
            
            // util.log("test1111  / ===  "+Math.floor(i/3));
            // util.log("test22222   ===  "+(i+1)%3);
            var m = i-(4*gangNum);
            if((m+1)%3 == 1){
                cardNode.x = firstCardX+(cardSize+cardSize+cardSize+space)*(Math.floor(m/3)) + gangNum*space + (gangNum*(4-1))*cardSize;
                cardNode.y = firstCardY;
            }else if((m+1)%3 == 2){
                cardNode.x = firstCardX+cardSize+(cardSize+cardSize+cardSize+space)*(Math.floor(m/3)) + gangNum*space + (gangNum*(4-1))*cardSize;
                cardNode.y = firstCardY;
            }else if((m+1)%3 == 0){
                cardNode.x = firstCardX+cardSize+cardSize+(cardSize+cardSize+cardSize+space)*(Math.floor(m/3)) + gangNum*space + (gangNum*(4-1))*cardSize;
                cardNode.y = firstCardY;
            }
            
            cardNode.x = cardNode.x-gangNum*10-pengNum*10;
            util.log("牌值 ==  "+pengCard[i-gangCard.length]);
            util.log("牌值i ==  "+i);
            util.log("第"+i+"个"+"坐标 x  ： "+cardNode.x);
            util.log("第"+i+"个"+"坐标 y  ： "+cardNode.y);
            util.loadSprite("game/card/3_"+pengCard[i-gangCard.length], cc.find("card",cardNode));
            cardNode.active = true;
        }
        util.log("this._maxCardNum  ==  "+this._maxCardNum);
        
        for(var k = (gangCard.length+pengCard.length);k<this._maxCardNum;k++){
            var cardNode = this.getCardItem(k);
            cardNode.idx = k;
            cc.find("laiziNode",cardNode).active = false;
            if(this._userData["playerDynamicInfo"]["laiZi"]){
                if(handCard[k-gangCard.length-pengCard.length] == this._userData["playerDynamicInfo"]["laiZi"])
                cc.find("laiziNode",cardNode).active = true;
                if (this._userData["playerDynamicInfo"]["mapId"] === config.HENAN_TUIDAOHU) {
                    cc.find("laiziNode/god_text_1001",cardNode).active = true;
                    cc.find("laiziNode/god_text_1101",cardNode).active = false;
                }
                else {
                    cc.find("laiziNode/god_text_1001",cardNode).active = false;
                    cc.find("laiziNode/god_text_1101",cardNode).active = true;
                }
            }
            if(k == this._maxCardNum-1){//最后一张牌要加一个间隔
                spaceNum++;
            }
            cardNode.x = firstCardX + (k*cardSize) + spaceNum*space + gangNum*space - gangNum*cardSize + pengNum*space;
            cardNode.y = firstCardY;
            cardNode.x = cardNode.x-gangNum*10-pengNum*10;
            util.loadSprite("game/card/3_"+handCard[k-gangCard.length-pengCard.length], cc.find("card",cardNode));
            util.log("牌值 ==  "+handCard[k-gangCard.length-pengCard.length]);
            util.log("牌值i ==  "+k);
            util.log("第"+k+"个"+"坐标 x  ： "+cardNode.x);
            util.log("第"+k+"个"+"坐标 y  ： "+cardNode.y);
            cardNode.active = true;
        }
    },
    getCardItem:function(index){
        var cardContent = this._cardContent;
        
        var node = cc.instantiate(this._cardItemTemp);
        cardContent.addChild(node);
        return node;
    },
    initButtonHandler:function(btn){
        util.addClickEvent(btn,this.node,"userInfoScene","onBtnClicked");    
    },
    onBtnClicked:function(event){
        if(event.target.name === "btn_close"){
            audioUtils.playCloseSoundEffect();
            this.node.destroy();
        }
    },
    onBtnSwallow:function(){
        
    },
    updateEXPProgress: function (count,total) {
        var progress_node = this.node.getChildByName("centerNode").getChildByName("exp_progress").getComponent(cc.ProgressBar);
        if(!progress_node){
            console.log("progress not:",progress_node);
            return;
        }
        count = count*1;
        total = total*1;

        var percentage = (count / total) * 1;
        if(percentage >= 1){
            percentage = 1;
        }

        progress_node.progress = percentage;

        this.node.getChildByName("centerNode").getChildByName("exp_value").getComponent(cc.Label).string = count +"/"+ total;

    },
    start () {
    },

    // update (dt) {},

    // 游戏界面不需要显示背景图，只显示阴影
    setBg : function (type) {
        this._clickType = type;
        if (type === 1) {
            // 显示模糊背景
            // this.node.getChildByName("ditu").active = true;
            this.node.getChildByName("colorBg").active = true;
        }
        else if (type === 2) {
            // 显示阴影
            // this.node.getChildByName("ditu").active = false;
            this.node.getChildByName("colorBg").active = true;
        }
    },
});
