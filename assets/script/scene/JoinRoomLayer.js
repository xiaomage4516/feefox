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
        showLabel : [],
        showNumber : [],
        btnJoin:cc.Node,
        showRuleLayer:cc.Node,
        fangzhu_label:cc.Label,
        jushu_label:cc.Label,
        wanfa_label:cc.Label,
        kuozhan_label:cc.Label,
        fanxing_label:cc.Label,

        centerNode:cc.Node,
        anim:cc.Animation,

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
        this.showRuleLayer.active = false;
        for (var i = 0; i < 6; i++) {
            this.showLabel[i] = cc.find("centerNode/center/shurutiao/N" + i, this.node);
        }
        this.playJoinRoomAnim();
    },
    playJoinRoomAnim:function(){
        this.anim.stop("joinRoomAnim");
        this.anim.play("joinRoomAnim");
    },

    start () {
        this.onBtnAgain();
        util.preloadGameScene(this.node);
    },

    // update (dt) {},

    onBtnClose () {
        audioUtils.playCloseSoundEffect();
        this.onBtnAgain();
        // this.node.active = false;
        // this.node.removeFromParent(false);
        this.node.destroy();
    },

    onBtnNumber (event, customEventData) {
        audioUtils.playClickSoundEffect();
        if (this.showNumber.length >= 6) {
            return;
        }

        this.showLabel[this.showNumber.length].getComponent(cc.Label).string = customEventData;
        this.showNumber.push(customEventData);

        if (this.showNumber.length === 6) {
            util.log("JoinRoomLayer onBtnNumber joinroom");
            //发送新协议 告诉前端房间号是否正确，房主 局数 玩法等信息
            // 监听协议 显示界面 立即加入按钮 发送3002
            var self = this;
            util.getJoinRoomInfoStatus(
                self.showNumber.join(""),
                function(respJsonInfo){
                    if(respJsonInfo["code"] == "0"){
                        util.log("RoomInfo成功 +=== "+ respJsonInfo['msg']);
                        var msg = JSON.parse(respJsonInfo['msg']);
                        util.log("RoomInfo  === "+ msg);
                        self.fangzhu_label.string = msg["preRoom"]["ownerName"];
                        self.jushu_label.string = msg["preRoom"]["totalRound"] + "局";
                        self.kuozhan_label.string = msg["preRoom"]["kuoZhan"];
                        self.fanxing_label.string = msg["preRoom"]["fanXing"];
                        self.wanfa_label.string = msg["preRoom"]["diQuWanFa"];

                        self.showRuleLayer.active = true;
                    }else if(respJsonInfo["code"] == "-1" || respJsonInfo["code"] == "-4" || respJsonInfo["code"] == "-5" || respJsonInfo["code"] == "-16"){
                        // util.log("getRoomInfoStatus: 游戏玩家id为空");
                        // util.log("getRoomInfoStatus: 没有找到该玩家");
                        // util.log("getRoomInfoStatus: 游戏服务器为空");
                        // util.log("getRoomInfoStatus: 房间id为空");
                        // util.tip(self.node,2,"该房间已关闭，再找找其他房间吧",null,null,null,false,true,false);

                        util.tip({
                            node : self.node,
                            type : 2,
                            string : "该房间已关闭，再找找其他房间吧",
                            leftCallback : null,
                            centerCallback : null,
                            rightCallback : null,
                            isShowLeftBtn : false,
                            isShowCenterBtn : true,
                            isShowRightBtn : false
                        });
                        // var self1 = self;
                        // util.loadPrefab("tipLayer",function(data){
                        //     var tipLayer = cc.instantiate(data);
                        //     self1.node.addChild(tipLayer);
                        //     tipLayer.getComponent("tipLayer").setTip(2,"该房间已关闭，再找找其他房间吧");
                        // });
                    }
                },
                null,null);
            // this.showRuleLayer.active = true;
            
        }
    },
    onBtnJoin:function(){
        audioUtils.playClickSoundEffect();
        var roomId = this.showNumber.join("");
        var url = gameData.hallSvrUrl + "/script/";
        url += "playType/choose/room";
        url += "?playerId="+gameData.uid;
        url += "&roomId="+roomId;
        util.log("url===="+url);
        util.httpGet(
            url,
            function (response) {
                var respJsonInfo = JSON.parse(response);
                util.log("respJsonInfo ========="+JSON.stringify(respJsonInfo));
                if(respJsonInfo["code"] == "0"){
                    var msg = JSON.parse(respJsonInfo['msg']);
                    if (config.forceConnectSelectGameSvr == false) {
                        // gameData.serverUrl = "ws://" + msg.serverInfo.ip
                        //     + ":" + msg.serverInfo.port + "/mqtt";
                        gameData.serverUrl = msg.serverInfo.url;
                    }
                    util.connectGameServer({
                        serverUrl : gameData.serverUrl,
                        openId : gameData.openid,
                        actionId : 3,
                        roomId : roomId,
                    });
                } else {
                    util.log("getBtnJoinStatus ===  "+respJsonInfo["code"]);
                    util.log("PlayType失败 +=== "+ respJsonInfo['msg']);
                }
            },
            function (statusText,responseText) {
            }
        );
    },
    onBtnRemove:function(){
        audioUtils.playCloseSoundEffect();
        this.showRuleLayer.active = false;
    },

    onBtnAgain () {
        
        for (var i = 0; i < 6; i++) {
            this.showLabel[i].getComponent(cc.Label).string = "";
        }
        this.showNumber = [];
    },

    onBtnBack () {
        audioUtils.playClickSoundEffect();
        this.showNumber.splice(this.showNumber.length - 1, 1);
        this.showLabel[this.showNumber.length].getComponent(cc.Label).string = "";
    },
});
