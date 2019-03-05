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
        //三个奖杯 节点
        leftNode:cc.Node,
        centerNode:cc.Node,
        rightNode:cc.Node,

        btnJieShao:cc.Node,
        jieshaoLayer:cc.Node,

        btn_receive:cc.Node,
        no_receive:cc.Node,
        duanWeiLabel:cc.Label,//本赛季段位达到多少
        rewardNum:cc.Label,//领取奖励数量
        desLable:cc.Label,//段位简单介绍
        nextGradeTxt:cc.Label,
        nextGradeXP:cc.Label,
        nowGradeAllXP:cc.Label,
        rewardData: null,//是否可领取奖励协议数据

        rewardArray:[],//可领取的奖励数组（从小奖励到大奖励排）
        duanWeIData:null,//段位表数据

        shipeiCenterNode:cc.Node,
        nextPic:cc.Node,     
        anim:cc.Animation,

        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.shipeiCenterNode.scale = 0.75;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.shipeiCenterNode.scale = 0.8;
        } 
        //
        this.jieshaoLayer.active = false;
        var self = this;
        util.log("段位界面：gameData.gameGradeDuan == "+gameData.gameGradeDuan);
        util.log("段位界面：gameData.gameGradeXing == "+gameData.gameGradeXing);
        util.log("段位界面：gameData.gameGradeName == "+gameData.gameGradeName);

        this.playGradeAnim();
        
        //查排行榜的表
        util.updataGrade(gameData.gameGradeXP,function(data,duan,xing,name){
            self.duanWeIData = data;
            util.log("wertqerqrq3134===== "+ self.rewardData["playerRankAwardLogs"].length);
            var awardNum = self.rewardData["playerRankAwardLogs"].length;
            util.log("awardNum === "+awardNum);
            if(awardNum == 0){
                self.no_receive.active = true;
                self.btn_receive.active = false;
                
                if(duan<6){
                    self.rewardNum.string = "x"+self.duanWeIData[duan*5].award.diamond;
                    self.duanWeiLabel.string = "段位达到"+self.duanWeIData[duan*5].name;
                }else if(duan == 6){
                    self.rewardNum.string = "0";
                    self.duanWeiLabel.string ="已达到最高段位";
                }
                
            }else{
                for(var i = 0;i<awardNum;++i){
                    if(self.rewardData["playerRankAwardLogs"][i]["state"] == 0){
                        self.rewardArray[i] = self.rewardData["playerRankAwardLogs"][i]["rank"];
                    }
                }
                self.no_receive.active = false;
                self.btn_receive.active = true;
                self.rewardArray.sort(function(a,b){return a-b});//从小到大排序
                util.log("可领取奖励排序后： ===" + self.rewardArray);
                self.duanWeiLabel.string = "段位达到"+self.duanWeIData[self.rewardArray[0]].name;
                self.rewardNum.string = "x"+self.duanWeIData[self.rewardArray[0]].award.diamond; //设置领取奖励数量     
            }
            // gameData.gameGradeDuan = "3";
            // gameData.gameGradeXing = "2";
            //段位描述
            self.desLable.string = self.duanWeIData[(gameData.gameGradeDuan-1)*5].des;
            
            
            // util.log("当前经验  ==  " + gameData.gameGradeXP);
            // self.nextGradeXP.string = gameData.gameGradeXP;
            var nowGradeId = (parseInt(gameData.gameGradeDuan)-1)*5 + parseInt(gameData.gameGradeXing) - 1; 
            self.nextGradeXP.string = parseInt(self.duanWeIData[nowGradeId].limmitup) + 1 - parseInt(gameData.gameGradeXP);
            self.nowGradeAllXP.string = gameData.gameGradeXP;

            //距离初段4星还差200经验
            if(parseInt(gameData.gameGradeDuan)<6){
                if(gameData.gameGradeXing<5){
                    self.nextGradeTxt.string = "距离" + gameData.gameGradeName + (parseInt(gameData.gameGradeXing)+1) + "星还差";
                }else if(gameData.gameGradeXing==5){
                    self.nextGradeTxt.string = "距离" + self.duanWeIData[gameData.gameGradeDuan*5].name  + "1星还差";
                }
            }else if(parseInt(gameData.gameGradeDuan) == 6){
                if(gameData.gameGradeXing<5){
                    self.nextGradeTxt.string = "距离" + gameData.gameGradeName + (parseInt(gameData.gameGradeXing)+1) + "星还差";
                }else if(gameData.gameGradeXing==5){
                    self.nextGradeTxt.string = "";
                    self.nextGradeXP.string = "";
                    self.nextPic.active = false;
                }
            }


            self.setMoreIntro(self.duanWeIData);


        });

        //更多介绍

          

        //外面界面相关设置
        if(gameData.gameGradeDuan == 1){//新手段位
            //底座
            util.loadSprite("hall/grade/dizuo_jin", cc.find("dizuo",this.leftNode));
            util.loadSprite("hall/grade/dizuo_hui", cc.find("dizuo",this.centerNode));
            util.loadSprite("hall/grade/dizuo_hui", cc.find("dizuo",this.rightNode));
            //奖杯
            util.loadSprite("hall/grade/jiangbei"+gameData.gameGradeDuan, cc.find("jiangbei",this.leftNode));
            util.loadSprite("hall/grade/jiangbei"+(parseInt(gameData.gameGradeDuan)+1), cc.find("jiangbei",this.centerNode));
            util.loadSprite("hall/grade/jiangbei"+(parseInt(gameData.gameGradeDuan)+2), cc.find("jiangbei",this.rightNode));
            //段位名字
            util.loadSprite("hall/grade/picName_"+gameData.gameGradeDuan, cc.find("picName",this.leftNode));
            util.loadSprite("hall/grade/picName_"+(parseInt(gameData.gameGradeDuan)+1), cc.find("picName",this.centerNode));
            util.loadSprite("hall/grade/picName_"+(parseInt(gameData.gameGradeDuan)+2), cc.find("picName",this.rightNode));
            //星星
            var showStarNode = cc.find("starNode",this.leftNode);
            showStarNode.active = true;
            cc.find("starNode",this.centerNode).active = false;
            cc.find("starNode",this.rightNode).active = false;
            
                //星星背景
            cc.find("star_bg1",showStarNode).active = true;
            cc.find("star_bg2",showStarNode).active = true;
            cc.find("star_bg3",showStarNode).active = true;
            cc.find("star_bg4",showStarNode).active = true;
            cc.find("star_bg5",showStarNode).active = true;
                //黄色星星
            cc.find("star1",showStarNode).active = gameData.gameGradeXing>=1;
            cc.find("star2",showStarNode).active = gameData.gameGradeXing>=2;
            cc.find("star3",showStarNode).active = gameData.gameGradeXing>=3;
            cc.find("star4",showStarNode).active = gameData.gameGradeXing>=4;
            cc.find("star5",showStarNode).active = gameData.gameGradeXing>=5;

            //放大
            this.leftNode.scale = 1.2;
            this.centerNode.scale = 0.9;
            this.rightNode.scale = 0.9;
            //是否显示未开启
            cc.find("jiangbei",this.leftNode).color = cc.color(255,255,255,config.maxOpacity);
            cc.find("jiangbei",this.centerNode).color = cc.color(187,187,187,config.maxOpacity);
            cc.find("jiangbei",this.rightNode).color = cc.color(187,187,187,config.maxOpacity);
                //锁
            cc.find("lock",this.leftNode).active = false;
            cc.find("lock",this.centerNode).active = true;
            cc.find("lock",this.rightNode).active = true;
            
        }else if(gameData.gameGradeDuan > 1 && gameData.gameGradeDuan < 6){
            //底座
            util.loadSprite("hall/grade/dizuo_jin", cc.find("dizuo",this.centerNode));
            util.loadSprite("hall/grade/dizuo_hui", cc.find("dizuo",this.leftNode));
            util.loadSprite("hall/grade/dizuo_hui", cc.find("dizuo",this.rightNode));
            //奖杯
            util.loadSprite("hall/grade/jiangbei"+gameData.gameGradeDuan, cc.find("jiangbei",this.centerNode));
            util.loadSprite("hall/grade/jiangbei"+(parseInt(gameData.gameGradeDuan)-1), cc.find("jiangbei",this.leftNode));
            util.loadSprite("hall/grade/jiangbei"+(parseInt(gameData.gameGradeDuan)+1), cc.find("jiangbei",this.rightNode));
            //段位名字
            util.loadSprite("hall/grade/picName_"+gameData.gameGradeDuan, cc.find("picName",this.centerNode));
            util.loadSprite("hall/grade/picName_"+(parseInt(gameData.gameGradeDuan)-1), cc.find("picName",this.leftNode));
            util.loadSprite("hall/grade/picName_"+(parseInt(gameData.gameGradeDuan)+1), cc.find("picName",this.rightNode));
            //星星
            var showStarNode = cc.find("starNode",this.centerNode);
            showStarNode.active = true;
            cc.find("starNode",this.leftNode).active = false;
            cc.find("starNode",this.rightNode).active = false;
            
                //星星背景
            cc.find("star_bg1",showStarNode).active = true;
            cc.find("star_bg2",showStarNode).active = true;
            cc.find("star_bg3",showStarNode).active = true;
            cc.find("star_bg4",showStarNode).active = true;
            cc.find("star_bg5",showStarNode).active = true;
                //黄色星星
            cc.find("star1",showStarNode).active = gameData.gameGradeXing>=1;
            cc.find("star2",showStarNode).active = gameData.gameGradeXing>=2;
            cc.find("star3",showStarNode).active = gameData.gameGradeXing>=3;
            cc.find("star4",showStarNode).active = gameData.gameGradeXing>=4;
            cc.find("star5",showStarNode).active = gameData.gameGradeXing>=5;

           //放大
            this.centerNode.scale = 1.2;
            this.leftNode.scale = 0.9;
            this.rightNode.scale = 0.9;
             //是否显示未开启
            cc.find("jiangbei",this.rightNode).color = cc.color(187,187,187,config.maxOpacity);
            cc.find("jiangbei",this.centerNode).color = cc.color(255,255,255,config.maxOpacity);
            cc.find("jiangbei",this.leftNode).color = cc.color(255,255,255,config.maxOpacity);
                //锁
            cc.find("lock",this.leftNode).active = false;
            cc.find("lock",this.centerNode).active = false;
            cc.find("lock",this.rightNode).active = true;
                
        }else if(gameData.gameGradeDuan == 6){
            //底座
            util.loadSprite("hall/grade/dizuo_jin", cc.find("dizuo",this.rightNode));
            util.loadSprite("hall/grade/dizuo_hui", cc.find("dizuo",this.leftNode));
            util.loadSprite("hall/grade/dizuo_hui", cc.find("dizuo",this.centerNode));
            //奖杯
            util.loadSprite("hall/grade/jiangbei"+gameData.gameGradeDuan, cc.find("jiangbei",this.rightNode));
            util.loadSprite("hall/grade/jiangbei"+(parseInt(gameData.gameGradeDuan)-2), cc.find("jiangbei",this.leftNode));
            util.loadSprite("hall/grade/jiangbei"+(parseInt(gameData.gameGradeDuan)-1), cc.find("jiangbei",this.centerNode));
            //段位名字
            util.loadSprite("hall/grade/picName_"+gameData.gameGradeDuan, cc.find("picName",this.rightNode));
            util.loadSprite("hall/grade/picName_"+(parseInt(gameData.gameGradeDuan)-2), cc.find("picName",this.leftNode));
            util.loadSprite("hall/grade/picName_"+(parseInt(gameData.gameGradeDuan)-1), cc.find("picName",this.centerNode));
            //星星
            var showStarNode = cc.find("starNode",this.rightNode);
            showStarNode.active = true;
            cc.find("starNode",this.leftNode).active = false;
            cc.find("starNode",this.centerNode).active = false;
            
                //星星背景
            cc.find("star_bg1",showStarNode).active = true;
            cc.find("star_bg2",showStarNode).active = true;
            cc.find("star_bg3",showStarNode).active = true;
            cc.find("star_bg4",showStarNode).active = true;
            cc.find("star_bg5",showStarNode).active = true;
                //黄色星星
            cc.find("star1",showStarNode).active = gameData.gameGradeXing>=1;
            cc.find("star2",showStarNode).active = gameData.gameGradeXing>=2;
            cc.find("star3",showStarNode).active = gameData.gameGradeXing>=3;
            cc.find("star4",showStarNode).active = gameData.gameGradeXing>=4;
            cc.find("star5",showStarNode).active = gameData.gameGradeXing>=5;

           //放大
            this.rightNode.scale = 1.2;
            this.centerNode.scale = 0.9;
            this.leftNode.scale = 0.9;
             //是否显示未开启
            // cc.find("jiangbei",this.rightNode).color = cc.color(79,79,79,config.maxOpacity)
            cc.find("jiangbei",this.rightNode).color = cc.color(255,255,255,config.maxOpacity);
            cc.find("jiangbei",this.centerNode).color = cc.color(255,255,255,config.maxOpacity);
            cc.find("jiangbei",this.leftNode).color = cc.color(255,255,255,config.maxOpacity);
                //锁
            cc.find("lock",this.leftNode).active = false;
            cc.find("lock",this.centerNode).active = false;
            cc.find("lock",this.rightNode).active = false;

        }

        
    },
    playGradeAnim:function(){
        this.anim.stop("gradeAnim");
        this.anim.play("gradeAnim");
    },
    setAwardData:function(data){
        this.rewardData = data;
    },
    setMoreIntro:function(data){
        var jieshaoNode = cc.find("centerNode/center/jieshaoLayer",this.node);
        var content =  cc.find("gradeList/view/content",jieshaoNode);
    
        for(var i = 1;i<7;i++){
            var item = cc.find("item"+i,content);
            
            util.loadSprite("hall/grade/jiangbei"+i, cc.find("duanwei1",item));
            cc.find("gradeTxt",item).getComponent(cc.Label).string = data[i*5-5]["name"] + "(" + data[i*5-5]["limmitdown"] + "-" + data[i*5-1]["limmitup"] + ")";
            cc.find("desTxt",item).getComponent(cc.Label).string =  data[i*5-5]["moreDes"];
        }
        if(gameData.gameGradeDuan == 1){
            //经验范围
            var left1 = util.showNumber(data[(parseInt(gameData.gameGradeDuan))*5-5]["limmitdown"]);
            var left2 = util.showNumber(data[(parseInt(gameData.gameGradeDuan))*5-1]["limmitup"]);
            cc.find("range",this.leftNode).getComponent(cc.Label).string =left1 + "-" + left2;

            var center1 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)+1)*5-5]["limmitdown"]);
            var center2 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)+1)*5-1]["limmitup"]);
            cc.find("range",this.centerNode).getComponent(cc.Label).string = center1 + "-" + center2;

            var right1 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)+2)*5-5]["limmitdown"]);
            var right2 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)+2)*5-1]["limmitup"]);
            cc.find("range",this.rightNode).getComponent(cc.Label).string = right1 + "-" + right2;
        }else if(gameData.gameGradeDuan > 1 && gameData.gameGradeDuan < 6){
            //经验范围
            var left1 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)-1)*5-5]["limmitdown"]);
            var left2 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)-1)*5-1]["limmitup"]);
            cc.find("range",this.leftNode).getComponent(cc.Label).string =left1 + "-" + left2;

            var center1 = util.showNumber(data[(parseInt(gameData.gameGradeDuan))*5-5]["limmitdown"]);
            var center2 = util.showNumber(data[(parseInt(gameData.gameGradeDuan))*5-1]["limmitup"]);
            cc.find("range",this.centerNode).getComponent(cc.Label).string = center1 + "-" + center2;

            var right1 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)+1)*5-5]["limmitdown"]);
            var right2 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)+1)*5-1]["limmitup"]);
            cc.find("range",this.rightNode).getComponent(cc.Label).string = right1 + "-" + right2;

        }else if(gameData.gameGradeDuan == 6){
            //经验范围
            var left1 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)-2)*5-5]["limmitdown"]);
            var left2 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)-2)*5-1]["limmitup"]);
            cc.find("range",this.leftNode).getComponent(cc.Label).string =left1 + "-" + left2;

            var center1 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)-1)*5-5]["limmitdown"]);
            var center2 = util.showNumber(data[(parseInt(gameData.gameGradeDuan)-1)*5-1]["limmitup"]);
            cc.find("range",this.centerNode).getComponent(cc.Label).string = center1 + "-" + center2;

            var right1 = util.showNumber(data[(parseInt(gameData.gameGradeDuan))*5-5]["limmitdown"]);
            var right2 = util.showNumber(data[(parseInt(gameData.gameGradeDuan))*5-1]["limmitup"]);
            cc.find("range",this.rightNode).getComponent(cc.Label).string = right1 + "-" + right2;
        }
    },
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        this.node.destroy();
    },
    onBtnJieShao:function(){
        audioUtils.playClickSoundEffect();
        this.jieshaoLayer.active = true;
    },
    onBtnRemove:function(){
        audioUtils.playClickSoundEffect();
        this.jieshaoLayer.active = false;
    },
    onBtnReceive:function(){
        util.log("onBtnReceive=====");
        audioUtils.playClickSoundEffect();
        var self = this;
        util.getGetAwardStatus(
            self.rewardArray[0],
            function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){//可领取状态
                    util.log("Award成功 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);
                    gameData.gameBean = msg["playerMoney"]["happyBeans"];
                    gameData.gameDiamond = msg["playerMoney"]["diamond"];
                    // self.node.parent.getComponent("HallScene").setPlayerInfo();//可以写成监听，写动画的时候在写
                    var nowDuan = self.rewardArray[0];
                    util.log("nowDuan  ==  "+ nowDuan);
                    //触发setPlayerInfo的方法
                    // gameData.hallNode.emit('setPlayerInfo');
                    self.rewardArray.shift(); 
                    if(self.rewardArray && self.rewardArray.length>0){
                        self.no_receive.active = false;
                        self.btn_receive.active = true;
                        gameData.isTipGrade = 1;
                        if(gameData.hallNode){
                            gameData.hallNode.emit('setPlayerInfo');
                        }
                        if(nowDuan<25){
                            self.rewardNum.string = "x"+self.duanWeIData[nowDuan+5].award.diamond;
                            self.duanWeiLabel.string = "段位达到"+self.duanWeIData[nowDuan+5].name;
                        }else if(nowDuan >= 25){
                            self.rewardNum.string = "0";
                            self.duanWeiLabel.string ="已达到最高段位";
                        }
                    }else{//点完之后没有可领取的了，显示下一个段位的奖励
                        // self.duanWeiLabel.string = "段位达到"+self.duanWeIData[self.rewardArray[0]].name;
                        self.no_receive.active = true;
                        self.btn_receive.active = false;
                        gameData.isTipGrade = 0;
                        if(gameData.hallNode){
                            gameData.hallNode.emit('setPlayerInfo');
                        }
                        if(nowDuan<25){
                            self.rewardNum.string = "x"+self.duanWeIData[nowDuan+5].award.diamond;
                            self.duanWeiLabel.string = "段位达到"+self.duanWeIData[nowDuan+5].name;
                        }else if(nowDuan >= 25){
                            self.rewardNum.string = "0";
                            self.duanWeiLabel.string ="已达到最高段位";
                        }
                    }
                    
                }else if(respJsonInfo["code"] == "-10"){//没有该段位奖励或者已领取
                    util.log("getAwardStatus === -10 ");
                }else{
                    util.log("getAwardStatus === 2 ");
                }
            },
        null,null);
    },
    start () {

    },

    // update (dt) {},
});
