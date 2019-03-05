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

        _settingData:null,

        _btnYXOpen:null,
        _btnYXClose:null,
        _btnYYOpen:null,
        _btnYYClose:null,
        _btnZhenDongOpen:null,
        _btnZhenDongClose:null,
        _isChange:false,


        fankuiLayer:cc.Node,
        editbox:{
            default: null,
            type: cc.EditBox
        },
        select_point:{
            default: [],
            type: cc.Node
        },
        headImg: {
            default: null,
            type: cc.Sprite
        },
        headImgFrame: {
            default: null,
            type: cc.Sprite
        },
        nickName: {
            default: null,
            type: cc.Label
        },

        anim:cc.Animation,
        shipeiCenterNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function() {
        //
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.shipeiCenterNode.scale = 0.8;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.shipeiCenterNode.scale = 0.85;
        } 
        //
        //填写反馈信息的UI界面
        this.fankuiLayer.active = false;
        //音效开关
        // this._btnYXOpen = this.node.getChildByName("effect").getChildByName("btn_openEffect");
        // this._btnYXClose = this.node.getChildByName("effect").getChildByName("btn_closeEffect");
        this._btnYXOpen = cc.find("centerNode/center/effect/btn_openEffect",this.node);
        this._btnYXClose = cc.find("centerNode/center/effect/btn_closeEffect",this.node);
        //音乐开关
        // this._btnYYOpen = this.node.getChildByName("music").getChildByName("btn_openMusic");
        // this._btnYYClose = this.node.getChildByName("music").getChildByName("btn_closeMusic");
        this._btnYYOpen = cc.find("centerNode/center/music/btn_openMusic",this.node);
        this._btnYYClose = cc.find("centerNode/center/music/btn_closeMusic",this.node);
        //震动开关
        // this._btnZhenDongOpen = this.node.getChildByName("zhendong").getChildByName("btn_openZhenDong");
        // this._btnZhenDongClose = this.node.getChildByName("zhendong").getChildByName("btn_closeZhenDong");
        this._btnZhenDongOpen = cc.find("centerNode/center/zhendong/btn_openZhenDong",this.node);
        this._btnZhenDongClose = cc.find("centerNode/center/zhendong/btn_closeZhenDong",this.node);
        //
        this.initButtonHandler(this._btnYXOpen);
        this.initButtonHandler(this._btnYXClose);
        this.initButtonHandler(this._btnYYOpen);
        this.initButtonHandler(this._btnYYClose);
        this.initButtonHandler(this._btnZhenDongOpen);
        this.initButtonHandler(this._btnZhenDongClose);

        gameData.musicStatus = this._settingData["musicStatus"];
        gameData.effectStatus = this._settingData["soundEffectStatus"];
        gameData.shakeStatus = this._settingData["shakeStatus"];

        //如果是老玩家，卸载了包，服务器有数据，但本地没数据，播放音乐按照新用户来
        var musicstatus = util.getLocalValue('musicStatus');
        if(musicstatus == 1 || musicstatus == 2){//有存储
            gameData.musicStatus = this._settingData["musicStatus"];
        }else{
            gameData.musicStatus = 1;//在hallScene 没有获取到本地数据自动播放音乐
        }

        util.log("gameData.musicStatus  == " + gameData.musicStatus);
        util.log("gameData.effectStatus  == " + gameData.effectStatus);
        util.log("gameData.shakeStatus  == " + gameData.shakeStatus);

        //this._btnYYOpen.active = gameData.musicStatus > 0;
        //this._btnYYClose.active = !this._btnYYOpen.active;
        this.setSelectPoint(0,gameData.musicStatus);
        this.setSelectPoint(1,gameData.effectStatus);
        this.setSelectPoint(2,gameData.shakeStatus);
        util.log("settingLayer ----   gameData.musicStatus == "+gameData.musicStatus);
        util.log("settingLayer ----   gameData.effectStatus == "+gameData.effectStatus);
        util.log("settingLayer ----   gameData.shakeStatus == "+gameData.shakeStatus);
        //
        sdk.getPlayerHead(gameData.headimgurl, this.headImg.node);
        this.nickName.string = gameData.nickname;
        if (gameData.playHeadFrame) {
            util.loadSprite("hall/bag/prop/"+gameData.playHeadFrame, this.headImgFrame.node);
        }
        //
        this.playSetAnim();

        var versionLabel = cc.find("centerNode/center/kefu/Label_version",this.node);
        versionLabel.getComponent(cc.Label).string = "版本号：v" + config.version;
    },
    playSetAnim:function(){
        this.anim.stop("setAnim");
        this.anim.play("setAnim");
    },
    setSettingData:function(data){
        this._settingData = data["gameSetting"];
        util.log("setSettingData == " + this._settingData);
    },
    initButtonHandler:function(btn){
        util.addClickEvent(btn,this.node,"settingLayer","onBtnClicked");    
    },
    onBtnClicked:function(event){
        audioUtils.playClickSoundEffect();
        if(event.target.name == "btn_openEffect"){
            this._isChange = true;
            gameData.effectStatus = 2;

            this.setSelectPoint(1,gameData.effectStatus);
        }
        else if(event.target.name == "btn_closeEffect"){
            this._isChange = true;
            gameData.effectStatus = 1;
            this.setSelectPoint(1,gameData.effectStatus)
        }
        else if(event.target.name == "btn_openMusic"){
            this._isChange = true;
            
            this.setSelectPoint(0,2);
            gameData.musicStatus = 2;
        }else if(event.target.name == "btn_closeMusic"){

            this._isChange = true;
            this.setSelectPoint(0,1);
            gameData.musicStatus = 1;
        }
        else if(event.target.name == "btn_openZhenDong"){
            this._isChange = true;
            gameData.shakeStatus = 2;
            this.setSelectPoint(2,gameData.shakeStatus);
        }else if(event.target.name == "btn_closeZhenDong"){
            this._isChange = true;
            gameData.shakeStatus = 1;
            this.setSelectPoint(2,gameData.shakeStatus);
        }
    },
    //设置点位置
    setSelectPoint: function (type,state) {//type :effect/music state:on/off
        var pos = cc.p(0,0);
     switch (type){
         case 0://音乐
             if(state == 2){//关闭
                //  audioUtils.setBGMVolume(0);
                 audioUtils.setChangeBgm(0);
                 this._btnYYOpen.active = false;
                 this._btnYYClose.active = true;
                 pos = cc.p(-215,135);
                 this.select_point[0].setPosition(pos);
             }
             else if(state == 1){//
                //  audioUtils.setBGMVolume(1.0);
                 audioUtils.setChangeBgm(1);
                 this._btnYYOpen.active = true;
                 this._btnYYClose.active = false;

                 pos = cc.p(-117,135);
                 this.select_point[0].setPosition(pos);
             }

             break;
         case 1://音效
             if(state == 2){
                 audioUtils.setSFXVolume(0);
                 this._btnYXOpen.active = false;
                 this._btnYXClose.active = true;
                 pos = cc.p(-215,42);
                 this.select_point[1].setPosition(pos);
             }
             else if(state == 1){
                 audioUtils.setSFXVolume(1.0);
                 this._btnYXOpen.active = true;
                 this._btnYXClose.active = false;

                 pos = cc.p(-117,42);
                 this.select_point[1].setPosition(pos);
             }
             break;
         case 2://震动
             if(state == 2){//
                 this._btnZhenDongOpen.active = false;
                 this._btnZhenDongClose.active = true;
                 pos = cc.p(-215,49);
                 this.select_point[2].setPosition(pos);
             }
             else if(state == 1){

                 this._btnZhenDongOpen.active = true;
                 this._btnZhenDongClose.active = false;
                 pos = cc.p(-117,49);
                 this.select_point[2].setPosition(pos);
             }
             break;
      }
    }
    ,
    onBtnfankui:function(){
        audioUtils.playClickSoundEffect();
        util.log("fankui");
        var that = this;
        util.loadPrefab("fankui",function(data){
            var fankuiNode = cc.instantiate(data);
            that.node.addChild(fankuiNode);
        });
    },
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        // getUpdateSettingStatus
        
        util.log("btnclose---------gameData.musicStatus== "+gameData.musicStatus);
        util.log("btnclose---------gameData.effectStatus== "+gameData.effectStatus);
        util.log("btnclose---------gameData.shakeStatus== "+gameData.shakeStatus);
            util.getUpdateSettingStatus(
                gameData.musicStatus,
                gameData.effectStatus,
                gameData.shakeStatus,
                function(respJsonInfo){
                    if(respJsonInfo["code"] == "0"){
                        util.log("UpdateSetting成功 +=== "+ respJsonInfo['msg']);
                
                        util.saveLocalOnlineSettings();//存储本地
                      
                    } else {
                        util.log("getUpdateSettingStatus ===  "+respJsonInfo["code"]);
                    }
                },
            null,null);
        
        this.node.destroy();
    },
    onBtnRules: function () {
        audioUtils.playClickSoundEffect();
        //规则
        console.log("--:规则");
        var that = this;
        util.loadPrefab("rulesLayer",function(data){
            var rulesNode = cc.instantiate(data);
            that.node.addChild(rulesNode);
        });
    },
    onBtnKeFu: function () {
        util.log("客服");
    },
    start:function () {

    },

    // update (dt) {},
});
