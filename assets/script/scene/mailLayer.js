cc.Class({
    extends: cc.Component,

    properties: {
        rewardLayer:cc.Node,

        _mailData:null,
        _mailContent:null,
        _mailItemTemp:null,
        _leftBtnData:null,
        _nowClickBtnId:null,
        mailItem:{
            default:null,
            type:cc.Prefab
        },
        award_node:{
            default:null,
            type:cc.Node
        },
        mail_biaoti_txt:{
            default:null,
            type:cc.Label
        },
        mail_content_txt:{
            default:null,
            type:cc.Label
        },
        btn_yilingqu:cc.Node,
        mail_kong:cc.Node,
        anim:cc.Animation,
        shipeiCenterNode:cc.Node,
    },

    onLoad:function(){

        //
        if(gameData.canvasWidth/gameData.canvasHeight<1.5){//按照平板4:3来处理
            this.shipeiCenterNode.scale = 0.8;
        }else if(gameData.canvasWidth/gameData.canvasHeight<1.64){
            this.shipeiCenterNode.scale = 0.85;
        } 
        //
       // console.log("数据：",this._mailData);
        //this.setMailData(msg);
        this.rewardLayer.active = false;

        this._mailContent = cc.find("centerNode/center/mailList/view/content",this.node);
        this._mailItemTemp = this._mailContent.children[0];
        this._mailContent.removeChild(this._mailItemTemp);
        util.log("this._mailData.length == " + this._mailData.length);
        if(this._mailData === 0){
            this._mailContent.active = false;
            this.mail_kong.active = true;
        }else {
            this.mail_kong.active = false;
        }

        this.initMailList(this._mailData);

        this.btn_yilingqu_state  = this.rewardLayer.getChildByName("award_node").getChildByName("btn_yilingqu_receive");
        this.btn_receive_state = this.rewardLayer.getChildByName("award_node").getChildByName("btn_receive");
        this.btn_yilingqu_state.active = false;
        this.btn_receive_state.active = true;

        this.playMailAnim();
    },
    playMailAnim:function(){
        this.anim.stop("mailAnim");
        this.anim.play("mailAnim");
    },
    btnHandler:function(btn){
        util.addClickEvent(btn,this.node,"mailLayer","onBtnClicked");
    },
    onBtnClicked:function(event){
        audioUtils.playClickSoundEffect();
        if(event.target.name == "btn_chakan"){

            this.onBtnChaKan(event);

        }else if(event.target.name == "btn_lingqu"){

            this.onBtnReward(event);
        }
    },
    setMailData:function(data){
        this._mailData = data["mailInfos"];
        util.log("mailData == " + this._mailData);
    },
    onBtnClose:function(){
        audioUtils.playCloseSoundEffect();
        this.node.destroy();
    },
    onBtnCloseReward:function(){
        audioUtils.playCloseSoundEffect();
        this.rewardLayer.active = false;
    },
    initMailList:function(data){
        for(var i = 0; i < data.length; ++i ){
            // 根据messageStatus 来确定是否可领取奖励
            // node.getChildByName("txt_image").getComponent(cc.Sprite).spriteFrame = this.leftBtnPic[i];
            var node= this.mailPrefab(data[i]);
            node.idx = i;
            this._mailContent.addChild(node,i);
        }
        if(data.length > 0){

        }
    },
    //取得指定Item预制物
    mailPrefab: function (data,i) {

        var mailNode = cc.instantiate(this.mailItem);
        mailNode.idx = i;
        mailNode._award = data.messageAwards;
        mailNode.getChildByName("mail_biaoti").getComponent(cc.Label).string = data.messageTitle1;
        mailNode.getChildByName("mail_content").getComponent(cc.Label).string = data.messageTitle2;
        var time = (new Date(data.createTime)).getTime();
        mailNode.getChildByName("mail_time").getComponent(cc.Label).string = util.getDateDiff(time);

        if(data.messageAwardStatus == undefined){//无奖励时，无这个字段

            mailNode.getChildByName("btn_chakan").active = true;
            mailNode.getChildByName("btn_lingqu").active = false;


        }else {

            if(data.messageAwardStatus == 0){//显示未领奖

                mailNode.getChildByName("btn_chakan").active = false;
                mailNode.getChildByName("btn_lingqu").active = true;

            }else if(data.messageAwardStatus == 1){
                mailNode.getChildByName("btn_chakan").active = true;
                mailNode.getChildByName("btn_lingqu").active = false;
            }

        }

        this.btn_lingqu = mailNode.getChildByName("btn_lingqu");
        this.btnHandler(this.btn_lingqu);
        this.btn_chakan = mailNode.getChildByName("btn_chakan");
        this.btnHandler(this.btn_chakan);

        return mailNode;
    },
    refreshMailItem : function (state,index) {
       var node = this.getMailItemFromIndex(index);
        //console.log("node:",node);
        if(state == 0){//显示查看
            node.getChildByName("btn_chakan").active = false;
            node.getChildByName("btn_lingqu").active = true;
        }else if( state == 1){
            node.getChildByName("btn_chakan").active = true;
            node.getChildByName("btn_lingqu").active = false;
        }
    },
    refreshMailContentLingQuBtn : function (state) {

        if(state == 0){//显示亮的
            this.btn_yilingqu_state.active = false;
            this.btn_receive_state.active = true;
        }else if( state == 1){//显示灰的
            this.btn_yilingqu_state.active = true;
            this.btn_receive_state.active = false;
        }
    },
    //返回指定item
    getMailItemFromIndex: function (index) {
        var mailContent = this._mailContent;
        if(mailContent){
            return mailContent.children[index];
        }
    },
    //排序可能用到
    mailSort: function (data) {
        data.sort(function (a,b) {
            var aa = (new Date(a.createTime)).getTime();
            var bb = (new Date(b.createTime)).getTime();
            return bb - aa;
        });
    },
    onBtnReward:function(event){
        this.rewardLayer.active = true;
        var idx = event.target.parent.idx;
        this._nowClickBtnId = idx;
        this.showMailInfo();
    },
    onBtnChaKan:function(event){
        var that = this;
        this.rewardLayer.active = true;
        var idx = event.target.parent.idx;
        util.log("点击按钮的IDX  == " + idx+ "  "+this._mailData[idx]["messageOnlyId"]);
        this._nowClickBtnId = idx;
        this.showMailInfo();
    },
    showMailInfo: function () {
        var that = this;
        util.getMailChaKanStatus(this._mailData[this._nowClickBtnId]["messageOnlyId"], function (respJsonInfo) {
            if(respJsonInfo["code"] == "0"){

                var msg = JSON.parse(respJsonInfo['msg']);
                util.log("MailBtn查看+=== "+ JSON.stringify(msg["mailInfo"]));

                //that.award_node.active = true;
                that.mail_biaoti_txt.string = msg["mailInfo"].messageTitle1;
                that.mail_content_txt.string = msg["mailInfo"].messageTitle2;

                if(msg["mailInfo"].messageAwards == undefined){//无奖励
                    that.award_node.active = false;

                }else {//有奖励
                    that.award_node.active = true;
                    var messageAwards = msg["mailInfo"].messageAwards;
                    var _reward = messageAwards.split("_");
                    util.log("有奖励:"+_reward);
                    var award_tu =  that.rewardLayer.getChildByName("award_node").getChildByName("award_tu").getComponent(cc.Sprite);//.spriteFrame
                    var award_num =  that.rewardLayer.getChildByName("award_node").getChildByName("award_num").getComponent(cc.Label);

                    var _reward = messageAwards.split("_");//"2000_2_1"2000代表读取道具表 2第二条 1个数
                    var reward_type = _reward[0];//奖励类型
                    var reward_id =_reward[1];//奖励id
                    var rewardNum = _reward[2];//奖励num
                    var rewardData = {};
                    reward_id = reward_id < 0 ? 1:reward_id;
                    if (reward_type == 1000) {//读取货币表

                        rewardData= config.rewardTabel[reward_id - 1001];

                    } else if (reward_type == 2000) {//读取道具表
                        rewardData =  config.PropInfoData[reward_id - 1];

                    }
                    if(reward_type == 2000){
                        award_num.string = rewardNum;

                        util.loadSprite("hall/bag/prop/"+ rewardData["prop_img"],award_tu);
                    }else if(reward_type == 1000){
                        award_num.string = rewardNum;

                        if(reward_id == 1001){//豆子
                            util.loadSprite("hall/shop/bean/"+ rewardData["icon_name"],award_tu);
                        }else if(reward_id == 1002){//钻石
                            util.loadSprite("hall/shop/zuan/"+ rewardData["icon_name"],award_tu);
                        }

                    }
                }
                that.refreshMailContentLingQuBtn(msg["mailInfo"]["messageAwardStatus"]);
                that.refreshRed();

                //更改数据
                //that.refreshMailItem(msg["mailInfo"]["messageAwardStatus"],that._nowClickBtnId);

            }else{
                util.log("MailBtn查看 === 2 ");
            }
        });
    },
    onBtnReceive:function(){
        audioUtils.playClickSoundEffect();
        var that = this;
        util.getReceiveMailStatus(
            this._mailData[this._nowClickBtnId]["messageOnlyId"],
            this._mailData[this._nowClickBtnId]["messageId"],
            function(respJsonInfo){
                if(respJsonInfo["code"] == "0"){
                    util.log("MailBtn领取成功 +=== "+ respJsonInfo['msg']);
                    var msg = JSON.parse(respJsonInfo['msg']);
                   // util.log("MailBtn查看+=== "+ msg["mailInfo"]["messageStatus"]);
                    //更改数据
                    var playerMoney = msg['playerMoney'];
                    //
                    //TODO 领取货币增加的动画
                    if (playerMoney) {

                        gameData.gameBean = playerMoney["happyBeans"];
                        gameData.gameDiamond = playerMoney["diamond"];
                        that.node.parent.emit('setPlayerInfo');
                    }
                    //检测背包是否满
                    var playerBackPack = msg["playerBackPack"];
                    if(playerBackPack == undefined){//满了
                      //弹条
                        util.tip3(that.node,"背包已满,请清理背包后领取!");
                    }else {
                        var reward_info = msg["mailInfo"]["messageAwards"];
                        //恭喜获得
                        util.loadPrefab("gongxihuode",function(data){
                            var gongxihuode_node = cc.instantiate(data);
                            that.node.addChild(gongxihuode_node);
                            gongxihuode_node.getComponent("gongxihuode").setRewardData(reward_info);

                        });

                        that.refreshMailItem(1,that._nowClickBtnId);
                        //按钮置灰
                        that.refreshMailContentLingQuBtn(1);
                        that._mailData[that._nowClickBtnId]["messageAwardStatus"] = 1;
                        that._mailData[that._nowClickBtnId]["messageStatus"] = 1;
                        //领取刷
                        that.refreshRed();

                    }


                }else{
                    util.log("getMailStatus === 2 ");
                }
            },
        null,null);
        util.log("onBtnReceive1" + this._mailData[this._nowClickBtnId]["messageId"]);
    },
    //刷红点
    refreshRed: function () {

       for(var key in this._mailData){
           var data = this._mailData[key];
           if(data.messageAwardStatus == 0 || data.messageStatus == 0){//其中一个是0 显示红点
                gameData.isTipMail_1 = 1;
                gameData.isTipMail_2 = 1;
                if(gameData.hallNode){
                    gameData.hallNode.emit('setPlayerInfo');
                }
                break;
           }else if(data.messageAwardStatus == 1 && data.messageStatus == 1){//隐藏红点
                gameData.isTipMail_1 = 0;
                gameData.isTipMail_2 = 0;
                if(gameData.hallNode){
                    gameData.hallNode.emit('setPlayerInfo');
                }
           }
       }
    },
    start:function() {

    },

});
