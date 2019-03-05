
//
//var signData1 = {
//    "loginSignInInfo":{
//        "lastModifyTime":"2018-04-06 01:04:19",
//        "monthLoginInDay":1,
//        "openId":"web_uid_1026",
//        "playerId":"103261",
//        "signInMonthlyStatus":[0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
//        "signInWeeklyStatus":[0,1,1,1,1,1,1], //0已过    1可领取  2未到
//        "weekLoginInDay":7
//    }
//};

cc.Class({
    extends: cc.Component,

    properties: {
        _nowSignNum:null,
        signNode: {
            default: [],
            type: cc.Node
        },
        signPoint: {
            default: [],
            type: cc.Node
        },
        totalSignLabel:cc.Label,
        centerNode:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        util.log("签到界面onLoad start");
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.centerNode.scale = 0.80;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.centerNode.scale = 0.85;
        }
        this.initLayer();

        var  signData =  gameData.isSign;
        this.totalSignLabel.string = signData.weekSignDay;
        this._nowSignNum =signData.weekSignDay;
     

        for(var i = 0 ;i < signData.signInWeeklyStatus.length ; i++) {
            var day = signData.signInWeeklyStatus[i];

            if(day == 0){//可领
                this.setBtnState(0,i);

            }else if(day == 1){//已领已签到
                this.setBtnState(1,i);

            }else if(day == 2){//未到达签到
                if(i > signData.weekSignDay - 1){
                    this.setBtnState(2,i);
                }else {
                    this.setBtnState(2,i);
                }

            }

            if(i == signData.weekSignDay * 1){
                this.signPoint[i].getChildByName("wei_dao_point").active = false;
                this.signPoint[i].getChildByName("yidao_point").active =false;
                this.signPoint[i].getChildByName("cur_point").active = true;
            }else if(i < signData.weekSignDay){
                this.signPoint[i].getChildByName("wei_dao_point").active = false;
                this.signPoint[i].getChildByName("yidao_point").active =true;
                this.signPoint[i].getChildByName("cur_point").active = false;
            }else {
                this.signPoint[i].getChildByName("wei_dao_point").active = true;
                this.signPoint[i].getChildByName("yidao_point").active =false;
                this.signPoint[i].getChildByName("cur_point").active = false;
            }
        }
        util.log("签到界面onLoad ended");
    },
    initLayer:function(){
        util.log("签到界面initLayer");
        var self = this;
        util.loadJsonFile("json/GameLoginSignIn_Common", function (data) {
            for(var i = 0;i<7;i++){
                // util.log("1234 == "+ data[i].icon);
                var itemNode = cc.find("centerNode/signLayout/sign_" + parseInt(i+1),self.node);
                cc.find("jinbi_num",itemNode).getComponent(cc.Label).string = "x "+ data[i].num;
                util.loadSprite("hall/sign/jinbi/" +data[i].icon, cc.find("spr_reward",itemNode));
            }
        });
    },
    onBtnSign:function(event,custom){
        audioUtils.playClickSoundEffect();
        console.log("--:custom:",custom);
        var that = this;
        var _custom =  parseInt(custom)
        util.log("第"+ _custom+"天签到");
        util.getSignStatus(
            _custom,
            function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){
                    util.log("Sign成功 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);

                    var playerMoney = msg['playerMoney'];
                    
                    util.log("已签到天数 == "+msg["weekSignDay"]);
                    that.totalSignLabel.string = msg["weekSignDay"];//add by majiangfan 
                    //
                    //TODO 领取货币增加的动画
                    if (playerMoney) {

                        gameData.gameBean = playerMoney["happyBeans"];
                        gameData.gameDiamond = playerMoney["diamond"];
                        that.node.parent.emit('setPlayerInfo');
                        if(gameData.morefieldNode){
                            gameData.morefieldNode.emit('setPlayerInfo');
                        }
                        
                    }

                    var idx = _custom - 1;
                    if (idx < 0)
                        idx = 0;
                    if (idx > 6)
                        idx = 6;

                    //0达到条件未签到可签到//1已签到并且已经发奖//2未达到条件不可签到
                    gameData.isSign["signInWeeklyStatus"][idx] = 1;

                    util.log("解析 +=== "+ msg);
                    util.loadPrefab("gongxihuode",function(data){
                        var gongxihuode_node = cc.instantiate(data);
                        that.node.addChild(gongxihuode_node);
                        
                        gongxihuode_node.getComponent("gongxihuode").setRewardData(msg["awards"]);

                        that.setBtnState(1,_custom*1-1);
                    });

                }else if(respJsonInfo["code"] == "0"){
                    util.log("getsignStatus === 0 ");
                }else{
                    util.log("getsignStatus ==== " + respJsonInfo["code"]);
                }
            },
        null,null);

    },
    onBtnClose: function () {
        audioUtils.playCloseSoundEffect();

        //弹签到的弹框，在关闭的时候如果有返回房间的提示就弹返回房间提示
        if(gameData.playerIsInRoom){//有返回房间的提示
            // this.scheduleOnce(function() {
                util.tip({
                    node : gameData.hallNode,
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
        }
        this.node.destroy();
        // var deps = cc.loader.getDependsRecursively("prefab/signLayer");
        // cc.loader.release(deps);

        
    },
    start:function() {
        util.log("签到界面start");
    },
    //
    setBtnState: function (state,index) {


     if(state == 0){
        cc.find("btn_no",this.signNode[index]).active = false;
        cc.find("btn_ok",this.signNode[index]).active = true
     }else if(state == 1){
         cc.find("btn_no",this.signNode[index]).active = true;
         cc.find("btn_ok",this.signNode[index]).active = false;
     }else if(state == 2){
         cc.find("btn_no",this.signNode[index]).active = false;
         cc.find("btn_ok",this.signNode[index]).active = false;
     }
},
    //
    // update (dt) {},
});
