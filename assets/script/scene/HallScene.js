// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {

        logScroll: {
            default: null,
            type: cc.Node,
        },
        logBtn: {
            default: null,
            type: cc.Button,
        },
        
        sprHeadImg:cc.Sprite,//头像
        playID:cc.Label,//ID
        playGrade:cc.Sprite,//段位
        playGradeTxt:cc.Label,//段位文字
        playName:cc.Label,//名字
        gameBean:cc.Label,//游戏豆
        gameDiamond:cc.Label,//钻石
        taskTip:cc.Sprite,//任务提示红点
        mailTip:cc.Sprite,//邮件提示红点
        gradeTip:cc.Sprite,//段位提示红点
        activeTip:cc.Sprite,//分享提示红点
        tuidaohuPlayerNum:cc.Label,//推倒胡在线人数
        // xinyangPlayerNum:cc.Label,//信阳在线人数
        // zhengzhouPlayerNum:cc.Label,//郑州在线人数
        otherPlayerNum:cc.Label,//选择其他玩法的在线人数
        pdkPlayerNum:cc.Label,//跑得快在线人数
        noticeTxt:cc.Label,//跑马灯文字
        // dianjuanTxt:cc.Label,//点券
        //适配用到的
        LeftPhbNode:cc.Node,//左边排行榜
        LeftUpNode:cc.Node,//上面那一条
        RightBtnNode:cc.Node,//右边四个按钮
        CenterBtnNode:cc.Node,//下面那一条
        RightDownNode:cc.Node,//右下角按钮
        RightUpNode:cc.Node,//右上角装饰
        CenterPmd:cc.Node,//跑马灯
        bgAllNode:cc.Node,//背景节点，适配


        

        //排行榜相关
        btnLeft:cc.Node,
        btnRight:cc.Node,
        btnLeft_1:cc.Node,
        btnRight_1:cc.Node,
        leftNode:cc.Node,
        rightNode:cc.Node,

        _phbData:null,
        _phbLeftContent:null,
        _phbLeftItemTemp:null,
        _phbRightContent:null,
        _phbRightItemTemp:null,

        anim:cc.Animation,

        effectsArr:{
            default:[],
            type:cc.Animation
        },
        phbMsg : null,
        phbLeft : null,
        phbRight : null,

        //音乐
        bgmAudioID1:-1,
        bgmAudioID2:-1,

        _isShowSign:null,

        //按钮  在1秒内只能点一次
        lastClickTime : 0,
        
    },

    onOpenLogBtn () {
        this.logScroll.active = true;
    },

    uiLogAppendToTheScrollViewUI (lineLog) {
        //
        this.logScroll.getComponent("LogUtilScrollView").appendLogLine(lineLog);
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
    //
        util.log("大厅场景onLoad开始");
        // var testDest = this.test(11);
        // util.log("testDest   ==   "+testDest);
        //
        //cc.game.addPersistRootNode(this.node);
        //
        this.logScroll.active = false;

        var width = this.node.getComponent("cc.Canvas").node.width;
        var height = this.node.getComponent("cc.Canvas").node.height;
        gameData.canvasWidth = width;
        gameData.canvasHeight = height;
    
        util.log("canvasWidth  ==  "+gameData.canvasWidth);
        util.log("canvasHeight  ==  "+gameData.canvasHeight);

        gameData.hallNode = this.node;
        util.log("HallScene----onload");


        util.log("gameData.gameGradeXP == "+gameData.gameGradeXP);


        var self = this;
        util.getIsShowPdk(
            function(respJsonInfo){
                if(respJsonInfo.isShowPDK){//显示按钮
                    gameData.isshowpdkbtn = true;
                    util.loadSprite("hall/btn_paodekuai", cc.find("right/btn_xinyang",self.node));
                    // cc.find("right/btn_xinyang", self.node).active = true;//这是跑得快按钮
                }else{
                    gameData.isshowpdkbtn = false;
                    util.loadSprite("hall/btn_xinyang", cc.find("right/btn_xinyang",self.node));
                    // cc.find("right/btn_xinyang", self.node).active = false;
                }
            },
        null,null);



        util.log("大厅场景onLoad结束");
        // 设置音效 音乐
        var EffectValue = util.getLocalValue('soundEffectStatus');
        var MusicValue = util.getLocalValue('musicStatus');
        util.log("大厅场景onLoad结束--本地存储音效--EffectValue == "+EffectValue);
        util.log("大厅场景onLoad结束--本地存储音乐--MusicValue == "+MusicValue);
        if (EffectValue === null || EffectValue === '')
        {
            EffectValue = 100;
            gameData.needCheckSettings = true;
        }
        if (MusicValue === null || MusicValue === '')
        {
            MusicValue = 100;
            gameData.needCheckSettings = true;
        }
        // 静音
        // if (config.silence_flag) {
        //     cc.audioEngine.setEffectsVolume(0);
        //     cc.audioEngine.setMusicVolume(1);//播放空音乐，设置成1
        // }
        // else {
        //     cc.audioEngine.setEffectsVolume(EffectValue / 100);
        //     // cc.audioEngine.setMusicVolume(MusicValue / 100);
        //     cc.audioEngine.setMusicVolume(1);//播放空音乐，设置成1
        // }
        if(EffectValue == 2){
            util.log("EffectValue == 0");
            // cc.audioEngine.setEffectsVolume(0);
            audioUtils.setSFXVolume(0);//by majiangfan
        }
        
        if(EffectValue == 1){
            util.log("EffectValue == 1");
            // cc.audioEngine.setEffectsVolume(1);
            audioUtils.setSFXVolume(1);//by majiangfan
        }
        //madif by majiangfan
        /*
            ，改成播放空音乐，没有静音状态了，全部设置成1
        */
        if(MusicValue == 2){
            util.log("MusicValue == 0");
            cc.audioEngine.setMusicVolume(1);//
        }
        if(MusicValue == 1){
            util.log("MusicValue == 1");
            cc.audioEngine.setMusicVolume(1);
        }
        //end
        

    },
    test(cardNum){
        var dest = [];
        var firstAngle = 0;
        if(cardNum == 16){
            firstAngle = 78;
        }else if(cardNum == 16-1){//15
            firstAngle = 79;
        }else if(cardNum == 16-2){//14
            firstAngle = 80;
        }else if( cardNum >= 16-8 && cardNum <= 16-3){//13-8
            firstAngle = 81;
        }else if(cardNum == 16-9){//7
            firstAngle = 82;
        }else if(cardNum == 16-10){//6
            firstAngle = 84;
        }else if( cardNum >= 16-13 && cardNum <= 16-11){//5-3
            firstAngle = 86;
        }else if(cardNum == 16-14){//2
            firstAngle = 88;
        }else if(cardNum == 16-15){//1
            firstAngle = 90;
        }
        // var firstAngle = 78;//第一张牌的极角
        var handAngle = (90-firstAngle)*2;//手牌圆心角
        var intervalAngle = handAngle/(cardNum-1);//间隔角度

        for(var i = 0;i<cardNum;i++){
            dest.push({x : 0,y : 0,r : 0});
        }
        for(var i = 0;i<cardNum;i++){
        // for(var i = cardNum-1 ; i >= 0 ; i--){
            dest[i].x = 1676 * Math.cos((firstAngle+i*intervalAngle)/180*Math.PI);
            dest[i].y = -1926+1676 * Math.sin((firstAngle+i*intervalAngle)/180*Math.PI);
            dest[i].r = 90 - (firstAngle+i*intervalAngle);
        }
        // if(dest.length)
        dest.reverse();
        return dest;
    },

    start : function() {
        util.log("大厅场景start开始");

        this.node.on('playHallAnim', function (event) {
            this.playHallAnim();
        }, this);//动画监听
        this.node.on("updatePHB", this.updatePHB, this);//pai

        this.setPlayerInfo();
        this.node.on('setPlayerInfo', function (event) {
            this.setPlayerInfo();
        }, this);//金豆 钻石 监听 （可以扩展）
        this.setHallBtnImg();
        this.node.on('setHallBtnImg', function (event) {
            this.setHallBtnImg();
          }, this);//
        
        //
        //检测是否是异形屏
        gameData.FrameWidth = cc.view.getFrameSize().width;
        gameData.FrameHeight = cc.view.getFrameSize().height;
        var isNotch = util.isNotchPhone(cc.view.getFrameSize().width,cc.view.getFrameSize().height);
        if(isNotch){
            cc.find("leftPhb", this.node).getComponent(cc.Widget).left = 100;
        }
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.LeftUpNode.scale = 0.8;
            this.LeftPhbNode.scale = 0.80;
            this.RightBtnNode.scale = 0.80;
            this.CenterBtnNode.scale = 0.75;
            this.RightDownNode.scale = 0.85;
            this.RightUpNode.scale = 0.8; 
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.LeftUpNode.scale = 0.85;
            this.LeftPhbNode.scale = 0.85;
            this.RightBtnNode.scale = 0.85;
            this.CenterBtnNode.scale = 0.8;
            this.RightDownNode.scale = 0.9;
            this.RightUpNode.scale = 0.85; 
        }else if(gameData.canvasWidth/gameData.canvasHeight>2){
            this.bgAllNode.scaleX = 1.1;
        }

        var self = this;
        util.updataGrade(gameData.gameGradeXP,function(data,duan,xing,name){//根据当前总经验获取一些段位界面需要的数据
            self.playGradeTxt.string = gameData.gameGradeName+gameData.gameGradeXing+"星";
            util.loadSprite("hall/grade/jiangbei"+duan, cc.find("left/head_info/play_grade",self.node));
        });


        var doGetPr = function(data) {
            self._propData = data;
            for(var i = 0;i<data.length;i++){
                if(data[i]["id"] == gameData.playHeadFrame){//保证有这个东西
                    if(data[i]["prop_type"] == 1){//确认是头像框
                        util.loadSprite("hall/bag/prop/"+gameData.playHeadFrame, cc.find("left/head_info/head_frame",self.node));
                    }
                }
            }
        };
        if (config.PropInfoData) {
            doGetPr(config.PropInfoData);
        }else{
            util.loadJsonFile("json/GamePropInfo_Common", function (data) {
                config.PropInfoData = data;
                if (config.PropInfoData) {
                    doGetPr(config.PropInfoData);
                    //
                }
            });
        }

        
        util.log("touxiangkuangid == ================" +gameData.playHeadFrame);


        
        // util.log("135151req3r1344444444444444 == "+ util.showNumber(0));
        this.initLabels();

        // setVisible(gameData.isTipGrade ==  1);
        
        //签到界面是否显示
         if(gameData.isSign && gameData.isSign["weekSignDay"] >= 0 && !gameData.isFirstLoginSign){//显示界面
             var self = this;
             gameData.isFirstLoginSign = true;//首次弹出后，不在弹出
             for(var i in gameData.isSign["signInWeeklyStatus"]){
                 var item =  gameData.isSign["signInWeeklyStatus"][i];
                 if(item == 0){
                    self._isShowSign = true;
                     var sign_node = new cc.Node();
                     var action =  cc.sequence(cc.delayTime(1.5), cc.callFunc(function (){
                         util.loadPrefab("signLayer",function(data){
                             var signLayer = cc.instantiate(data);
                             self.node.addChild(signLayer);
                         });
                     }));
                     sign_node.runAction(action);
                     break;
                 }else{
                    self._isShowSign = false;
                 }
             }
         }
         

         util.log("mjf-- playerIsInRoom == "+gameData.playerIsInRoom);
         

        this.scheduleOnce(function() {
            // 这里的 this 指向 component，脚本是component
            this.initPHB();
        }, 0.6);
        
        this.scheduleOnce(function() {
            // util.refreshAllRedStatus();
            //不弹签到的弹框，如果有返回房间的提示就弹返回房间提示
         var self = this;
         util.refreshAllRedStatus(function(){
            if(!self._isShowSign && gameData.playerIsInRoom){//有返回房间的提示
                self.scheduleOnce(function() {
                    util.tip({
                        node : self.node,
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
                }, 1.5);
            }
         });
        }, 2);
        var firstPos = this.noticeTxt.node.x;//文字的初始位置
        var maskWidth = cc.find("centerPmd/notice/panel",this.node).width;
        util.log("滑动框的大小  ==  "+maskWidth);
        this.schedule(function () {
            var url = gameData.hallSvrUrl + "/script/";
            var playId = gameData.uid;
            var pString = "?playerId="+playId;
            util.httpGet(url+'marquee/info'+pString,
                function (response) {
                    var respJsonInfo = JSON.parse(response);
                    util.log("respJsonInfo ========="+JSON.stringify(respJsonInfo));
                    if(respJsonInfo["code"] == "0"){
                        var msg = JSON.parse(respJsonInfo['msg']);
                        util.log("跑马灯文字 ==  "+ msg["marquee"]);
                        self.noticeTxt.string = msg["marquee"];
                        util.log("test ==  "+ self.noticeTxt.node.x);
                        util.log("test ==  "+ maskWidth);
                        util.log("test ==  "+ self.noticeTxt.node.width);
                        util.log("test ==  "+ parseInt(self.noticeTxt.node.x-maskWidth-self.noticeTxt.node.width-10));
                    } else {
                        util.log("跑马灯获取失败 ===  "+respJsonInfo["code"]);
                    }
                }
            );
        },60,cc.REPEAT_FOREVER,1.5);
        
        this.scheduleOnce(function() {
            var that = self; 
            util.log("2111111  == "+self.noticeTxt.string);
            if(!self.noticeTxt.string){
                util.log("test1111");
                self.noticeTxt.string = "河南家乡棋牌火爆上线，活动丰富，奖品拿到手软，快叫上小伙伴一起玩耍吧！";
            }
            that.noticeTxt.node.stopAllActions();
            that.noticeTxt.node.x = firstPos;
            var time = Math.abs(parseInt(firstPos-maskWidth-that.noticeTxt.node.width-10))/50;
            that.noticeTxt.node.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.moveTo(time,cc.p(firstPos-maskWidth-that.noticeTxt.node.width-10,that.noticeTxt.node.y)),
                        cc.callFunc(function(){
                            that.noticeTxt.node.x = firstPos;
                        })
                    )
                )
            );
        }, 2);
        
        
        
        
        // this.noticeTxt.node.runAction(
        //     cc.repeatForever(
        //         // cc.sequence(
        //         //     cc.moveTo(6, 301, 3),
        //         //     cc.moveTo(0, -301, 3)
        //         // )
        //     )
        // );

        //排行榜
        //this.initPHB();
        //排行榜默认点击左边
        this.isClickLeft(true);
        // this._phbLeftContent = cc.find("leftPhb/phb/scrollviewleft/view/content",this.node);
        // this._phbLeftItemTemp = this._phbLeftContent.children[0];
        // this._phbLeftContent.removeChild(this._phbLeftItemTemp); 

        // this._phbRightContent = cc.find("leftPhb/phb/scrollviewright/view/content",this.node);
        // this._phbRightItemTemp = this._phbRightContent.children[0];
        // this._phbRightContent.removeChild(this._phbRightItemTemp); 
        

    

        //添加头像点击监听
        util.addClickEvent(this.sprHeadImg.node,this.node,"HallScene","onBtnClicked");

        this.initButtonHandler("Canvas/rightDown/btn_friendRoom");
        this.initButtonHandler("Canvas/left/head_info/play_grade");
        this.initButtonHandler("Canvas/left/btn_box");
        this.initButtonHandler("Canvas/center/centerAnim/btn_task");
        this.initButtonHandler("Canvas/center/centerAnim/btn_mail");
        this.initButtonHandler("Canvas/right/btn_tuidaohu");
        this.initButtonHandler("Canvas/center/centerAnim/btn_shop");
        this.initButtonHandler("Canvas/center/centerAnim/btn_bag");
        this.initButtonHandler("Canvas/center/centerAnim/btn_setting");
        this.initButtonHandler("Canvas/center/centerAnim/btn_activity");
        this.initButtonHandler("Canvas/right/btn_switch");

        this.addListeners();

        //播放背景音乐 (暂时这样写)
        var musicstatus = util.getLocalValue('musicStatus');
        if(musicstatus && musicstatus == 1){
            // cc.audioEngine.stop(this.bgmAudioID1);
            // cc.audioEngine.stopAll();
            // this.bgmAudioID1 = -1;
            // var audioUrl = cc.url.raw("resources/sound/bgMain.mp3");
            // this.bgmAudioID1 = cc.audioEngine.playMusic(audioUrl,true,1.0);
            // this.bgmAudioID1 = cc.audioEngine.play(audioUrl,true,1.0);
            sdk.stopMusic();
            var audioUrl = cc.url.raw(config.musicPath);
            sdk.playMusic(audioUrl);
            util.log("播放背景音乐1--有音乐--hallScene_statr--musicstatus==1");
        }else if(musicstatus && musicstatus == 2){//gameData.musicStatus 1 是开 2 是关
            // cc.audioEngine.stop(this.bgmAudioID2);
            // cc.audioEngine.stopAll();
            // this.bgmAudioID1 = -1;
            // var audioUrl = cc.url.raw("resources/sound/silence.mp3");
            // this.bgmAudioID2 = cc.audioEngine.playMusic(audioUrl,true,1.0);
            // this.bgmAudioID2 = cc.audioEngine.play(audioUrl,true,1.0);

            sdk.stopMusic();
            var audioUrl = cc.url.raw(config.silencePath);
            sdk.playMusic(audioUrl);
            util.log("播放背景音乐2--静音音乐--hallScene_statr--musicstatus==2");
        }else{//新用户
            audioUtils.playBGM(config.musicPath);
            // sdk.playMusic(config.musicPath);
            util.log("播放背景音乐3--you音乐--hallScene_statr--新用户");
        }
        // if (gameData.musicStatus) {
        //     audioUtils.playBGM("resources/sound/bgMain.mp3");
        // }

        this.playHallAnim();
        // util.log("btn_change1234 == "+config.hallDefaulrSelGameId);
        // config.hallDefaulrSelGameId = 1001;

        //console.log("特效:",this.effectsArr[0]);

        // 金豆特效
        cc.find("left/game_bean/jindou_texiao", this.node).getComponent(cc.Animation).stop("jindou");
        cc.find("left/game_bean/jindou_texiao", this.node).getComponent(cc.Animation).play("jindou");
        // 钻石特效
        cc.find("left/game_diamond/zuanshi_texiao", this.node).getComponent(cc.Animation).stop("zuanshi");
        cc.find("left/game_diamond/zuanshi_texiao", this.node).getComponent(cc.Animation).play("zuanshi");
        // 流光特效
        cc.find("right/btn_gameType/effect/effect_1", this.node).stopAllActions();
        cc.find("right/btn_gameType/effect/effect_1", this.node).runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(6, 301, 3),
                    cc.moveTo(0, -301, 3)
                )
            )
        );
        cc.find("right/btn_gameType/effect/effect_2", this.node).stopAllActions();
        cc.find("right/btn_gameType/effect/effect_2", this.node).runAction(
            cc.repeatForever(
                cc.spawn(
                    cc.sequence(
                        cc.moveTo(3.5, -288, 3),
                        cc.moveTo(0, 288, 3),

                        cc.moveTo(3.5, -288, 3),
                        cc.moveTo(0, 288, 3)
                    ),
                    cc.sequence(
                        cc.fadeTo(0, 0),
                        cc.delayTime(1.7),
                        cc.fadeTo(0.4, 255),
                        cc.delayTime(1.4),

                        cc.delayTime(1.4),
                        cc.fadeTo(0.4, 0),
                        cc.delayTime(1.7)
                    )
                )
            )
        );
        util.preloadGameScene(this.node);

        sdk.getPlayerHead(gameData.headimgurl, cc.find("left/head_info/head", this.node));


        util.log("大厅场景start结束");
     },
    initLabels:function(){
        this.playName.string = gameData.nickname;
        this.playID.string = "ID: " + gameData.uid;
        this.gameBean.string = util.showNum(gameData.gameBean);//
        this.gameDiamond.string = util.showNum(gameData.gameDiamond);
        if(gameData.onlineNum){
            for(var i = 0;i<gameData.onlineNum.length;i++){
                if(gameData.onlineNum[i].gameId == config.HENAN_TUIDAOHU){//在线人数
                    gameData.tuidaohuLevel1Num = gameData.onlineNum[i].gameLevels[0];
                    gameData.tuidaohuLevel2Num = gameData.onlineNum[i].gameLevels[1];
                    gameData.tuidaohuLevel3Num = gameData.onlineNum[i].gameLevels[2];
                }else if(gameData.onlineNum[i].gameId == config.HENAN_ZHENGZHOU){
                    gameData.zhengzhouLevel1Num = gameData.onlineNum[i].gameLevels[0];
                    gameData.zhengzhouLevel2Num = gameData.onlineNum[i].gameLevels[1];
                    gameData.zhengzhouLevel3Num = gameData.onlineNum[i].gameLevels[2];
                }else if(gameData.onlineNum[i].gameId == config.HENAN_XINYANG){
                    gameData.xinyangLevel1Num = gameData.onlineNum[i].gameLevels[0];
                    gameData.xinyangLevel2Num = gameData.onlineNum[i].gameLevels[1];
                    gameData.xinyangLevel3Num = gameData.onlineNum[i].gameLevels[2];
                }else if(gameData.onlineNum[i].gameId == config.HENAN_PAODEKUAI){
                    gameData.pdkLevel1NUm = gameData.onlineNum[i].gameLevels[0];
                    gameData.pdkLevel2NUm = gameData.onlineNum[i].gameLevels[1];
                    gameData.pdkLevel3NUm = gameData.onlineNum[i].gameLevels[2];
                    gameData.pdkLevel4NUm = gameData.onlineNum[i].gameLevels[3];
                    gameData.pdkLevel5NUm = gameData.onlineNum[i].gameLevels[4];
                    gameData.pdkLevel6NUm = gameData.onlineNum[i].gameLevels[5];
                }else if(gameData.onlineNum[i].gameId == config.HENAN_NANYANG){
                    gameData.nanyangLevel1Num = gameData.onlineNum[i].gameLevels[0];
                    gameData.nanyangLevel2Num = gameData.onlineNum[i].gameLevels[1];
                    gameData.nanyangLevel3Num = gameData.onlineNum[i].gameLevels[2];
                }else if(gameData.onlineNum[i].gameId == config.HENAN_ZHOUKOU){
                    gameData.zhoukouLevel1Num = gameData.onlineNum[i].gameLevels[0];
                    gameData.zhoukouLevel2Num = gameData.onlineNum[i].gameLevels[1];
                    gameData.zhoukouLevel3Num = gameData.onlineNum[i].gameLevels[2];
                }
            }
        }
        this.tuidaohuPlayerNum.string = gameData.tuidaohuLevel1Num + gameData.tuidaohuLevel2Num + gameData.tuidaohuLevel3Num;

        this.otherPlayerNum.string = gameData.zhengzhouLevel1Num + gameData.zhengzhouLevel2Num + gameData.zhengzhouLevel3Num;
        // this.xinyangPlayerNum.string = gameData.xinyangLevel1Num + gameData.xinyangLevel2Num + gameData.xinyangLevel3Num;
        this.pdkPlayerNum.string = gameData.pdkLevel1NUm + gameData.pdkLevel2NUm + gameData.pdkLevel3NUm + gameData.pdkLevel4NUm + gameData.pdkLevel5NUm + gameData.pdkLevel6NUm;
        // this.schedule(function () {
        //     sdk.getUserCoupons(this.dianjuanTxt);
        // },5,cc.REPEAT_FOREVER,1);
        

    },
    //监听的方法--begin
    playHallAnim:function(){
        this.anim.stop("hallAnim");
        this.anim.play("hallAnim");
     },
    setPlayerInfo:function(){
        this.gameBean.string = util.showNum(gameData.gameBean);//
        this.gameDiamond.string = util.showNum(gameData.gameDiamond);

        this.taskTip.setVisible(gameData.isTipTask || 0);
        this.mailTip.setVisible(gameData.isTipMail_1 || gameData.isTipMail_2 );
        this.gradeTip.setVisible(gameData.isTipGrade || 0);
        this.activeTip.setVisible(gameData.isTipShare || 0);
        //首充宝箱
        if(gameData.firstRecharge == 0){
            cc.find("Canvas/left/btn_box").active = true;
        }else{
            cc.find("Canvas/left/btn_box").active = false;
        }
    },
    setHallBtnImg:function(){
        if (!gameData.selectMapId) {
            gameData.selectMapId = config.hallDefaulrSelGameId;
        }
        util.loadSprite("hall/hall/majiangImg_"+gameData.selectMapId, cc.find("right/btn_gameType/majiangImg1",this.node));
        //设置在线人数
        if(gameData.selectMapId == 1001){
            this.otherPlayerNum.string = gameData.tuidaohuLevel1Num + gameData.tuidaohuLevel2Num + gameData.tuidaohuLevel3Num;
        }else if(gameData.selectMapId == 1101){
            this.otherPlayerNum.string = gameData.zhengzhouLevel1Num + gameData.zhengzhouLevel2Num + gameData.zhengzhouLevel3Num;
        }else if(gameData.selectMapId == 1201){
            this.otherPlayerNum.string = gameData.xinyangLevel1Num + gameData.xinyangLevel2Num + gameData.xinyangLevel3Num;
        }else if(gameData.selectMapId == 1301){
            this.otherPlayerNum.string = gameData.nanyangLevel1Num + gameData.nanyangLevel2Num + gameData.nanyangLevel3Num;
        }else if(gameData.selectMapId == 1401){
            this.otherPlayerNum.string = gameData.zhoukouLevel1Num + gameData.zhoukouLevel2Num + gameData.zhoukouLevel3Num;
        }else if(gameData.selectMapId == 100){
            this.otherPlayerNum.string = gameData.pdkLevel1NUm + gameData.pdkLevel2NUm + gameData.pdkLevel3NUm + gameData.pdkLevel4NUm + gameData.pdkLevel5NUm + gameData.pdkLevel6NUm;
        }

        
    },

    setHeadFrame:function(str){
        util.loadSprite(str, cc.find("left/head_info/head_frame",this.node));
    },
    //监听的方法--end
    onDestroy () {
        this.node.off('playHallAnim', function (event) {
            this.playHallAnim();
        }, this);//动画监听
        this.node.off("updatePHB", this.updatePHB, this);//pai

        this.node.off('setPlayerInfo', function (event) {
            this.setPlayerInfo();
        }, this);//金豆 钻石 监听 （可以扩展）
        this.node.off('setHallBtnImg', function (event) {
            this.setHallBtnImg();
          }, this);//
        this.removeListeners();
    },
    initButtonHandler:function(btnPath){
        var btn = cc.find(btnPath);
        util.addClickEvent(btn,this.node,"HallScene","onBtnClicked");        
    },
    updatePHB:function(){
        this.phbLeft = false;
        this.phbRight = false;
        this.initPHB();
    },
    //排行榜相关--begin
    initPHB:function(){
        var self = this;
        util.getPHBStatus(
            function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){
                    util.log("PHB成功 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);
                    self.phbMsg = msg;
                    self.initPHBList(1);
                }else if(respJsonInfo["code"] == "0"){
                    util.log("getPHBStatus === 0 ");
                }else{
                    util.log("getPHBStatus ===  "+respJsonInfo["code"]);
                }
            },
        null,null);
    },
    initPHBList:function(isLeft){
        if (!this.phbMsg) {
            return;
        }
        // util.log("dataPHB ========="+JSON.stringify(this.phbMsg.winCountTop50));
        var data;
        if (isLeft) {
            data = this.phbMsg.winCountTop50;
        }else{
            data = this.phbMsg.happyBeansTop50;
        }
        var length = data.length;
        length = length > 20 ? 20 : length;

        this.tableView = cc.find("leftPhb/phb/tableView", this.node);
        var self = this;
        this.tableView.getComponent(cc.tableView).initTableView(length, { array: data, target: self });
        this.tableView.getComponent(cc.tableView).reload();
        // 左边
        // if (isLeft) {
        //     // 已创建
        //     if (this.phbLeft) {
        //         return;
        //     }
        //     //左边胜局排行榜
        //     var length = this.phbMsg.winCountTop50.length;
        //     length = length > 20 ? 20 : length;
        //     var self = this;
        //     for(let i = 0; i < length; ++i ){
        //         let data = this.phbMsg.winCountTop50[i];
        //         let node = this.getphbLeftItem(i);
        //         node.idx = i;
        //         node.playerId = data["playerId"];
        //         //名字
        //         cc.find("phb_name",node).getComponent(cc.Label).string = data["nickName"];
        //         //头像
        //         let head = cc.find("phb_head",node);
        //         head.runAction(
        //             cc.sequence(
        //                 cc.delayTime(i*1 + 2),
        //                 cc.callFunc(function () {
        //                     sdk.getPlayerHead(data["headImageUrl"], head, function (node) {
        //                         node.active = true;
        //                     });
        //                 }, this)
        //             )
        //         );
                
        //         //胜局数
        //         cc.find("phb_number",node).getComponent(cc.Label).string = "总胜局 "+data["winCount"];
        //         //段位图标
        //         // util.log("PHB左边WinTop50  经验值： == " + data["winCountTop50"][i]["rankXp"]);
        //         util.updataGrade(data["rankXp"],function(data,duan,xing,name){
        //             util.loadSprite("hall/grade/jiangbei"+duan, cc.find("gradePic",node));
        //         });
        //         if(i <= 2){
        //             cc.find("first_pic",node).active = true;
        //             cc.find("label",node).active = false;
        //             util.loadSprite("hall/paiming_"+parseInt(i+1), cc.find("first_pic",node));
        //         }else{
        //             cc.find("first_pic",node).active = false;
        //             cc.find("label",node).active = true;
        //             cc.find("label",node).getComponent(cc.Label).string = parseInt(i+1).toString();
        //         }
        //     }
        //     this.phbLeft = true;
        // }
        // if (!isLeft) {
        //     if (this.phbRight) {
        //         return;
        //     }
        //     //右边财富 排行榜
        //     var length = this.phbMsg.happyBeansTop50.length;
        //     length = length > 20 ? 20 : length;
        //     var self = this;
        //     for(let i = 0; i < length; ++i ){
        //         let data = this.phbMsg.happyBeansTop50[i];
        //         let node = this.getphbRightItem(i);
        //         node.idx = i;
        //         node.playerId = data["playerId"];
        //         //名字
        //         cc.find("phb_name",node).getComponent(cc.Label).string = data["nickName"];
        //         //头像
        //         let head = cc.find("phb_head",node);
        //         head.runAction(
        //             cc.sequence(
        //                 cc.delayTime(i*1 + 2),
        //                 cc.callFunc(function () {
        //                     sdk.getPlayerHead(data["headImageUrl"], head, function (node) {
        //                         node.active = true;
        //                     });
        //                 }, this)
        //             )
        //         );
        //         //金豆数
        //         cc.find("phb_number",node).getComponent(cc.Label).string = "金豆总数 "+util.showNum(data["happyBeans"]);
        //         //段位图标
        //         util.updataGrade(data["rankXp"],function(data,duan,xing,name){
        //             util.loadSprite("hall/grade/jiangbei"+duan, cc.find("gradePic",node));
        //         });
        //         if(i <= 2){
        //             cc.find("first_pic",node).active = true;
        //             cc.find("label",node).active = false;
        //             util.loadSprite("hall/paiming_"+parseInt(i+1), cc.find("first_pic",node));
        //         }else{
        //             cc.find("first_pic",node).active = false;
        //             cc.find("label",node).active = true;
        //             cc.find("label",node).getComponent(cc.Label).string = parseInt(i+1).toString();
        //         }
        //     }
        //     this.phbRight = true;
        // }
    },
    // getphbLeftItem:function(index){
    //     var phbLeftContent = this._phbLeftContent;
    //     if(phbLeftContent.childrenCount > index){//已经添加过了
    //         return phbLeftContent.children[index];
    //     }
        
    //     var node = cc.instantiate(this._phbLeftItemTemp);
    //     phbLeftContent.addChild(node);
    //     return node;
    // },
    // getphbRightItem:function(index){
    //     var phbRightContent = this._phbRightContent;
    //     if(phbRightContent.childrenCount > index){//已经添加过了
    //         return phbRightContent.children[index];
    //     }
        
    //     var node = cc.instantiate(this._phbRightItemTemp);
    //     phbRightContent.addChild(node);
    //     return node;
    // },
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
        // this.leftNode.active = isLeft;
        // this.rightNode.active = !isLeft;
        cc.find("leftPhb/phb/tableView", this.node).getComponent(cc.tableView).clear();
        this.initPHBList(isLeft);
    },
    onBtnLeftRankItem:function(event){
        audioUtils.playClickSoundEffect();
        // var idx = event.target.idx;
        // util.log("点击按钮的IDX  == " + idx);
        // var playerId = event.target.playerId;
    
        var self = this;
        util.loadPrefab("userInfo",function(data){
            var userInfoNode = cc.instantiate(data);
            util.getInfoStatus(
                playerId,
                function(respJsonInfo){
                    if(respJsonInfo["code"] == "0"){
                        if(util.isNodeExist(self.node,"userInfoNode")){//防止多次触摸
                            return;
                        }
                        util.log("Info成功 +=== "+ respJsonInfo['msg']);
                        var msg = JSON.parse(respJsonInfo['msg']);
                        userInfoNode.getComponent("userInfoScene").setUserInfoData(msg);
                        userInfoNode.getComponent("userInfoScene").setBg(1);
                        userInfoNode.setName("userInfoNode");
                        self.node.addChild(userInfoNode);
                    }else if(respJsonInfo["code"] == "0"){
                        util.log("getInfoStatus === 0 ");
                    }else{
                        util.log("getInfoStatus === 2 ");
                    }
                },
            null,null);
        });
    },
    onBtnRightRankItem:function(event){
        audioUtils.playClickSoundEffect();
        var idx = event.target.idx;
        util.log("点击按钮的IDX  == " + idx);
        var playerId = event.target.playerId;
    
        var self = this;
        util.loadPrefab("userInfo",function(data){
            var userInfoNode = cc.instantiate(data);
            util.getInfoStatus(
                playerId,
                function(respJsonInfo){
                    if(respJsonInfo["code"] == "0"){
                        if(util.isNodeExist(self.node,"userInfoNode")){//防止多次触摸
                            return;
                        }
                        util.log("Info成功 +=== "+ respJsonInfo['msg']);
                        var msg = JSON.parse(respJsonInfo['msg']);
                        userInfoNode.getComponent("userInfoScene").setUserInfoData(msg);
                        userInfoNode.getComponent("userInfoScene").setBg(1);
                        userInfoNode.setName("userInfoNode");
                        self.node.addChild(userInfoNode);
                    }else if(respJsonInfo["code"] == "0"){
                        util.log("getInfoStatus === 0 ");
                    }else{
                        util.log("getInfoStatus === 2 ");
                    }
                },
            null,null);
        });
    },
    //排行榜相关--end

    //点击信阳按钮（敬请期待）
    onBtnXinYang:function(){
        audioUtils.playCloseSoundEffect();
        // util.tip(this.node,1);
        // util.tip({
        //     node : this.node,
        //     type : 1
        // });
        //sdk.shareURl();
        if(gameData.isshowpdkbtn){
            gameData.mapId = config.HENAN_PAODEKUAI;
            this.createMoreField(gameData.mapId);
        }else{
            gameData.mapId = config.HENAN_XINYANG;
            this.createMoreField(gameData.mapId);
        }
        
    },
    
    
    //点击按钮回调
    onBtnClicked:function(event){
        var nowTime = (new Date()).getTime();
        var timeInterval = (nowTime - this.lastClickTime)/1000;
        if (this.lastClickTime === 0 || timeInterval > 1) {
            util.log("hunter---点击的时间间隔：" + (nowTime - this.lastClickTime));
            audioUtils.playClickSoundEffect();
            if(event.target.name == "head"){
            
                var self = this;
                util.loadPrefab("userInfo",function(data){
                    var userInfoNode = cc.instantiate(data);
                    util.getInfoStatus(
                        gameData.uid,
                        function(respJsonInfo){
                            if(respJsonInfo["code"] == "0"){
                                if(util.isNodeExist(self.node,"userInfoNode")){//防止多次触摸
                                    return;
                                }
                                util.log("Info成功 +=== "+ respJsonInfo['msg']);
                                var msg = JSON.parse(respJsonInfo['msg']);
                                userInfoNode.getComponent("userInfoScene").setUserInfoData(msg);
                                userInfoNode.getComponent("userInfoScene").setBg(1);
                                userInfoNode.setName("userInfoNode");
                                self.node.addChild(userInfoNode);
                            }else if(respJsonInfo["code"] == "0"){
                                util.log("getInfoStatus === 0 ");
                            }else{
                                util.log("getInfoStatus === 2 ");
                            }
                        },
                    null,null);
                });
            }
            else if(event.target.name == "btn_friendRoom"){
                // this.friendRoom.active = true;
                // var friendRoomNode = cc.instantiate(this.friendRoomPrefab);
                // this.node.addChild(friendRoomNode);
                var self = this;
                util.loadPrefab("friendRoom",function(data){
                    var friendRoomNode = cc.instantiate(data);
                    util.getRecordStatus(
                        function(respJsonInfo){
                            if(respJsonInfo["code"] == "0"){
                                if(util.isNodeExist(self.node,"friendRoomNode")){//防止多次触摸
                                    return;
                                }
                                util.log("Record成功 +=== "+ respJsonInfo['msg']);
                                var msg = JSON.parse(respJsonInfo['msg']);
                                util.log("Record  === "+ msg);
                                friendRoomNode.getComponent("FriendRoomLayer").setRecordData(msg);
                                friendRoomNode.setName("friendRoomNode");
                                self.node.addChild(friendRoomNode);
                            }else{
                                util.log("getRecordStatus:"+respJsonInfo["code"]);
                            }
                        },
                    null,null);
                    
                });
            }
            else if(event.target.name == "btn_tuidaohu"){
                gameData.mapId = config.HENAN_TUIDAOHU;
                this.createMoreField(gameData.mapId);
            }
            else if(event.target.name == "btn_gameType"){
                gameData.mapId = gameData.selectMapId;
                this.createMoreField(gameData.selectMapId);
            }
            else if(event.target.name == "btn_task"){

                var self = this;
                util.loadPrefab("taskLayer",function(data){
                    if(util.isNodeExist(self.node,"task_node")){//防止多次触摸
                        return;
                    }
                    var task_node = cc.instantiate(data);
                    task_node.setName("task_node");
                    self.node.addChild(task_node);
                    util.getTaskStatus(
                        function(respJsonInfo){
                            if(respJsonInfo["code"] == "0"){
                                //util.log("任务成功 +=== "+ respJsonInfo['msg']);
                                var msg = JSON.parse(respJsonInfo['msg']);
                                util.log("task  === "+ msg);
                                task_node.getComponent("taskLayer").setTaskData(msg);
                                task_node.getComponent("taskLayer").setBg(1);

                            }else{
                                util.log("getTaskStatus error code:"+respJsonInfo["code"]);
                            }
                        },
                        null,null);
                });


            }
            else if(event.target.name == "btn_mail"){
                var self = this;
                util.loadPrefab("mailLayer",function(data){
                    var mailLayer = cc.instantiate(data);
                    util.getMailStatus(
                        function(respJsonInfo){
                            if(respJsonInfo["code"] == "0"){
                                if(util.isNodeExist(self.node,"mailLayer")){//防止多次触摸
                                    return;
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
            }
            else if(event.target.name == "play_grade"){
                var self = this;
                var data = "";
                util.loadPrefab("gradeLayer",function(data){
                    var gradeLayer = cc.instantiate(data);
                    util.getAwardStatus(
                        function(respJsonInfo){
                            if(respJsonInfo["code"] == "0"){
                                if(util.isNodeExist(self.node,"gradeLayer")){//防止多次触摸
                                    return;
                                }
                                util.log("Award成功 +=== "+ respJsonInfo['msg']);
                                var msg = JSON.parse(respJsonInfo['msg']);
            
                                gradeLayer.getComponent("gradeLayer").setAwardData(msg);
                                gradeLayer.setName("gradeLayer");
                                self.node.addChild(gradeLayer);
                            }else if(respJsonInfo["code"] == "0"){
                                util.log("getAwardStatus === 0 ");
                            }else{
                                util.log("getAwardStatus ===  " + respJsonInfo["code"]);
                            }
                        },
                    null,null);
                    //var mailLayer = data.data;
                });
            }
            else if(event.target.name == "btn_shop"){
                var self = this;
                util.loadPrefab("shopLayer",function(data){
                    if(util.isNodeExist(self.node,"shopLayer")){//防止多次触摸
                        return;
                    }
                    var shopLayer = cc.instantiate(data);
                    shopLayer.setName("shopLayer");
                    shopLayer.getComponent("shopLayer").setfirstLayer("bean");
                    self.node.addChild(shopLayer);
                });

            }
            else if(event.target.name == "btn_bag"){
                var self = this;
                util.loadPrefab("bagLayer",function(data){
                    var bagLayer = cc.instantiate(data);
                    util.getCheckBagStatus(
                        function(respJsonInfo){
                            if(respJsonInfo["code"] == "0"){
                                util.log("CheckBag成功 +=== "+ respJsonInfo['msg']);
                                if(util.isNodeExist(self.node,"bagLayer")){//防止多次触摸
                                    return;
                                }
                                var msg = JSON.parse(respJsonInfo['msg']);
                                util.log("CheckBag  === "+ msg);
                                util.log("CheckBag  === "+ msg["backPackAllPile"]);

                                bagLayer.getComponent("bagLayer").setBagData(msg);
                                bagLayer.setName("bagLayer");
                                self.node.addChild(bagLayer);
                            }else if(respJsonInfo["code"] == "0"){
                                util.log("getCheckBagStatus === 0 ");
                            }else{
                                util.log("getCheckBagStatus ===  "+ respJsonInfo["code"]);
                            }
                        },
                    null,null);
                });
            }
            else if(event.target.name == "btn_box"){
                var self = this;
                util.loadPrefab("boxLayer",function(data){
                    if(util.isNodeExist(self.node,"boxLayer")){//防止多次触摸
                        return;
                    }
                    var boxLayer = cc.instantiate(data);
                    boxLayer.setName("boxLayer");
                    self.node.addChild(boxLayer);
                });
            }
            else if(event.target.name == "btn_setting"){
                
                var self = this;
                util.loadPrefab("setting",function(data){
                    var settingLayer = cc.instantiate(data);
                    util.getSettingStatus(
                       function(respJsonInfo){
                           if(respJsonInfo["code"] == "0"){
                                if(util.isNodeExist(self.node,"settingLayer")){//防止多次触摸
                                    return;
                                }
                                var msg = JSON.parse(respJsonInfo['msg']);

                                settingLayer.getComponent("settingLayer").setSettingData(msg);
                                settingLayer.setName("settingLayer");
                                self.node.addChild(settingLayer);
                           }else if(respJsonInfo["code"] == "0"){
                               util.log("getsettingStatus === 0 ");
                           }else{
                               util.log("getsettingStatus ===  " + respJsonInfo["code"]);
                           }
                       },
                    null,null);
                });
            }
            else if(event.target.name == "btn_activity"){
                var self = this;
                util.loadPrefab("activityLayer",function(data){
                    var activityLayer = cc.instantiate(data);

                    util.getShareStatus(function (respJsonInfo) {
                        if(respJsonInfo["code"] == 0 || respJsonInfo["code"] == -210 || respJsonInfo["code"] == -220
                          || respJsonInfo["code"] == -240 || respJsonInfo["code"] == -250 || respJsonInfo["code"] == -200){
                            util.log("getShareStatus:"+respJsonInfo["code"]);
                            util.log("respJsonInfo:"+respJsonInfo);
                            if(util.isNodeExist(self.node,"activityLayer")){//防止多次触摸
                                return;
                            }
                            activityLayer.getComponent("activityLayer").setShareData(respJsonInfo);
                            activityLayer.setName("activityLayer");
                            self.node.addChild(activityLayer);
                        }else {
                            util.log("getShareStatus-0---:"+respJsonInfo["code"]);
                        }
                    });

                });
            }
            else if(event.target.name == "btn_switch"){
                // this.moreAreas.active = true;
                var self = this;
                util.loadPrefab("moreAreas",function(data){
                    if(util.isNodeExist(self.node,"moreAreasNode")){//防止多次触摸
                        return;
                    }
                    var moreAreasNode = cc.instantiate(data);
                    moreAreasNode.setName("moreAreasNode");
                    self.node.addChild(moreAreasNode);
                });
                // var moreAreasNode = cc.instantiate(this.moreAreasPrefab);
                // this.node.addChild(moreAreasNode);
            }
            this.lastClickTime = nowTime;
        }
    },
    onBtnBuyBean:function(){
        audioUtils.playClickSoundEffect();
        var self = this;
        util.loadPrefab("shopLayer",function(data){
            if(util.isNodeExist(self.node,"shopLayer")){//防止多次触摸
                return;
            }
            var shopLayer = cc.instantiate(data);
            shopLayer.setName("shopLayer");
            shopLayer.getComponent("shopLayer").setfirstLayer("bean");
            self.node.addChild(shopLayer);
        });
    },
    onBtnBuyDiamond:function(){
        audioUtils.playClickSoundEffect();
        var self = this;
        util.loadPrefab("shopLayer",function(data){
            if(util.isNodeExist(self.node,"shopLayer")){//防止多次触摸
                return;
            }
            var shopLayer = cc.instantiate(data);
            shopLayer.getComponent("shopLayer").setfirstLayer("diamond");
            shopLayer.setName("shopLayer");
            self.node.addChild(shopLayer);
        });
    },
    onJoinRoomClicked:function(){
        audioUtils.playClickSoundEffect();
        this.joinRoom.active = true;
    },

    // update (dt) {},

    addListeners () {
        // 好友场
        network.addListener(3002, function (data, errorCode) {
            util.log("network 3002...............");
            if (errorCode) {
                var errorMsg = "3002 errorCode:" + errorCode;
                if (errorCode == -20) errorMsg = '房间号不存在, 请重新输入';
                if (errorCode == -30) errorMsg = '该房间已满4人, 无法加入';
                if (errorCode == -60) errorMsg = '该房间已开始, 无法加入';
                if (errorCode == -70) errorMsg = '您还不是该俱乐部成员，无法加入房间';
                if (errorCode == -40) errorMsg = '本房间为AA制房间，您的房卡不足，请购卡';
                if (errorCode == -2) errorMsg = decodeURIComponent(data['msg']);
                if (errorCode == -1){
                    errorMsg = "该房间已结束";
                    gameData.playerIsInRoom = false;
                }; 
                util.tip2(errorMsg);
                return;
            }
            gameData.appId = data.app_id;
            gameData.mapId = data.mapid;
            gameData.kindId = data.gameKind;
            gameData.roomId = data.room_id;
            gameData.all_rule["rule_shouchuxuanze"] = data.firstchu;
            gameData.all_rule["rule_youdabichu"] = data.qiangzhi;
            gameData.all_rule["rule_xiajuxianchu"] = data.nextfirstchu;
            gameData.rule_jushu = data.totalRound;
            gameData.createData = data;
            util.log("network 3002 -- hallScene..............."+gameData.appId);
            util.enterGameScene();
            
        });
        // 匹配场
        network.addListener(2202, function (data, errorCode) {
            util.log("network 2202...............");
            if (errorCode) {
                var errorMsg = "2202 errorCode:" + errorCode;
                if (errorCode == -20) errorMsg = '房间号不存在, 请重新输入';
                if (errorCode == -30) errorMsg = '该房间已满4人, 无法加入';
                if (errorCode == -60) errorMsg = '该房间已开始, 无法加入';
                if (errorCode == -70) errorMsg = '您还不是该俱乐部成员，无法加入房间';
                if (errorCode == -40) errorMsg = '本房间为AA制房间，您的房卡不足，请购卡';
                if (errorCode == -2) errorMsg = decodeURIComponent(data['msg']);
                util.tip2(errorMsg);
                return;
            }
            gameData.appId = data.app_id;
            gameData.mapId = data.mapId;
            gameData.kindId = data.gameKind;
            gameData.roomId = data.room_id;
            gameData.mateLevel = data.piLevel;
            gameData.createData = data;
            
            gameData.all_rule["rule_shouchuxuanze"] = data.firstchu;
            gameData.all_rule["rule_youdabichu"] = data.qiangzhi;
            gameData.all_rule["rule_xiajuxianchu"] = data.nextfirstchu;
            gameData.rule_jushu = data.totalRound;
            
            gameData.createData.players[0].score = gameData.createData.players[0].happybeans;

            util.log("network 2202 -- hallScene..............."+gameData.appId);
            util.enterGameScene()
        });
        // 断线重连
        network.addListener(3006, function (data, errorCode) {
            gameData.appId = data.app_id;
            gameData.mapId = data.mapid;
            gameData.kindId = data.gameKind;
            gameData.mateLevel = data.gameLevel;
            gameData.roomId = data.room_id;
            
            gameData.all_rule["rule_youdabichu"] = data.qiangzhi;
            gameData.all_rule["rule_shouchuxuanze"] = data.firstchu;
            gameData.all_rule["rule_xiajuxianchu"] = data.nextfirstchu;
            gameData.rule_jushu = data.totalRound;
            
            gameData.reconnectData = data;

            util.enterGameScene()
        });
    },

    removeListeners () {
        network.removeListeners([3002, 2202]);
    },

    createMoreField (type) {
        let self = this;
        util.refreshAllRedStatus(function(){
            if(gameData.playerIsInRoom){//有返回房间的提示
                // this.scheduleOnce(function() {
                    util.tip({
                        node : self.node,
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

                if(gameData.mapId == config.HENAN_TUIDAOHU 
                    || gameData.mapId == config.HENAN_ZHENGZHOU //郑州
                    || gameData.mapId == config.HENAN_XINYANG //信阳
                    || gameData.mapId == config.HENAN_NANYANG //南阳
                    || gameData.mapId == config.HENAN_ZHOUKOU //周口
                    || gameData.mapId == config.HENAN_ZHUMADIAN //驻马店
                    || gameData.mapId == config.HENAN_XINXIANG //新乡
                    || gameData.mapId == config.HENAN_YONGCHENG //永城 
                    || gameData.mapId == config.HENAN_SHANGQIU){ //商丘
                    util.log("加载的场景  type = == "+ type);
                    self.loadMaJiang(type);   
                }else{
                    self.loadPDK(type);
                }
            }
        });
    },
    loadMaJiang : function(type){
        var that = this;
        util.loadPrefab("moreField",function(data){
            if(util.isNodeExist(that.node,"moreField")){//防止多次触摸
                return;
            }
            let moreField = cc.instantiate(data);;
            moreField.getComponent("moreFieldLayer").initScene(type);
            moreField.setName("moreField");
            that.node.addChild(moreField);
        });
    },
    loadPDK : function(type){
        var that = this;
        util.loadPrefab("moreField_pdk",function(data){
            if(util.isNodeExist(that.node,"moreField_pdk")){//防止多次触摸
                return;
            }
            let moreField_pdk = cc.instantiate(data);;
            moreField_pdk.getComponent("moreField_pdk").initScene(type);
            moreField_pdk.setName("moreField_pdk");
            that.node.addChild(moreField_pdk);
        });
    },
    //随机播放金豆、钻石、推倒胡等特效
    playBtnItemEffect:function(i,name,delayTime){
        //未实现完成....
        //var that = this;
        //var doSomething = function (i,name) {
        //    that.effectsArr[i].stop("jindou");
        //    that.effectsArr[i].play("jindou");
        //};
        //this.schedule(function(i,name) {
        //   doSomething(i,name);
        //}, delayTime);

    },
    // 结束游戏
    onBtnClose () {
        audioUtils.playCloseSoundEffect();
        sdk.closeGame();
    },
    // 收起游戏
    onBtnHide () {
        sdk.hideGame();
    },
});
